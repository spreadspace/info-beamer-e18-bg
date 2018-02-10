// automatically supplied by info-beamer
uniform sampler2D Texture, Noise;
varying vec2 TexCoord;
uniform vec4 Color;

// custom
uniform float time;
uniform float randseed;
uniform float granularity; // 0.002 is a good value, higher = more pixelly

// -- config --
const float ROW_SPEED_MULT = 0.1;
const float GRANULARITY  = 0.002;
const vec2 TEX_REPEAT_FACTOR = vec2(0.5, 1.0); // < 1 looks smeary, 1-2 looks nice
const float ALPHA = 1.0; // 0.3 is good for debugging

// --------------------

float randbase(vec2 n) {
  // TODO: this can be replaced by noise texture lookup for speed on the RPi
  //return fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
#ifdef INFOBEAMER_PLAT_PI
    return texture2D(Noise, n).r;
#else
    return texture2DLod(Texture, n, 0).r;
#endif
}
float rand01(vec2 n) { return 0.5 + 0.5 * randbase(n); }
float rand  (vec2 n) { return randbase(n) * 2.0 - 1.0; }
float rowspeed(float y) { return ROW_SPEED_MULT * rand(vec2(randseed, y)); }

void main()
{
    vec2 uv = TexCoord;
    uv.x += rand01(vec2(randseed, 0.0));
    uv.y -= mod(uv.y, GRANULARITY);         // pixellate rows
    uv.x += rowspeed(uv.y) * time;              // move rows
    uv = mod(uv * TEX_REPEAT_FACTOR, 1.0);      // repeat texture

#ifdef INFOBEAMER_PLAT_PI
    vec3 c = texture2D(Texture, uv).rgb;
#else
    vec3 c = texture2DLod(Texture, uv, 0).rgb;
#endif
    gl_FragColor = vec4(c, ALPHA);
}
