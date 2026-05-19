export const VERTEX_SHADER = `
attribute vec2 aPos;
void main(){
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

// Bayer-dithered diamond ink.
// Adapted from tympanus.net/Tutorials/BayerDithering/diamonds/ —
// fBm-driven coverage, 8x8 Bayer threshold, diamond pixel masks.
// Diagonal bias keeps the upper-left calm; everything else can spill.
// Pastel gradient is conic — pie wedges rotating around (0.75, 0.5).
export const FRAGMENT_SHADER = `
precision highp float;
uniform float uTime;
uniform vec2  uResolution;
uniform vec3  uAccent;
uniform vec2  uMouse;

float Bayer2(vec2 a){
  a = floor(a);
  return fract(a.x / 2.0 + a.y * a.y * 0.75);
}
#define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))

#define FBM_OCTAVES    5
#define FBM_LACUNARITY 1.25
#define FBM_GAIN       1.0
#define FBM_SCALE      4.0

float hash11(float n){ return fract(sin(n) * 43758.5453); }

float vnoise(vec3 p){
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  vec3 K  = vec3(1.0, 57.0, 113.0);
  float n000 = hash11(dot(ip + vec3(0.0, 0.0, 0.0), K));
  float n100 = hash11(dot(ip + vec3(1.0, 0.0, 0.0), K));
  float n010 = hash11(dot(ip + vec3(0.0, 1.0, 0.0), K));
  float n110 = hash11(dot(ip + vec3(1.0, 1.0, 0.0), K));
  float n001 = hash11(dot(ip + vec3(0.0, 0.0, 1.0), K));
  float n101 = hash11(dot(ip + vec3(1.0, 0.0, 1.0), K));
  float n011 = hash11(dot(ip + vec3(0.0, 1.0, 1.0), K));
  float n111 = hash11(dot(ip + vec3(1.0, 1.0, 1.0), K));
  vec3 w = fp * fp * fp * (fp * (fp * 6.0 - 15.0) + 10.0);
  float x00 = mix(n000, n100, w.x);
  float x10 = mix(n010, n110, w.x);
  float x01 = mix(n001, n101, w.x);
  float x11 = mix(n011, n111, w.x);
  float y0  = mix(x00, x10, w.y);
  float y1  = mix(x01, x11, w.y);
  return mix(y0, y1, w.z) * 2.0 - 1.0;
}

float fbm2(vec2 uv, float t){
  vec3 p   = vec3(uv * FBM_SCALE, t);
  float amp = 1.0;
  float fr  = 1.0;
  float sum = 1.0;
  for(int i = 0; i < FBM_OCTAVES; ++i){
    sum += amp * vnoise(p * fr);
    fr  *= FBM_LACUNARITY;
    amp *= FBM_GAIN;
  }
  return sum * 0.5 + 0.5;
}

float maskDiamond(vec2 p, float cov){
  float r = sqrt(cov) * 0.564;
  return step(abs(p.x - 0.49) + abs(p.y - 0.49), r);
}

vec3 diamondGradient(vec2 uv, float aspect, float t){
  vec3 c0 = vec3(0.78, 0.72, 0.96); // lavender
  vec3 c1 = vec3(0.68, 0.92, 0.82); // mint
  vec3 c2 = vec3(0.99, 0.80, 0.70); // peach
  vec3 c3 = vec3(0.70, 0.86, 0.99); // sky
  vec2 center = vec2(0.75, 0.5);
  vec2 dv = (uv - center) * vec2(aspect, 1.0);
  float ang = atan(dv.y, dv.x);
  float g = fract(ang / 6.28318 + 0.5 + t * 0.09);
  float seg = g * 4.0;
  float i = floor(seg);
  float f = smoothstep(0.0, 1.0, fract(seg));
  vec3 a, b;
  if(i < 1.0){ a = c0; b = c1; }
  else if(i < 2.0){ a = c1; b = c2; }
  else if(i < 3.0){ a = c2; b = c3; }
  else            { a = c3; b = c0; }
  return mix(a, b, f);
}

void main(){
  vec2 screenUV = gl_FragCoord.xy / uResolution.xy;

  float pixelSize = 3.0;
  vec2 fragCoord = gl_FragCoord.xy - uResolution * 0.5;
  float aspect = uResolution.x / uResolution.y;

  vec2 pixelUV = fract(fragCoord / pixelSize);
  float cellPixelSize = 8.0 * pixelSize;
  vec2 cellId = floor(fragCoord / cellPixelSize);
  vec2 cellCoord = cellId * cellPixelSize;
  vec2 fuv = cellCoord / uResolution.xy * vec2(aspect, 1.0);

  float feed = fbm2(fuv, uTime * 0.40);

  // 0 at top-left (calm), 1 at bottom-right (busy).
  float diag = clamp((screenUV.x + (1.0 - screenUV.y)) * 0.5, 0.0, 1.0);
  feed = feed * 0.5 - 0.55 + diag * 0.5;

  float bayer = Bayer8(fragCoord / pixelSize) - 0.5;
  float bw = step(0.5, feed + bayer);
  float M  = maskDiamond(pixelUV, bw);

  // Hold the left edge strictly white.
  M *= smoothstep(0.0, 0.18, screenUV.x);

  // Soft white hole under the cursor (aspect-corrected so it stays circular).
  float mDist = length((screenUV - uMouse) * vec2(aspect, 1.0));
  M *= smoothstep(0.15, 0.85, mDist);

  vec3 grad = diamondGradient(screenUV, aspect, uTime);
  vec3 col = mix(vec3(1.0), grad, M);
  gl_FragColor = vec4(col, 1.0);
}
`;
