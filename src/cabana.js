import { identidade, multiplicar, transladar, escalar, girarY, girarX, girarZ } from './matrizes.js';
import { alturaAreia } from './terreno.js';

export function criarCabana(formas) {
  const cabana = criarEstrutura(formas);
  const espreguicadeira = criarEspreguicadeira(formas);
  const cabanaBase = transladar(5.8, alturaAreia(5.8, -.7) + .04, -.7);
  const cadeiraBase = multiplicar(
    transladar(6.8, alturaAreia(6.8, .6) + .04, .6),
    girarY(-.2)
  );

  function desenhar() {
    cabana.desenhar(cabanaBase);
    espreguicadeira.desenhar(cadeiraBase);
  }

  return { desenhar };
}

function criarEstrutura(formas) {
  const pecas = [];
  const madeira = [.48, .29, .16];
  const madeiraClara = [.67, .43, .23];
  const palha = [.82, .64, .36];

  function peca(forma, pai, lugar, tamanho, cor, rotacao) {
    let local = multiplicar(transladar(...lugar), escalar(...tamanho));
    if (rotacao) local = multiplicar(transladar(...lugar), multiplicar(rotacao, escalar(...tamanho)));
    pecas.push({ forma, matriz: multiplicar(pai, local), cor });
  }

  function cilindroVertical(pai, lugar, altura, raio, cor) {
    peca(formas.cilindro, pai, lugar, [altura, raio, raio], cor, girarZ(Math.PI / 2));
  }

  for (const x of [-1.05, 1.05]) {
    for (const z of [-.78, .78]) {
      cilindroVertical(identidade(), [x, 1, z], 2, .09, madeira);
    }
  }

  for (const y of [.35, .65, .95, 1.25, 1.55]) {
    peca(formas.cubo, identidade(), [0, y, -.77], [2, .12, .08], y % .6 < .1 ? madeiraClara : madeira);
  }

  peca(formas.cubo, identidade(), [0, 1.95, 0], [2.45, .13, .13], madeira);
  peca(formas.cubo, identidade(), [0, 1.95, -.78], [2.3, .13, .13], madeira);
  peca(formas.cubo, identidade(), [-1.05, 1.95, 0], [.13, .13, 1.65], madeira);
  peca(formas.cubo, identidade(), [1.05, 1.95, 0], [.13, .13, 1.65], madeira);
  peca(formas.telhado, identidade(), [0, 2, 0], [3, .8, 2.5], palha);

  return {
    desenhar(base) {
      for (const { forma, matriz, cor } of pecas) {
        forma(multiplicar(base, matriz), cor);
      }
    },
  };
}

function criarEspreguicadeira(formas) {
  const pecas = [];
  const madeira = [.62, .39, .21];
  const tecido = [.96, .84, .63];
  const listras = [.86, .35, .25];

  function peca(forma, pai, lugar, tamanho, cor, rotacao) {
    let local = multiplicar(transladar(...lugar), escalar(...tamanho));
    if (rotacao) local = multiplicar(transladar(...lugar), multiplicar(rotacao, escalar(...tamanho)));
    pecas.push({ forma, matriz: multiplicar(pai, local), cor });
  }

  for (const x of [-.42, .42]) {
    for (const z of [-.5, .5]) {
      peca(formas.cubo, identidade(), [x, .16, z], [.09, .32, .09], madeira);
    }
    peca(formas.cubo, identidade(), [x, .33, 0], [.08, .1, 1.2], madeira);
  }

  peca(formas.cubo, identidade(), [0, .39, .08], [.76, .08, .85], tecido);
  for (const z of [-.24, .08, .4]) {
    peca(formas.cubo, identidade(), [0, .438, z], [.77, .012, .12], listras);
  }

  const encosto = multiplicar(transladar(0, .72, -.47), girarX(-.38));
  peca(formas.cubo, encosto, [0, 0, 0], [.76, .08, .9], tecido);
  for (const z of [-.27, .05, .34]) {
    peca(formas.cubo, encosto, [0, 0, z], [.77, .09, .1], listras);
  }

  for (const x of [-.45, .45]) {
    peca(formas.cubo, identidade(), [x, .43, -.12], [.08, .08, .85], madeira);
  }

  return {
    desenhar(base) {
      for (const { forma, matriz, cor } of pecas) {
        forma(multiplicar(base, matriz), cor);
      }
    },
  };
}
