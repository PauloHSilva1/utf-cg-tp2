import { identidade, multiplicar, transladar, escalar, girarY, girarZ } from './matrizes.js';
import { alturaAreia } from './terreno.js';

export function criarPalmeiras(formas) {
  // Posição X/Z, tamanho e rotação em radianos.
  const lugares = [
    { x: -7.5, z: -2, tamanho: 1.1, giro: .3 },
    { x: -8, z: 2.5, tamanho: .9, giro: 1.2 },
    { x: -3.5, z: -7.5, tamanho: 1.2, giro: 2.1 },
    { x: 3, z: -8, tamanho: 1, giro: -.6 },
    { x: 7.5, z: -3.5, tamanho: 1.15, giro: 2.8 },
    { x: 8, z: 2, tamanho: .85, giro: -1.4 },
  ];
  const palmeira = criarPalmeira(formas);
  const bases = lugares.map(({ x, z, tamanho, giro }) => {
    const lugar = transladar(x, alturaAreia(x, z), z);
    return multiplicar(multiplicar(lugar, girarY(giro)), escalar(tamanho, tamanho, tamanho));
  });

  function desenhar() {
    for (const base of bases) palmeira.desenhar(base);
  }

  return { desenhar };
}

function criarPalmeira(formas) {
  const pecas = [];

  function peca(forma, pai, lugar, tamanho, cor) {
    const local = multiplicar(transladar(...lugar), escalar(...tamanho));
    pecas.push({ forma, matriz: multiplicar(pai, local), cor });
  }

  // Cada pedaço continua de onde o anterior terminou, curvando o tronco.
  let tronco = identidade();
  for (let i = 0; i < 7; i++) {
    tronco = multiplicar(tronco, girarZ(-.045));
    const meio = multiplicar(tronco, transladar(0, .26, 0));
    const emPe = multiplicar(meio, girarZ(Math.PI / 2));
    const raio = .24 - i * .015;
    peca(formas.cilindro, emPe, [0, 0, 0], [.55, raio, raio], i % 2 === 0 ? [.58, .37, .19] : [.48, .29, .14]);
    tronco = multiplicar(tronco, transladar(0, .52, 0));
  }

  for (let i = 0; i < 8; i++) {
    const volta = multiplicar(tronco, girarY(i * Math.PI * 2 / 8));
    peca(formas.folha, volta, [0, 0, 0], [2.6 + .2 * (i % 2), 1.7, 2.1],
      i % 2 === 0 ? [.18, .51, .23] : [.25, .61, .28]);
  }

  for (let i = 0; i < 3; i++) {
    const angulo = i * Math.PI * 2 / 3;
    peca(formas.esfera, tronco, [.26 * Math.cos(angulo), -.18, .26 * Math.sin(angulo)],
      [.38, .46, .38], [.37, .23, .11]);
  }

  function desenhar(base) {
    for (const { forma, matriz, cor } of pecas) {
      forma(multiplicar(base, matriz), cor);
    }
  }

  return { desenhar };
}
