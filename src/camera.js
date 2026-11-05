import { perspectiva, olharPara } from './matrizes.js';
import { criarMouse } from './mouse.js';

export function criarCamera(gl, programa) {
  const localProjecao = gl.getUniformLocation(programa, 'projecao');
  const localVisao = gl.getUniformLocation(programa, 'visao');
  const alvo = [0, 1, 0];
  const cima = [0, 1, 0];
  const mouse = criarMouse(gl.canvas);
  let modo = 1;
  let distancia = 34;
  let anguloOrbital = .64;
  let inclinacaoOrbital = Math.PI / 4;
  let tempoAtual = 0;

  window.addEventListener('keydown', evento => {
    if (evento.key === '1' || evento.key === '2') {
      const proximoModo = Number(evento.key);
      if (proximoModo === 2 && modo === 1) {
        anguloOrbital = .64 + tempoAtual * .15;
        inclinacaoOrbital = Math.PI / 4;
      }
      modo = proximoModo;
    }
  });

  function atualizar() {
    const tempo = performance.now() / 1000;
    tempoAtual = tempo;
    const movimento = mouse.ler();
    distancia = Math.max(8, Math.min(55, distancia + movimento.zoom * .02));

    let angulo;
    let inclinacao;
    if (modo === 1) {
      angulo = .64 + tempo * .15;
      inclinacao = Math.PI / 4;
    } else {
      anguloOrbital -= movimento.giro * .005;
      inclinacaoOrbital = Math.max(.12, Math.min(
        Math.PI / 2 - .02,
        inclinacaoOrbital + movimento.inclinacao * .005
      ));
      angulo = anguloOrbital;
      inclinacao = inclinacaoOrbital;
    }

    const raio = distancia * Math.cos(inclinacao);
    const posicao = [
      alvo[0] + Math.sin(angulo) * raio,
      alvo[1] + Math.sin(inclinacao) * distancia,
      alvo[2] + Math.cos(angulo) * raio,
    ];

    const proporcao = gl.canvas.width / gl.canvas.height;
    const projecao = perspectiva(Math.PI / 3, proporcao, 0.1, 100);
    const visao = olharPara(posicao, alvo, cima);

    gl.uniformMatrix4fv(localProjecao, false, projecao);
    gl.uniformMatrix4fv(localVisao, false, visao);
  }

  return {
    atualizar,
    modoAtual() {
      return modo;
    },
  };
}
