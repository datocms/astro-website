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
export const DIAMONDS_FRAGMENT_SHADER = `
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

// Starry night sky — Earth rotation with depth parallax.
//
// All star layers rotate around the celestial pole (off-screen above centre),
// mimicking how Earth's spin makes stars arc across the sky. Each layer gets a
// slightly different angular speed: distant stars (tiny, dense) drift slower,
// nearby stars (large, sparse) move faster. The speed difference is artistically
// exaggerated to make the depth feel tangible — real parallax from rotation
// doesn't exist for stars, but it reads immediately as "depth".
//
// Layer speeds (rad/s) → full revolution durations:
//   s1  far      0.016  →  ~6.5 min
//   s2           0.022  →  ~4.7 min
//   s3           0.030  →  ~3.5 min
//   s4  close    0.042  →  ~2.5 min
//
// Nebula clouds rotate at the base rate and also drift slowly on their own.
export const NIGHT_SKY_FRAGMENT_SHADER = `
precision highp float;
uniform float uTime;
uniform vec2  uResolution;

float hash21(vec2 p){
  p = fract(p * vec2(127.1, 311.7));
  p += dot(p, p + 19.19);
  return fract(p.x * p.y);
}

float noise21(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i),              hash21(i + vec2(1.0, 0.0)), f.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p){
  float v = 0.0;
  float a = 0.5;
  for(int i = 0; i < 5; i++){
    v += a * noise21(p);
    p  = p * 2.0 + vec2(5.2, 1.3);
    a *= 0.5;
  }
  return v;
}

// Rotate point uv around center by angle (radians).
vec2 rotAround(vec2 uv, vec2 center, float angle){
  uv -= center;
  float c = cos(angle);
  float s = sin(angle);
  uv = vec2(uv.x * c - uv.y * s, uv.x * s + uv.y * c);
  return uv + center;
}

// Returns star brightness for a given (already rotated) UV.
float starField(vec2 uv, float res, float maxR){
  vec2 g = floor(uv * res);
  vec2 f = fract(uv * res) - 0.5;
  float h = hash21(g);
  if(h > 0.22) return 0.0;
  vec2  pos     = vec2(hash21(g + 0.3) - 0.5, hash21(g + 0.7) - 0.5);
  float twinkle = 0.65 + 0.35 * sin(uTime * (2.0 + h * 4.5) + h * 6.28318);
  float r       = maxR * (0.35 + 0.65 * hash21(g + 1.1));
  return smoothstep(r, r * 0.05, length(f - pos)) * twinkle;
}

// Shooting star — one independent stream keyed by seed.
// Time is divided into windows (WIN seconds each). Each window has a 45%
// chance of containing a meteor. Within the window the head travels from
// a random upper-area origin diagonally downward; the tail fades behind it.
// Returns combined streak + head-flare brightness.
float shootingStarStream(vec2 aUv, float asp, float seed){
  float WIN  = 6.0;
  float wId  = floor((uTime + seed) / WIN);
  float wT   = fract((uTime + seed) / WIN);

  if(hash21(vec2(wId, seed)) > 0.45) return 0.0;

  float tStart = 0.05 + hash21(vec2(wId, seed + 1.0)) * 0.45;
  float tDur   = 0.22 + hash21(vec2(wId, seed + 2.0)) * 0.12; // 0.22..0.34 of window = ~1.3-2s
  float anim   = (wT - tStart) / tDur;

  // alive during [0, 1] plus a slow fade-out
  if(anim < 0.0 || anim > 1.8) return 0.0;
  float envelope = smoothstep(0.0, 0.30, anim) * smoothstep(1.8, 0.70, anim);
  if(envelope < 0.001) return 0.0;
  float t = clamp(anim, 0.0, 1.0);

  // Start in the upper portion of the viewport
  vec2 origin = vec2(
    (0.05 + hash21(vec2(wId, seed + 3.0)) * 0.85) * asp,
    0.15 + hash21(vec2(wId, seed + 4.0)) * 0.60
  );
  float ang  = -(0.20 + hash21(vec2(wId, seed + 5.0)) * 0.40); // shallow downward diagonal
  vec2  dir  = vec2(cos(ang), sin(ang));
  float sLen = 0.30 + hash21(vec2(wId, seed + 6.0)) * 0.25; // longer path in aUv space

  vec2 headA = origin + dir * sLen * t;
  vec2 tailA = headA  - dir * sLen * 0.35; // tail is 35% of path length behind head

  // Signed distance to the head→tail segment
  vec2  pa = aUv - tailA;
  vec2  ba = headA - tailA;
  float hh = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  float d  = length(pa - ba * hh);

  // Streak: hair-thin, fades toward tail
  float streak = smoothstep(0.0018, 0.0001, d) * pow(hh, 0.6);
  // Flare: very small soft glow at the head
  float flare  = smoothstep(0.005, 0.0, length(aUv - headA)) * 0.5;

  return (streak + flare) * envelope;
}

void main(){
  vec2 uv   = gl_FragCoord.xy / uResolution.xy;
  float asp = uResolution.x / uResolution.y;
  vec2  aUv = uv * vec2(asp, 1.0);

  // Celestial pole: above the top-centre of the viewport (Polaris is off-screen).
  // Stars near the top trace tiny arcs; stars near the bottom sweep larger ones.
  vec2 pole = vec2(asp * 0.5, 1.5);

  // Base sky gradient
  vec3 col = mix(
    vec3(0.006, 0.010, 0.038),
    vec3(0.022, 0.034, 0.110),
    smoothstep(0.0, 1.0, uv.y)
  );

  // Vignette
  col *= 0.7 + 0.3 * (1.0 - smoothstep(0.3, 1.0, length((uv - 0.5) * vec2(asp, 1.0))));

  // Nebula clouds — rotate at the base rate, with a slow independent drift
  vec2 nUv = rotAround(aUv, pole, uTime * 0.016);
  float t  = uTime * 0.008;
  float n1 = fbm(nUv * 1.6 + vec2( t,  t * 0.5));
  float n2 = fbm(nUv * 2.8 - vec2( t * 0.6, -t * 0.4));
  col += vec3(0.010, 0.020, 0.090) * n1 * 0.9;
  col += vec3(0.035, 0.008, 0.065) * n2 * 0.45;

  // Four star layers — each rotates at its own speed around the pole.
  // Larger index = closer = faster angular velocity.
  vec2 r1 = rotAround(aUv, pole, uTime * 0.016);
  vec2 r2 = rotAround(aUv, pole, uTime * 0.022);
  vec2 r3 = rotAround(aUv, pole, uTime * 0.030);
  vec2 r4 = rotAround(aUv, pole, uTime * 0.042);

  float s1 = starField(r1, 90.0, 0.003); // distant, dense, tiny
  float s2 = starField(r2, 50.0, 0.005);
  float s3 = starField(r3, 22.0, 0.009);
  float s4 = starField(r4,  8.0, 0.016); // close, sparse, bright

  // Cool blue-white; occasional warm/golden stars
  vec3 cool = vec3(0.82, 0.91, 1.00);
  vec3 warm = vec3(1.00, 0.88, 0.62);
  vec3 scol = mix(cool, warm, step(0.78, hash21(floor(aUv * 50.0))));

  col += scol * (s1 * 0.55 + s2 * 0.85 + s3 * 1.30 + s4 * 2.00);

  // Two independent shooting-star streams (seeds offset so they rarely coincide)
  float meteor = shootingStarStream(aUv, asp, 0.0)
               + shootingStarStream(aUv, asp, 3.7);
  // Streak is cool blue-white; flare tip is slightly warm white
  col += mix(vec3(0.70, 0.82, 1.00), vec3(1.00, 0.97, 0.90), clamp(meteor * 0.5, 0.0, 1.0))
       * min(meteor, 1.2);

  gl_FragColor = vec4(col, 1.0);
}
`;
