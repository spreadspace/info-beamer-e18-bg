varying vec2 TexCoord;
uniform float time;
uniform float sar;

const float quero_rotspeed = 0.1;
const vec3 YELLOW = vec3(1.0, 0.913, 0.141);

mat3 rm(float a) {
  float c = cos(a);
  float s = sin(a);
  return mat3(c, -s, 0.0,
              s, c, 0.0,
              0.0, 0.0, 1.0);
}

mat3 tm(vec2 t) {
  return mat3(1.0, 0.0, t.x,
              0.0, 1.0, t.y,
              0.0, 0.0, 1.0);
}

bool isq(vec2 uv) {
  float d = 0.1;
  vec2 limx = vec2(-d, +d);
  vec2 limy = vec2(-d, +d);
  vec4 v1 = vec4(limx.x, uv.x, limy.x, uv.y);
  vec4 v2 = vec4(uv.x, limx.y, uv.y, limy.y);
  return all(lessThan(v1, v2));
}

void querolant(inout vec3 c, vec3 k) {
  vec2 qpos = vec2(0.0, 0.0);//vec2(0.5*sin(time), 0.0);
  vec3 qq = k * tm(qpos) * rm(time*quero_rotspeed);
  if(isq(qq.xy))
    c = YELLOW;
}

void main() {
  vec2 uv = TexCoord;
  vec3 c = vec3(0.0);

  vec3 nuv = vec3(uv - 0.5, 1.0);
  nuv.y /= sar;

  querolant(c, nuv);

  gl_FragColor = vec4(c, 1.0);
}
