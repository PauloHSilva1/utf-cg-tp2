// As formas ficam centradas na origem, exceto o telhado apoiado em Y = 0.
export function criarFormas(gl, programa) {
  const posicao = gl.getAttribLocation(programa, 'posicao');
  const modelo = gl.getUniformLocation(programa, 'modelo');
  const cor = gl.getUniformLocation(programa, 'cor');

  function criarMalha(faces) {
    const pontos = [];
    const partes = [];

    for (const { vertices, tom } of faces) {
      const inicio = pontos.length / 3;
      // Transforma cada face em triângulos.
      for (let i = 1; i < vertices.length - 1; i++) {
        pontos.push(...vertices[0], ...vertices[i], ...vertices[i + 1]);
      }
      partes.push({ inicio, quantidade: pontos.length / 3 - inicio, tom });
    }

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pontos), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(posicao);
    gl.vertexAttribPointer(posicao, 3, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    function desenhar(matriz, tinta) {
      gl.bindVertexArray(vao);
      gl.uniformMatrix4fv(modelo, false, matriz);
      for (const parte of partes) {
        gl.uniform4f(cor, tinta[0] * parte.tom, tinta[1] * parte.tom, tinta[2] * parte.tom, 1);
        gl.drawArrays(gl.TRIANGLES, parte.inicio, parte.quantidade);
      }
      gl.bindVertexArray(null);
    }

    return desenhar;
  }

  const cubo = criarMalha([
    { tom: 1, vertices: [[-.5, .5, -.5], [-.5, .5, .5], [.5, .5, .5], [.5, .5, -.5]] },
    { tom: .55, vertices: [[-.5, -.5, .5], [-.5, -.5, -.5], [.5, -.5, -.5], [.5, -.5, .5]] },
    { tom: .85, vertices: [[-.5, -.5, .5], [.5, -.5, .5], [.5, .5, .5], [-.5, .5, .5]] },
    { tom: .7, vertices: [[.5, -.5, -.5], [-.5, -.5, -.5], [-.5, .5, -.5], [.5, .5, -.5]] },
    { tom: .75, vertices: [[.5, -.5, .5], [.5, -.5, -.5], [.5, .5, -.5], [.5, .5, .5]] },
    { tom: .65, vertices: [[-.5, -.5, -.5], [-.5, -.5, .5], [-.5, .5, .5], [-.5, .5, -.5]] },
  ]);

  // Cilindro e aro ficam ao longo do eixo X, como o eixo da roda.
  function criarRedondo(furo) {
    const faces = [];
    const partes = 32;
    const ponto = (x, raio, angulo) => [x, raio * Math.cos(angulo), raio * Math.sin(angulo)];

    for (let i = 0; i < partes; i++) {
      const a = i * Math.PI * 2 / partes;
      const b = (i + 1) * Math.PI * 2 / partes;
      faces.push({ tom: .8, vertices: [ponto(-.5, 1, a), ponto(-.5, 1, b), ponto(.5, 1, b), ponto(.5, 1, a)] });
      for (const x of [-.5, .5]) {
        faces.push({ tom: x > 0 ? 1 : .65, vertices: [ponto(x, furo, a), ponto(x, 1, a), ponto(x, 1, b), ponto(x, furo, b)] });
      }
      if (furo > 0) {
        faces.push({ tom: .6, vertices: [ponto(.5, furo, a), ponto(.5, furo, b), ponto(-.5, furo, b), ponto(-.5, furo, a)] });
      }
    }
    return criarMalha(faces);
  }

  const telhado = criarMalha([
    { tom: .8, vertices: [[-.5, 0, .5], [.5, 0, .5], [0, .5, .5]] },
    { tom: .65, vertices: [[.5, 0, -.5], [-.5, 0, -.5], [0, .5, -.5]] },
    { tom: 1, vertices: [[0, .5, -.5], [0, .5, .5], [.5, 0, .5], [.5, 0, -.5]] },
    { tom: .75, vertices: [[-.5, 0, -.5], [-.5, 0, .5], [0, .5, .5], [0, .5, -.5]] },
    { tom: .5, vertices: [[-.5, 0, -.5], [.5, 0, -.5], [.5, 0, .5], [-.5, 0, .5]] },
  ]);

  function criarEsfera() {
    const faces = [];
    const aneis = 10;
    const partes = 16;
    function ponto(anel, parte) {
      const altura = anel * Math.PI / aneis;
      const angulo = parte * Math.PI * 2 / partes;
      return [.5 * Math.sin(altura) * Math.cos(angulo), .5 * Math.cos(altura), .5 * Math.sin(altura) * Math.sin(angulo)];
    }

    for (let anel = 0; anel < aneis; anel++) {
      for (let i = 0; i < partes; i++) {
        const a = ponto(anel, i);
        const b = ponto(anel, i + 1);
        const c = ponto(anel + 1, i + 1);
        const d = ponto(anel + 1, i);
        const tom = .72 + .23 * Math.cos((anel + .5) * Math.PI / aneis) + .05 * Math.cos(i * Math.PI * 2 / partes);
        if (anel === 0) faces.push({ tom, vertices: [a, c, d] });
        else if (anel === aneis - 1) faces.push({ tom, vertices: [a, b, c] });
        else faces.push({ tom, vertices: [a, b, c, d] });
      }
    }
    return criarMalha(faces);
  }

  // Folha com uma dobra no meio e a ponta caída.
  const folha = criarMalha([
    { tom: 1, vertices: [[0, 0, 0], [.45, .16, 0], [.45, .08, -.18]] },
    { tom: .8, vertices: [[0, 0, 0], [.45, .08, .18], [.45, .16, 0]] },
    { tom: 1, vertices: [[.45, .16, 0], [1, -.25, 0], [.45, .08, -.18]] },
    { tom: .8, vertices: [[.45, .16, 0], [.45, .08, .18], [1, -.25, 0]] },
    { tom: .6, vertices: [[0, 0, 0], [.45, .08, -.18], [.45, .04, 0]] },
    { tom: .6, vertices: [[0, 0, 0], [.45, .04, 0], [.45, .08, .18]] },
    { tom: .6, vertices: [[.45, .04, 0], [.45, .08, -.18], [1, -.25, 0]] },
    { tom: .6, vertices: [[.45, .04, 0], [1, -.25, 0], [.45, .08, .18]] },
  ]);

  return { cubo, cilindro: criarRedondo(0), aro: criarRedondo(.85), telhado, esfera: criarEsfera(), folha };
}
