// automatically supplied by info-beamer
uniform sampler2D Texture, Noise;
varying vec2 TexCoord;
uniform vec4 Color;

// custom
uniform float time;
uniform float granularity; // 0.002 is a good value, higher = more pixelly

// -- config --
const float ROW_SPEED_MULT = 10.0;
const float GRANULARITY  = 0.001;
const vec2 TEX_REPEAT_FACTOR = vec2(2.0, 2.0); // < 1 looks smeary, 1-2 looks nice

// use procedural noise (might be to slow for raspi)
//#define USE_PROC_NOISE

// --------------------

float randbase(vec2 n) {
#ifdef USE_PROC_NOISE
  return fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
#else
 #ifdef INFOBEAMER_PLAT_PI
  return texture2D(Noise, n).r;
 #else
  return texture2DLod(Noise, n, 0).r;
 #endif
#endif
}
float rand01(vec2 n) { return 0.5 + 0.5 * randbase(n); }
float rand  (vec2 n) { return randbase(n) * 2.0 - 1.0; }
float rowspeed(float y) { return ROW_SPEED_MULT * rand(vec2(0.0, y)); }

void main()
{
    vec2 uv = TexCoord;
    uv.y -= mod(uv.y, GRANULARITY);         // pixellate rows
    uv.x += rowspeed(uv.y) * time;              // move rows
    uv = mod(uv * TEX_REPEAT_FACTOR, 1.0);      // repeat texture

#ifdef INFOBEAMER_PLAT_PI
    vec4 c = texture2D(Texture, uv);
#else
    vec4 c = texture2DLod(Texture, uv, 0);
#endif
    gl_FragColor = c;
}
