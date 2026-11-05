#version 300 es
precision highp float;

out vec4 corFinal;

uniform vec4 cor;
uniform sampler2D texturaAreia;
uniform bool usarTextura;
uniform bool usarProfundidade;
uniform float profundidadeMaxima;
uniform float tempoAgua;

in vec2 uv;
in float profundidadeInterpolada;

void main() {
  corFinal = cor;
  if (usarTextura) {
    float grao = texture(texturaAreia, uv).r;
    corFinal.rgb *= 0.78 + 0.44 * grao;
  }
  if (usarProfundidade) {
    float profundidade = clamp(profundidadeInterpolada / profundidadeMaxima, 0.0, 1.0);
    vec3 rasa = vec3(0.02, 0.48, 0.72);
    vec3 media = vec3(0.015, 0.30, 0.68);
    vec3 funda = vec3(0.008, 0.12, 0.42);
    vec3 corAgua = mix(rasa, media, smoothstep(0.0, 0.58, profundidade));
    corAgua = mix(corAgua, funda, smoothstep(0.42, 1.0, profundidade));

    float ondulacao = sin(uv.x * 17.0 + sin(uv.y * 12.0 + tempoAgua) * 1.4)
      * cos(uv.y * 15.0 - tempoAgua * 0.7);
    float reflexo = smoothstep(0.78, 0.98, ondulacao) * 0.055 * (1.0 - profundidade);
    corFinal.rgb = mix(corAgua, vec3(0.68, 0.86, 0.96), reflexo);
    corFinal.a = mix(0.48, 0.72, smoothstep(0.0, 1.0, profundidade));
  }
}
