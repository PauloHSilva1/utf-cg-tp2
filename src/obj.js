export function interpretarObj(conteudo) {
  const vertices = [];
  const triangulos = [];
  const linhas = conteudo.split(/\r?\n/);

  for (let numeroLinha = 0; numeroLinha < linhas.length; numeroLinha++) {
    const partes = linhas[numeroLinha].replace(/#.*/, '').trim().split(/\s+/);
    if (!partes[0] || partes[0] !== 'v' && partes[0] !== 'f') continue;

    if (partes[0] === 'v') {
      const vertice = partes.slice(1, 4).map(Number);
      if (vertice.length !== 3 || !vertice.every(Number.isFinite)) {
        throw new Error(`Vértice inválido na linha ${numeroLinha + 1} do OBJ.`);
      }
      vertices.push(vertice);
      continue;
    }

    const indices = partes.slice(1).map(token => {
      const indiceObj = Number(token.split('/')[0]);
      if (!Number.isInteger(indiceObj) || indiceObj === 0) {
        throw new Error(`Índice de face inválido na linha ${numeroLinha + 1} do OBJ.`);
      }
      const indice = indiceObj > 0 ? indiceObj - 1 : vertices.length + indiceObj;
      if (indice < 0 || indice >= vertices.length) {
        throw new Error(`Índice de vértice fora do intervalo na linha ${numeroLinha + 1} do OBJ.`);
      }
      return indice;
    });

    if (indices.length < 3) {
      throw new Error(`Face com menos de três vértices na linha ${numeroLinha + 1} do OBJ.`);
    }

    for (let i = 1; i < indices.length - 1; i++) {
      triangulos.push(...vertices[indices[0]], ...vertices[indices[i]], ...vertices[indices[i + 1]]);
    }
  }

  if (triangulos.length === 0) {
    throw new Error('O arquivo OBJ não contém faces válidas.');
  }

  return new Float32Array(triangulos);
}

export async function carregarObj(gl, programa, caminho) {
  const resposta = await fetch(caminho);
  if (!resposta.ok) {
    throw new Error(`Não foi possível carregar o modelo OBJ: ${caminho}`);
  }

  const vertices = interpretarObj(await resposta.text());
  const quantidade = vertices.length / 3;
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const bufferVertices = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferVertices);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  const posicao = gl.getAttribLocation(programa, 'posicao');
  gl.enableVertexAttribArray(posicao);
  gl.vertexAttribPointer(posicao, 3, gl.FLOAT, false, 0, 0);

  const coordenadaTextura = gl.getAttribLocation(programa, 'coordenadaTextura');
  const bufferTextura = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferTextura);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quantidade * 2), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(coordenadaTextura);
  gl.vertexAttribPointer(coordenadaTextura, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);

  const localModelo = gl.getUniformLocation(programa, 'modelo');
  const cor = gl.getUniformLocation(programa, 'cor');
  const usarTextura = gl.getUniformLocation(programa, 'usarTextura');
  const usarOndas = gl.getUniformLocation(programa, 'usarOndas');
  const usarProfundidade = gl.getUniformLocation(programa, 'usarProfundidade');

  function desenhar(matriz, tinta) {
    gl.bindVertexArray(vao);
    gl.uniformMatrix4fv(localModelo, false, matriz);
    gl.uniform4f(cor, tinta[0], tinta[1], tinta[2], 1);
    gl.uniform1i(usarTextura, 0);
    gl.uniform1i(usarOndas, 0);
    gl.uniform1i(usarProfundidade, 0);
    gl.drawArrays(gl.TRIANGLES, 0, quantidade);
    gl.bindVertexArray(null);
  }

  return { desenhar };
}
