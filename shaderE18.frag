// ************************************************
// * inputs from node.lua

varying vec2 TexCoord;
uniform float time;
uniform float res_x;
uniform float res_y;

// ************************************************
// * config parameter

const float queru_size = 0.12;
const float queru_rotspeed = 3.0;
const vec2 queru_basepos = vec2(0.5, 0.5);
const vec3 YELLOW = vec3(1.0, 0.913, 0.141);

// ************************************************
// * helper functions

float aspect() {
  return res_x / res_y;
}

vec2 pixelsize() {
  return 1.0 / vec2(res_x, res_y);
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


float rect(vec2 uv, vec2 sz) {
  vec2 limx = vec2(-sz.x, +sz.x);
  vec2 limy = vec2(-sz.y, +sz.y);
  vec4 v1 = vec4(limx.x, uv.x, limy.x, uv.y);
  vec4 v2 = vec4(uv.x, limx.y, uv.y, limy.y);

  vec4 d = max(v1 - v2, vec4(0));
  float error = dot(d, vec4(1));
  float factor = 1.0 - 0.42 * (error / pixelsize().y);
  return clamp(factor, 0.0, 1.0);
}

// ************************************************
// * the "querulant"

vec2 queru_pos() {
  float x = chaos(3.1415 * time);
  float y = chaos(-1.3 * time);
  return queru_basepos + 0.5 * vec2(x, y);
}

void querulant(inout vec3 c, vec3 k) {
  vec2 sz = vec2(queru_size);
  vec3 qq = k * tm(queru_pos()) * rm(time*queru_rotspeed);
  c = mix(c, YELLOW, rect(qq.xy, sz));
}

// ************************************************
// * main

void main() {
  vec2 uv = TexCoord;
  vec3 c = vec3(0.0);

  // normalize (0..1) to (-1..1), with (0, 0) in the center
  vec3 nuv = vec3((uv - 0.5)*2.0, 1.0);
  nuv.x *= res_x/res_y;

  querulant(c, nuv);

  gl_FragColor = vec4(c, 1.0);
}

// ************************************************
