import { alturaOnda, inclinacaoOnda } from './ondas.js';
import { alturaAreia } from './terreno.js';
import { multiplicar, transladar, escalar, girarX, girarY, girarZ } from './matrizes.js';

export function criarTartaruga(formas) {
  let pose = 0;
  const azul = [.28, .75, .84];
  const barriga = [.96, .84, .54];
  const casco = [.52, .29, .14];

  window.addEventListener('keydown', evento => {
    if (evento.key.toLowerCase() === 'p' && !evento.repeat) {
      pose = (pose + 1) % 3;
    }
  });

  function peca(forma, pai, lugar, tamanho, cor, rotacao) {
    let local = multiplicar(transladar(...lugar), escalar(...tamanho));
    if (rotacao) local = multiplicar(transladar(...lugar), multiplicar(rotacao, escalar(...tamanho)));
    forma(multiplicar(pai, local), cor);
  }

  function desenharPrancha(base) {
    peca(formas.esfera, base, [0, 0, 0], [1.5, .18, 3.4], [.96, .40, .18]);
    peca(formas.esfera, base, [0, .065, 0], [.26, .07, 3.0], [1, .91, .61]);
    peca(formas.cubo, base, [0, -.18, -.8], [.08, .35, .35], [.16, .40, .49]);
  }

  function desenharModelo(base, incluirAcessorio = false) {
    const corpo = multiplicar(base, girarX(-.12));
    peca(formas.esfera, corpo, [0, .9, 0], [.92, 1.12, .8], azul);
    peca(formas.esfera, corpo, [0, .93, -.28], [1.1, 1.2, .52], barriga);
    peca(formas.esfera, corpo, [0, .95, -.39], [.94, 1.02, .46], casco);
    peca(formas.esfera, corpo, [0, .88, .33], [.74, .88, .22], barriga);

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
      if (incluirAcessorio && lado === 1) {
        const acessorio = multiplicar(
          multiplicar(braco, transladar(.96, 1.03, .19)),
          multiplicar(girarZ(.35), escalar(1.8, 1.6, 1.6))
        );
        peca(formas.cilindro, acessorio, [0, 0, 0], [.13, .034, .034], [.76, .68, .50]);
        for (let i = 0; i < 9; i++) {
          const raio = .039 + i * .003;
          const tom = i % 2 === 0 ? [.89, .85, .69] : [.85, .81, .65];
          peca(formas.cilindro, acessorio, [.09 + i * .045, .002 * Math.sin(i * 2), 0],
            [.05, raio, raio * .94], tom);
        }
        peca(formas.cilindro, acessorio, [.49, 0, 0], [.035, .063, .059], [.30, .25, .20]);
        peca(formas.cilindro, acessorio, [.512, 0, 0], [.018, .056, .052], [.95, .25, .045]);
        const ponta = multiplicar(acessorio, girarZ(.12));
        peca(formas.esfera, ponta, [.54, -.06, 0], [.075, .04, .035], [.49, .43, .33]);
      }
    }
    peca(formas.esfera, corpo, [0, 1.48, .68], [.27, .045, .04], [.17, .07, .14]);
    peca(formas.esfera, corpo, [.15, .55, -.66], [.36, .35, .75], azul);
    peca(formas.esfera, corpo, [.33, .68, -.95], [.52, .56, .35], azul);
    peca(formas.esfera, corpo, [.33, .73, -1.13], [.23, .25, .04], [.16, .53, .65]);
  }

  function desenharGarrafa(base) {
    const corpo = multiplicar(base, girarX(-.12));
    const braco = multiplicar(corpo, girarZ(-.22));
    const garrafa = multiplicar(
      multiplicar(braco, transladar(.96, 1.03, .19)),
      girarZ(.35)
    );
    peca(formas.cilindro, garrafa, [0, 0, 0], [.32, .105, .105], [.08, .58, .22]);
    peca(formas.cilindro, garrafa, [.22, 0, 0], [.13, .055, .055], [.10, .67, .27]);
    peca(formas.cilindro, garrafa, [.32, 0, 0], [.065, .06, .06], [.78, .76, .64]);
  }

  function basePrancha(tempo) {
    const x = 3 + .3 * Math.sin(tempo * .5);
    const y = -.22 + alturaOnda(x, tempo) + .025 * Math.sin(tempo * 2);
    return multiplicar(
      multiplicar(
        transladar(x, y, 8),
        multiplicar(girarZ(Math.atan(inclinacaoOnda(x, tempo))), girarY(.4 + .1 * Math.sin(tempo * 2)))
      ),
      girarZ(.035 * Math.sin(tempo * 1.8))
    );
  }

  function desenharNoPrancha(tempo, deitada) {
    const prancha = basePrancha(tempo);
    desenharPrancha(prancha);
    const postura = deitada
      ? multiplicar(transladar(0, 1.05, 0), girarX(-Math.PI / 2))
      : transladar(0, .13, 0);
    const tartaruga = multiplicar(prancha, postura);
    desenharModelo(tartaruga, !deitada);
    if (deitada) desenharGarrafa(tartaruga);
  }

  function desenharNaEspreguicadeira() {
    const x = 6.8;
    const z = .6;
    const cadeira = multiplicar(
      transladar(x, alturaAreia(x, z) + .04, z),
      girarY(-.2)
    );
    const postura = multiplicar(
      transladar(0, .58, -.32),
      multiplicar(girarX(-Math.PI / 2), escalar(.5, .5, .5))
    );
    desenharModelo(multiplicar(cadeira, postura));
  }

  function desenhar(tempo) {
    if (pose === 0) desenharNoPrancha(tempo, false);
    else if (pose === 1) desenharNoPrancha(tempo, true);
    else desenharNaEspreguicadeira();
  }

  return {
    desenhar,
    poseAtual() {
      return pose;
    },
  };
}
