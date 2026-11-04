import { multiplicar, transladar, escalar, girarX, girarY, girarZ } from './matrizes.js';
import { alturaOnda, inclinacaoOnda } from './ondas.js';

export function criarSquirtle(formas) {
  const azul = [.28, .75, .84];
  const barriga = [.96, .84, .54];
  const casco = [.52, .29, .14];

  function peca(forma, pai, lugar, tamanho, cor) {
    const local = multiplicar(transladar(...lugar), escalar(...tamanho));
    forma(multiplicar(pai, local), cor);
  }

  function desenhar(tempo) {
    // Prancha e personagem compartilham o mesmo balanço.

    const x = 3 + .3 * Math.sin(tempo * .5);
    const lugar = transladar(x, -.22 + alturaOnda(x, tempo) + .025 * Math.sin(tempo * 2), 8);
    //muda a orientação da prancha 
    const inclinacao = Math.atan(inclinacaoOnda(x, tempo));
    const direcao = multiplicar(multiplicar(lugar, girarZ(inclinacao)), girarY(.4));
    const base = multiplicar(direcao, girarZ(.035 * Math.sin(tempo * 1.8)));

    peca(formas.esfera, base, [0, 0, 0], [1.5, .18, 3.4], [.96, .40, .18]);
    peca(formas.esfera, base, [0, .065, 0], [.26, .07, 3.0], [1, .91, .61]);
    peca(formas.cubo, base, [0, -.18, -.8], [.08, .35, .35], [.16, .40, .49]);

    const corpo = multiplicar(base, girarX(-.12));
    peca(formas.esfera, corpo, [0, .9, 0], [.92, 1.12, .8], azul);
    peca(formas.esfera, corpo, [0, .93, -.28], [1.1, 1.2, .52], barriga);
    peca(formas.esfera, corpo, [0, .95, -.39], [.94, 1.02, .46], casco);
    peca(formas.esfera, corpo, [0, .88, .33], [.74, .88, .22], barriga);
    // Pequenas divisões na barriga.
    for (const y of [.65, .88, 1.1]) {
      peca(formas.cubo, corpo, [0, y, .44], [.53, .018, .025], [.74, .59, .34]);
    }

    peca(formas.esfera, corpo, [0, 1.7, .16], [1.25, 1.08, 1.1], azul);
    for (const lado of [-1, 1]) {
      peca(formas.esfera, corpo, [lado * .28, 1.77, .66], [.22, .36, .10], [.9, .04, .06]);
      peca(formas.esfera, corpo, [lado * .28 - .025, 1.85, .71], [.07, .11, .035], [1, 1, 1]);
      peca(formas.esfera, corpo, [lado * .33, .26, .12], [.42, .3, .64], azul);
      const braco = multiplicar(corpo, girarZ(lado * -.22));
      peca(formas.esfera, braco, [lado * .7, 1, .05], [.7, .3, .35], azul);
      if (lado === 1) {
        // O cigarro acompanha a mao e o balanco do personagem.
        const cigarro = multiplicar(
          multiplicar(braco, transladar(.96, 1.03, .19)),
          multiplicar(girarZ(.35), escalar(1.8, 1.6, 1.6))
        );
        // Piteira de papel e corpo artesanal que engrossa ate a brasa.
        peca(formas.cilindro, cigarro, [0, 0, 0], [.13, .034, .034], [.76, .68, .50]);
        for (let i = 0; i < 9; i++) {
          const raio = .039 + i * .003;
          const tom = i % 2 === 0 ? [.89, .85, .69] : [.85, .81, .65];
          peca(formas.cilindro, cigarro, [.09 + i * .045, .002 * Math.sin(i * 2), 0],
            [.05, raio, raio * .94], tom);
        }
        peca(formas.cilindro, cigarro, [.49, 0, 0], [.035, .063, .059], [.30, .25, .20]);
        peca(formas.cilindro, cigarro, [.512, 0, 0], [.018, .056, .052], [.95, .25, .045]);
        const ponta = multiplicar(cigarro, girarZ(.12));
        peca(formas.esfera, ponta, [.54, -.06, 0], [.075, .04, .035], [.49, .43, .33]);
      }
    }
    peca(formas.esfera, corpo, [0, 1.48, .68], [.27, .045, .04], [.17, .07, .14]);

    // Cauda em curva, saindo por trás do casco.
    peca(formas.esfera, corpo, [.15, .55, -.66], [.36, .35, .75], azul);
    peca(formas.esfera, corpo, [.33, .68, -.95], [.52, .56, .35], azul);
    peca(formas.esfera, corpo, [.33, .73, -1.13], [.23, .25, .04], [.16, .53, .65]);
  }

  return { desenhar };
}
