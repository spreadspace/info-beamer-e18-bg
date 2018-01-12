uniform float time;
varying vec2 TexCoord;

void main() {
  gl_FragColor = vec4(TexCoord,0.5+0.5*sin(time),1.0);
}
