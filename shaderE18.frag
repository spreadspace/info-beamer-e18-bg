// #define SHADERTOY

// ************************************************
// * inputs from node.lua

#ifndef SHADERTOY
varying vec2 TexCoord;
uniform float iTime;
uniform vec3 iResolution;
#endif

// ************************************************
// * config parameter

const vec3 YELLOW = vec3(1.0, 0.913, 0.141);

const float QUERU_SIZE = 0.12;
const float QUERU_ROT_SPEED = 3.0;
const vec2 QUERU_BASE_POS = vec2(-0.5, -0.5);

const float NOISE_GRANULARITY = 150.0;
const vec2 NOISE_SPEED = vec2(0.2, 0.9);
const float NOISE_SPEED_MULT = 0.6;

const float AA_FACTOR = 0.42;

const float PI = 3.141596;


// ************************************************
// * helper functions

float aspect() {
  return iResolution.x / iResolution.y;
}

vec2 pixelSize() {
  return 1.0 / iResolution.xy;
}

vec3 RGB(int r, int g, int b) {
  return vec3(ivec3(r,g,b)) / 255.0;
}

mat3 rm(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat3( c , -s , 0.0,
               s ,  c , 0.0,
              0.0, 0.0, 1.0);
}

mat3 tm(vec2 t) {
  return mat3(1.0, 0.0, t.x,
              0.0, 1.0, t.y,
              0.0, 0.0, 1.0);
}

float chaos(float x)
{
  vec3 t = x * vec3(0.22, 0.39, 0.3);
  return (exp(sin(t.x))*exp(cos(t.y))*sin(t.z));
}

// 0: outside, 1: inside, 0..1: on edge
float rect(vec2 uv, vec2 sz) {
  vec2 limx = vec2(-sz.x, +sz.x);
  vec2 limy = vec2(-sz.y, +sz.y);
  vec4 v1 = vec4(limx.x, uv.x, limy.x, uv.y);
  vec4 v2 = vec4(uv.x, limx.y, uv.y, limy.y);

  vec4 d = max(v1 - v2, vec4(0));
  float error = dot(d, vec4(1));
  float factor = 1.0 - AA_FACTOR * (error / pixelSize().y);
  return clamp(factor, 0.0, 1.0);
}

float randbase(vec2 n) {
  return fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
}

float rand01(vec2 n) {
  return 0.5 + 0.5 * randbase(n);
}

float rand(vec2 n) {
  return randbase(n) * 2.0 - 1.0;
}

// ************************************************
// * noise-stripe

vec3 stripecolor(float t)
{
  return mix(RGB(0x55, 0x33, 0x7B), RGB(0xFF, 0xFE, 0xFD), t*t*t);
}

void stripe(inout vec3 c, vec3 k, vec2 sz, vec2 pos, float a)
{
  mat3 rot = rm(a);
  vec3 qq = k * tm(pos) * rot;
  float r = rect(qq.xy, sz);

  vec2 tmp = floor((qq.xy) * NOISE_GRANULARITY) / NOISE_GRANULARITY;
  float sh = sin(rand(vec2(tmp.y, tmp.y * PI)));
  float sgn = sign(sh);
  sh = 0.5 + 0.5 * sh;
  sh = mix(NOISE_SPEED.x, NOISE_SPEED.y, sh);
  sh *= sgn;

  float tx = floor((qq.x + sh*iTime*NOISE_SPEED_MULT) * NOISE_GRANULARITY) / NOISE_GRANULARITY;
  float ty = tmp.y;

  float t = rand01(vec2(tx,ty));
  vec3 cc = stripecolor(t);
  c = mix(c, cc, r);
}

// ************************************************
// * the "querulant"

vec2 queruPos()
{
  float dx = chaos(iTime * PI);
  float dy = chaos(iTime * -1.3);
  return QUERU_BASE_POS + 0.5 * vec2(dx, dy);
}

void querulant(inout vec3 c, vec3 k) {
  vec2 sz = vec2(QUERU_SIZE);
  vec3 qq = k * tm(queruPos()) * rm(iTime*QUERU_ROT_SPEED);
  c = mix(c, YELLOW, rect(qq.xy, sz));
}

// ************************************************
// * main

void image(out vec4 fragColor, vec2 uv)
{
  vec3 c = vec3(0.0);

  // normalize (0..1) to (-1..1), with (0, 0) in the center
  vec3 nuv = vec3((uv - 0.5)*2.0, 1.0);
  nuv.x *= aspect();

  stripe(c, nuv, vec2(0.3, 0.8), vec2(0.02 * sin(iTime) - 0.5, 0.12*sin(0.234*iTime)), 0.25);
  querulant(c, nuv);

  fragColor = vec4(c, 1.0);
}

#ifdef SHADERTOY
void mainImage(out vec4 fragColor, in vec2 fragCoord )
{
  vec2 uv = fragCoord.xy / iResolution.xy;
  image(fragColor, uv);
}
#else
void main()
{
  vec4 c = vec4(0.0, 0.0, 0.0, 1.0);
  image(c, vec2(TexCoord.x,1.0-TexCoord.y));
  gl_FragColor =  c;
}
#endif

// ************************************************
