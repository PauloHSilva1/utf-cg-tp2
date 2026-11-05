import { iniciarWebGL, ajustarTela, limparTela } from './webgl.js';
import { carregarPrograma } from './shaders.js';
import { criarCamera } from './camera.js';
import { criarChao } from './chao.js';
import { criarFormas } from './formas.js';
import { criarMoinho } from './moinho.js';
import { criarPraia } from './praia.js';
import { criarTartaruga } from './tartaruga.js';
import { criarPalmeiras } from './palmeira.js';
import { criarConchas } from './conchas.js';
import { criarCabana } from './cabana.js';
import { carregarObj } from './obj.js';
import { escalar, transladar, multiplicar } from './matrizes.js';

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
    const tartaruga = criarTartaruga(formas);
    const palmeiras = criarPalmeiras(formas);
    const conchas = criarConchas(formas);
    const cabana = criarCabana(formas);
    const estrela = await carregarObj(
      gl,
      programa,
      new URL('../assets/modelos/estrela-do-mar.obj', import.meta.url)
    );
    const matrizEstrela = multiplicar(transladar(-5.8, .025, -.8), escalar(.85, .85, .85));

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
      cabana.desenhar();
      conchas.desenhar();
      estrela.desenhar(matrizEstrela, [.93, .38, .16]);
      tartaruga.desenhar(agora / 1000);
      praia.desenhar(agora / 1000);
      requestAnimationFrame(desenhar);
    }

    requestAnimationFrame(desenhar);
  } catch (erro) {
    console.error(erro);
  }
}

iniciar();
