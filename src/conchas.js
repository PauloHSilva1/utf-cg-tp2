import { identidade, multiplicar, transladar, escalar, girarY } from './matrizes.js';
import { alturaAreia } from './terreno.js';

export function criarConchas(formas) {
  const lugares = [
    { x: -5.7, z: 2, tamanho: 1.15, giro: -.25, cor: [.88, .43, .38] },
    { x: -2.6, z: 2.85, tamanho: .78, giro: .55, cor: [.93, .69, .43] },
    { x: 2.8, z: 2.75, tamanho: .95, giro: -.45, cor: [.78, .43, .62] },
    { x: 5.7, z: 2, tamanho: 1.1, giro: .3, cor: [.92, .68, .47] },
  ];

  const conchas = lugares.map(({ x, z, tamanho, giro, cor }) => {
    const y = alturaAreia(x, z) + .025;
    const base = multiplicar(
      multiplicar(transladar(x, y, z), girarY(giro)),
      escalar(tamanho, tamanho, tamanho)
    );
    const corpo = multiplicar(base, multiplicar(transladar(0, .02, 0), escalar(1, .7, 1)));
    const perola = multiplicar(base, multiplicar(transladar(0, .2, .08), escalar(.34, .3, .34)));
    return { corpo, perola, cor };
  });

  function desenhar() {
    for (const { corpo, perola, cor } of conchas) {
      formas.concha(corpo, cor);
      formas.esfera(perola, [.97, .87, .68]);
    }
  }

  return { desenhar };
}
