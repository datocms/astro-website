// Draw a frame of cells (see format.ts) as the pixel effect, with WebGL2.
// The shader is the one of @overnice/datocms-pixel-video. The difference is
// the source: here each texel is already a layer (0–3), so the shader does
// not compute the brightness. A live frame can also have the TOP layer
// (4, see format.ts), with its own colours.

/** A colour as straight RGBA, 0–1. */
export type Rgba = [number, number, number, number];

/** What the renderer needs from the palette (see styles.ts). */
export interface DrawSettings {
  /** `ground` is null when the ground is the fill of the background layer. */
  colors: {
    fill: [Rgba, Rgba, Rgba];
    stroke: [Rgba, Rgba, Rgba];
    ground: Rgba | null;
    /** The colours of the TOP layer. Without them, TOP cells are HIGH. */
    top?: { fill: Rgba; stroke: Rgba };
  };
  /** For each layer: the squares have no strokes. */
  noStroke: [boolean, boolean, boolean];
  /** The background grid fills the whole canvas. */
  extend: boolean;
  /** The lens under the pointer. */
  hover: boolean;
}

// The lens, the same for all the videos. The dimensions are in cells of
// the video, thus the lens has the same size for the squares of each video.
const LENS = { radius: 20, distortion: 4, falloff: 8, pixelSize: 3, speed: 1 };

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
precision highp int;
precision highp usampler2D;

uniform vec2 uRes;            // canvas, device px
uniform usampler2D uFrame;    // one layer (0-4) for each cell
uniform ivec2 uFrameSize;
uniform bool uHasFrame;
uniform vec2 uOffset;         // contain-fit rect of the source, device px
uniform vec2 uDraw;

uniform int uLayers;          // 4 with the TOP layer, else 3
uniform float uSize[4];       // per layer, device px
uniform vec4 uFill[4];        // straight (not premultiplied) alpha
uniform vec4 uStroke[4];
uniform float uWeight;        // stroke weight, all layers: 1 CSS px, in device px
uniform bool uNoStroke[4];    // per layer: drawn without strokes
uniform bool uExtend;         // the background grid fills the whole canvas
uniform vec4 uGround;         // the colour under the squares
uniform bool uOwnGround;      // the ground is not the fill of the background layer

uniform bool uHover;
uniform vec2 uPointer;        // relative to the draw rect, device px
uniform float uTime;
uniform float uRadius, uDistort, uFalloff, uHoverSize;

out vec4 color;

// Half the stroke weight of the squares of a layer (0 = no stroke).
float halfWeight(int L) {
  return uNoStroke[L] ? 0.0 : uWeight * 0.5;
}

// Layer of the grid cell whose top-left corner is at local position o, or -1
// if nothing is drawn there. A TOP cell (4) is layer 3, or the highlight
// layer when there are no TOP colours.
int bucketAt(vec2 o) {
  if (o.x < 0.0 || o.y < 0.0 || o.x >= uDraw.x || o.y >= uDraw.y) return uExtend ? 0 : -1;
  ivec2 t = min(ivec2(floor(o * vec2(uFrameSize) / uDraw)), uFrameSize - 1);
  uint v = texelFetch(uFrame, t, 0).r;
  if (v == 3u) return -1;
  if (v >= 4u) return uLayers > 3 ? 3 : 2;
  return int(v);
}

// True if local position o is in the source.
bool inSource(vec2 o) {
  return o.x >= 0.0 && o.y >= 0.0 && o.x < uDraw.x && o.y < uDraw.y;
}

// True if the grid cell whose top-left corner is at local position o is in
// the source and is empty (a transparent pixel of the source).
bool emptyAt(vec2 o) {
  if (o.x < 0.0 || o.y < 0.0 || o.x >= uDraw.x || o.y >= uDraw.y) return false;
  ivec2 t = min(ivec2(floor(o * vec2(uFrameSize) / uDraw)), uFrameSize - 1);
  return texelFetch(uFrame, t, 0).r == 3u;
}

// The stroke colour of layer L at local position o. With an own ground, the
// background grid out of the source has the colour of the ground: thus a
// stroke of the background layer that is not the ground colour shows only on
// the subject, not on all the band.
vec4 strokeAt(int L, vec2 o) {
  return (L == 0 && uOwnGround && !inSource(o)) ? uGround : uStroke[L];
}

// Paint src (straight alpha) over dst (premultiplied).
vec4 over(vec4 dst, vec4 src) {
  return vec4(src.rgb * src.a, src.a) + dst * (1.0 - src.a);
}

void main() {
  // Top-left origin, like a 2D canvas.
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec4 col = over(vec4(0.0), uGround);

  if (!uHasFrame) { color = col; return; }
  vec2 local = p - uOffset;
  // The ground covers all of the canvas, but not an empty cell of the
  // background grid: there the page shows through.
  if (emptyAt(floor(local / uSize[0]) * uSize[0])) col = vec4(0.0);

  // Base mosaics, in a fixed order: later layers paint over earlier ones. A
  // stroke is half in the square and half in the cell next to it.
  for (int L = 0; L < 4; L++) {
    if (L >= uLayers) break;
    float ps = uSize[L];
    vec2 cell = floor(local / ps);
    vec2 f = local - cell * ps;
    float hw = halfWeight(L);
    bool edge = hw > 0.0 && (min(f.x, f.y) < hw || max(f.x, f.y) >= ps - hw);
    if (bucketAt(cell * ps) == L) {
      // Without an own ground, the fill of the background layer is already
      // the ground. Out of the source, the background grid has no fill.
      if (edge) col = over(col, strokeAt(L, cell * ps));
      else if (L > 0 || (uOwnGround && inSource(cell * ps))) col = over(col, uFill[L]);
    } else if (edge) {
      // The stroke of a neighbour cell of layer L. Its colour comes from that
      // cell: a cell of the background grid out of the source gives the
      // ground colour, also on an empty cell of the source next to it.
      vec2 d = vec2(f.x < hw ? -1.0 : f.x >= ps - hw ? 1.0 : 0.0,
                    f.y < hw ? -1.0 : f.y >= ps - hw ? 1.0 : 0.0);
      vec2 nx = (cell + vec2(d.x, 0.0)) * ps;
      vec2 ny = (cell + vec2(0.0, d.y)) * ps;
      vec2 nd = (cell + d) * ps;
      bool hx = d.x != 0.0 && bucketAt(nx) == L;
      bool hy = d.y != 0.0 && bucketAt(ny) == L;
      bool hd = d.x != 0.0 && d.y != 0.0 && bucketAt(nd) == L;
      if (hx || hy || hd) {
        bool subject = (hx && inSource(nx)) || (hy && inSource(ny)) || (hd && inSource(nd));
        col = over(col, subject ? uStroke[L] : strokeAt(L, hx ? nx : hy ? ny : nd));
      }
    }
  }

  // Hover lens: a coarser grid near the pointer. The size of each square
  // changes with the distance of its cell centre from a wobbling radius.
  if (uHover) {
    float hs = uHoverSize;
    vec2 cell = floor(local / hs);
    vec2 center = (cell + 0.5) * hs;
    vec2 d = center - uPointer;
    float dist = length(d);
    if (dist < uRadius + abs(uDistort) + hs) {
      float a = atan(d.y, d.x);
      float wobble = 0.5 * sin(a * 3.0 + uTime * 1.3)
                   + 0.3 * cos(a * 5.0 - uTime * 1.9 + 1.7)
                   + 0.2 * sin(a * 8.0 + uTime * 2.7 + 4.1);
      float r = uRadius + uDistort * wobble;
      float s = uFalloff > 0.0 ? clamp((r - dist) / uFalloff, 0.0, 1.0) : step(dist, r);
      int b = s > 0.0 ? bucketAt(cell * hs) : -1;
      if (b >= 0) {
        float half_ = hs * s * 0.5;
        float hw = halfWeight(b);
        vec2 q = abs(local - center);
        float m = max(q.x, q.y);
        // Out of the source, a square of the background grid has the ground colour.
        vec4 f = (b == 0 && uOwnGround && !inSource(center)) ? uGround : uFill[b];
        if (m < half_ + hw) col = over(col, (hw > 0.0 && m >= half_ - hw) ? strokeAt(b, center) : f);
      }
    }
  }

  color = col; // premultiplied, as the canvas expects
}`;

export interface Renderer {
  /** Use these cells for the next draw. Give the same array to skip the upload. */
  setFrame(cells: Uint8Array | null, width: number, height: number): void;
  /** Draw now. `time` is in seconds and moves the lens. */
  render(time: number): void;
  /** The pointer is on the canvas and the lens is on. */
  readonly hovering: boolean;
  destroy(): void;
}

/**
 * Start to draw into `canvas`. `getSettings` gives the current settings for
 * each draw. `onChange` runs when the canvas needs a new draw (resize,
 * pointer, restored context). `pointerArea` is the element that moves the
 * lens (the canvas when it is not set): use it when other elements are on
 * the canvas.
 */
export function createRenderer(
  canvas: HTMLCanvasElement,
  getSettings: () => DrawSettings,
  onChange: () => void,
  pointerArea: HTMLElement = canvas,
): Renderer {
  const gl = canvas.getContext('webgl2', { antialias: false, depth: false });
  if (!gl) throw new Error('WebGL2 is not available');

  let program: WebGLProgram;
  const locations = new Map<string, WebGLUniformLocation | null>();
  const u = (name: string) => {
    if (!locations.has(name)) locations.set(name, gl.getUniformLocation(program, name));
    return locations.get(name)!;
  };
  // The frame on the GPU. A new context needs a new upload.
  let uploaded: Uint8Array | null = null;
  let cells: Uint8Array | null = null;
  let frameW = 0;
  let frameH = 0;

  const setup = () => {
    const compile = (type: number, source: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(s) ?? '');
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(program) ?? '');
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    gl.useProgram(program);
    locations.clear();
    // One triangle that covers the canvas.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    // Integer textures need NEAREST.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.uniform1i(u('uFrame'), 0);
    gl.viewport(0, 0, canvas.width, canvas.height);
    uploaded = null;
  };

  let dpr = 1;
  let lost = false;
  const resize = () => {
    dpr = Math.min(devicePixelRatio, 2);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    onChange();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  let pointer: [number, number] | null = null;
  const track = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    pointer = [(e.clientX - rect.left) * dpr, (e.clientY - rect.top) * dpr];
    onChange();
  };
  const leave = () => {
    pointer = null;
    onChange();
  };
  const pointerEvents: [string, (e: PointerEvent) => void][] = [
    ['pointermove', track],
    ['pointerenter', track],
    ['pointerdown', track],
    ['pointerleave', leave],
    ['pointercancel', leave],
  ];
  for (const [type, fn] of pointerEvents) pointerArea.addEventListener(type, fn as EventListener);

  const onLost = (e: Event) => {
    e.preventDefault();
    lost = true;
  };
  const onRestored = () => {
    lost = false;
    setup();
    onChange();
  };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  setup();
  resize();

  const size = new Float32Array(4);
  const fill = new Float32Array(16);
  const stroke = new Float32Array(16);

  return {
    setFrame(next, width, height) {
      cells = next;
      frameW = width;
      frameH = height;
    },
    get hovering() {
      return getSettings().hover && pointer !== null;
    },
    render(time) {
      if (lost) return;
      const v = getSettings();
      const W = canvas.width;
      const H = canvas.height;
      gl.uniform2f(u('uRes'), W, H);
      const hasFrame = !!cells && frameW > 0 && frameH > 0;
      gl.uniform1i(u('uHasFrame'), hasFrame ? 1 : 0);
      // Device px for one cell of the video. Each square is one cell, and
      // the lens is in cells (see LENS).
      let cell = W / 100;
      if (hasFrame) {
        if (uploaded !== cells) {
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.R8UI,
            frameW,
            frameH,
            0,
            gl.RED_INTEGER,
            gl.UNSIGNED_BYTE,
            cells,
          );
          uploaded = cells;
        }
        gl.uniform2i(u('uFrameSize'), frameW, frameH);
        const s = Math.min(W / frameW, H / frameH);
        const drawW = frameW * s;
        const drawH = frameH * s;
        const offX = Math.floor((W - drawW) / 2);
        const offY = Math.floor((H - drawH) / 2);
        gl.uniform2f(u('uOffset'), offX, offY);
        gl.uniform2f(u('uDraw'), drawW, drawH);
        cell = drawW / frameW;
        const lens = v.hover && pointer !== null;
        gl.uniform1i(u('uHover'), lens ? 1 : 0);
        if (lens) gl.uniform2f(u('uPointer'), pointer![0] - offX, pointer![1] - offY);
      }
      // Squares are whole device px, so that the lines are sharp.
      const whole = (cells: number) => Math.max(1, Math.round(cells * cell));
      size.fill(whole(1));
      for (let i = 0; i < 3; i++) {
        fill.set(v.colors.fill[i]!, i * 4);
        stroke.set(v.colors.stroke[i]!, i * 4);
      }
      const top = v.colors.top;
      fill.set(top ? top.fill : v.colors.fill[2], 12);
      stroke.set(top ? top.stroke : v.colors.stroke[2], 12);
      gl.uniform1i(u('uLayers'), top ? 4 : 3);
      gl.uniform1fv(u('uSize'), size);
      gl.uniform4fv(u('uFill'), fill);
      gl.uniform4fv(u('uStroke'), stroke);
      gl.uniform4fv(u('uGround'), v.colors.ground ?? v.colors.fill[0]);
      gl.uniform1i(u('uOwnGround'), v.colors.ground ? 1 : 0);
      gl.uniform1f(u('uWeight'), Math.max(1, Math.round(dpr)));
      gl.uniform1iv(
        u('uNoStroke'),
        [...v.noStroke, v.noStroke[2]].map((off) => (off ? 1 : 0)),
      );
      gl.uniform1i(u('uExtend'), v.extend ? 1 : 0);
      gl.uniform1f(u('uTime'), time * LENS.speed);
      gl.uniform1f(u('uRadius'), LENS.radius * cell);
      gl.uniform1f(u('uDistort'), LENS.distortion * cell);
      gl.uniform1f(u('uFalloff'), LENS.falloff * cell);
      gl.uniform1f(u('uHoverSize'), whole(LENS.pixelSize));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    destroy() {
      observer.disconnect();
      for (const [type, fn] of pointerEvents)
        pointerArea.removeEventListener(type, fn as EventListener);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
