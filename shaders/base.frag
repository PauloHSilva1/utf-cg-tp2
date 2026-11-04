#version 300 es
precision highp float;

out vec4 corFinal;

uniform vec4 cor;
uniform sampler2D texturaAreia;
uniform bool usarTextura;

in vec2 uv;

void main() {
  corFinal = cor;
  if (usarTextura) {
    float grao = texture(texturaAreia, uv).r;
    corFinal.rgb *= 0.78 + 0.44 * grao;
  }
}
