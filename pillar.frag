// automatically supplied by info-beamer
uniform sampler2D Texture;
varying vec2 TexCoord;
uniform vec4 Color;

// custom
uniform float time;

// -- config --
const float ROW_SPEED_MULT = 4.2;
const float VERT_SPEED = 0.23;
const float GRANULARITY  = 0.001;
const vec2 TEX_REPEAT_FACTOR = vec2(1.0, 4.7); // < 1 looks smeary, 1-2 looks nice

// --------------------

float randbase(vec2 n) {
  return fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
}
float rand01(vec2 n) { return 0.5 + 0.5 * randbase(n); }
float rand  (vec2 n) { return randbase(n) * 2.0 - 1.0; }
float rowspeed(float y) { return ROW_SPEED_MULT * rand(vec2(0.0, y)); }

vec4 constrand() {
 #ifdef INFOBEAMER_PLAT_PI
  return texture2D(Texture, vec2(0.42));
 #else
  return texture2DLod(Texture, vec2(0.42), 0);
 #endif
}
float vertspeed(){ return (constrand().b - 0.5) * VERT_SPEED; }

void main()
{
    vec2 uv = TexCoord;
    uv.y -= mod(uv.y, GRANULARITY);             // pixellate rows
    uv.y = mod(uv.y + vertspeed() * time, 1.0); // video hum
    uv.x += rowspeed(uv.y) * time;              // move rows
    uv = mod(uv * TEX_REPEAT_FACTOR, 1.0);      // repeat texture

#ifdef INFOBEAMER_PLAT_PI
    vec4 c = texture2D(Texture, uv);
#else
    vec4 c = texture2DLod(Texture, uv, 0);
#endif
    gl_FragColor = c;
}
