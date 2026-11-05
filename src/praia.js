import { identidade } from './matrizes.js';
import { criarTopo } from './terreno.js';
import { parametrosOndas } from './ondas.js';

export function criarPraia(gl, programa) {
  const nivel = -.35;
  const pontos = [];
  const coordenadasTextura = [];
  const influenciaOndas = [];
  const profundidades = [];
  const subdivisions = 8;

  function adicionarPonto(ponto) {
    pontos.push(ponto[0], ponto[1], ponto[2]);
    coordenadasTextura.push(ponto[0] * .12, ponto[2] * .12);
    influenciaOndas.push(ponto[3]);
    profundidades.push(ponto[4]);
  }

  function interpolar(a, b, c, u, v) {
    const w = 1 - u - v;
    return [
      a[0] * w + b[0] * u + c[0] * v,
      a[1] * w + b[1] * u + c[1] * v,
      a[2] * w + b[2] * u + c[2] * v,
      a[3] * w + b[3] * u + c[3] * v,
      a[4] * w + b[4] * u + c[4] * v,
    ];
  }

  function subdividir(a, b, c) {
    function ponto(i, j) {
      return interpolar(a, b, c, i / subdivisions, j / subdivisions);
    }

    for (let i = 0; i < subdivisions; i++) {
      for (let j = 0; j < subdivisions - i; j++) {
        const a0 = ponto(i, j);
        const b0 = ponto(i + 1, j);
        const c0 = ponto(i, j + 1);
        adicionarPonto(a0);
        adicionarPonto(b0);
        adicionarPonto(c0);

        if (i + j < subdivisions - 1) {
          const d0 = ponto(i + 1, j + 1);
          adicionarPonto(b0);
          adicionarPonto(d0);
          adicionarPonto(c0);
        }
      }
    }
  }

  for (const triangulo of criarTopo()) {
    const recorte = [];

    // Recorta cada triângulo na linha onde a areia encontra o nível do mar.
    for (let i = 0; i < 3; i++) {
      const a = triangulo[i];
      const b = triangulo[(i + 1) % 3];
      if (a[1] <= nivel) {
        recorte.push([a[0], nivel, a[2], a[1] < nivel ? 1 : 0, Math.max(0, nivel - a[1])]);
      }

      if ((a[1] <= nivel) !== (b[1] <= nivel)) {
        const t = (nivel - a[1]) / (b[1] - a[1]);
        recorte.push([
          a[0] + (b[0] - a[0]) * t,
          nivel,
          a[2] + (b[2] - a[2]) * t,
          0,
          0,
        ]);
      }
    }

    for (let i = 1; i < recorte.length - 1; i++) {
      subdividir(recorte[0], recorte[i], recorte[i + 1]);
    }
  }

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pontos), gl.STATIC_DRAW);
  const posicao = gl.getAttribLocation(programa, 'posicao');
  gl.enableVertexAttribArray(posicao);
  gl.vertexAttribPointer(posicao, 3, gl.FLOAT, false, 0, 0);

  const coordenadaTextura = gl.getAttribLocation(programa, 'coordenadaTextura');
  const bufferTextura = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferTextura);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordenadasTextura), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(coordenadaTextura);
  gl.vertexAttribPointer(coordenadaTextura, 2, gl.FLOAT, false, 0, 0);

  const influencia = gl.getAttribLocation(programa, 'influenciaOndas');
  const bufferInfluencia = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfluencia);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(influenciaOndas), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(influencia);
  gl.vertexAttribPointer(influencia, 1, gl.FLOAT, false, 0, 0);

  const profundidade = gl.getAttribLocation(programa, 'profundidadeAgua');
  const bufferProfundidade = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferProfundidade);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(profundidades), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(profundidade);
  gl.vertexAttribPointer(profundidade, 1, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);

  const modelo = gl.getUniformLocation(programa, 'modelo');
  const cor = gl.getUniformLocation(programa, 'cor');
  const usarTextura = gl.getUniformLocation(programa, 'usarTextura');
  const usarOndas = gl.getUniformLocation(programa, 'usarOndas');
  const usarProfundidade = gl.getUniformLocation(programa, 'usarProfundidade');
  const amplitudeOnda = gl.getUniformLocation(programa, 'amplitudeOnda');
  const numeroOnda = gl.getUniformLocation(programa, 'numeroOnda');
  const frequenciaOnda = gl.getUniformLocation(programa, 'frequenciaOnda');
  const tempoOnda = gl.getUniformLocation(programa, 'tempoOnda');
  const tempoAgua = gl.getUniformLocation(programa, 'tempoAgua');
  const profundidadeMaxima = gl.getUniformLocation(programa, 'profundidadeMaxima');
  const matriz = identidade();

  function desenhar(tempo) {
    gl.bindVertexArray(vao);
    gl.uniformMatrix4fv(modelo, false, matriz);
    gl.uniform1i(usarTextura, 0);
    gl.uniform1i(usarOndas, 1);
    gl.uniform1i(usarProfundidade, 1);
    gl.uniform1f(amplitudeOnda, parametrosOndas.amplitude);
    gl.uniform1f(numeroOnda, parametrosOndas.numeroOnda);
    gl.uniform1f(frequenciaOnda, parametrosOndas.frequencia);
    gl.uniform1f(tempoOnda, tempo);
    gl.uniform1f(tempoAgua, tempo);
    gl.uniform1f(profundidadeMaxima, .55);
    gl.uniform4f(cor, .08, .64, .76, .82);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    gl.drawArrays(gl.TRIANGLES, 0, pontos.length / 3);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
    gl.uniform1i(usarOndas, 0);
    gl.uniform1i(usarProfundidade, 0);
    gl.bindVertexArray(null);
  }

  return { desenhar };
}
