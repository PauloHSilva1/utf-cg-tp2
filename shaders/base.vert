#version 300 es

in vec3 posicao;
in vec2 coordenadaTextura;
in float influenciaOndas;

uniform mat4 projecao;
uniform mat4 visao;
uniform mat4 modelo;
uniform bool usarOndas;
uniform float amplitudeOnda;
uniform float numeroOnda;
uniform float frequenciaOnda;
uniform float tempoOnda;

out vec2 uv;

void main() {
  vec3 posicaoDeformada = posicao;
  if (usarOndas) {
    float fase = numeroOnda * posicao.x + frequenciaOnda * tempoOnda;
    posicaoDeformada.y += amplitudeOnda * sin(fase) * influenciaOndas;
  }
  uv = coordenadaTextura;
  gl_Position = projecao * visao * modelo * vec4(posicaoDeformada, 1.0);
}
