import { iniciarWebGL, ajustarTela, limparTela } from './webgl.js';
import { carregarPrograma } from './shaders.js';
import { criarCamera } from './camera.js';
import { criarChao } from './chao.js';
import { criarFormas } from './formas.js';
import { criarMoinho } from './moinho.js';
import { criarPraia } from './praia.js';
import { criarSquirtle } from './squirtle.js';
import { criarPalmeiras } from './palmeira.js';

const tela = document.querySelector('#tela');

async function iniciar() {
  try {
    const gl = iniciarWebGL(tela);
    const programa = await carregarPrograma(gl);
    gl.useProgram(programa);
    const camera = criarCamera(gl, programa);
    const chao = criarChao(gl, programa);
    const formas = criarFormas(gl, programa);
    const moinho = criarMoinho(formas);
    const praia = criarPraia(gl, programa);
    const squirtle = criarSquirtle(formas);
    const palmeiras = criarPalmeiras(formas);

    function redimensionar() {
      ajustarTela(gl);
      camera.atualizar();
    }

    window.addEventListener('resize', redimensionar);
    redimensionar();

    function desenhar(agora) {
      camera.atualizar();
      limparTela(gl);
      chao.desenhar();
      moinho.desenhar(agora / 1000);
      palmeiras.desenhar();
      squirtle.desenhar(agora / 1000);
      praia.desenhar(agora / 1000);
      requestAnimationFrame(desenhar);
    }

    requestAnimationFrame(desenhar);
  } catch (erro) {
    console.error(erro);
  }
}

iniciar();
