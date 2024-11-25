const imagens = ['🍎', '🍌', '🍇'];

let cartas = [];
let primeiraCarta = null;
let segundaCarta = null;
let bloqueio = false;
let tentativas = 0;
let paresEncontrados = 0;

const gameContainer = document.getElementById('game');
const tentativasElemento = document.getElementById('tentativas');
const reiniciarBotao = document.getElementById('reiniciar');
const mostrarHistoricoBotao = document.getElementById('mostrarHistorico');
const historicoElemento = document.getElementById('historico');
const parabensElemento = document.getElementById('parabens');
const reiniciarFinalBotao = document.getElementById('reiniciarFinal');
const historicoModal = document.getElementById('historicoModal');
const fecharHistoricoBotao = document.getElementById('fecharHistorico');

let historico = JSON.parse(localStorage.getItem('historico')) || [];
atualizarHistorico();

function criarCartas() {
    cartas = [...imagens, ...imagens];
    cartas = embaralhar(cartas);
    gameContainer.innerHTML = '';
    cartas.forEach((item, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.id = index;
        card.dataset.valor = item;

        const front = document.createElement('div');
        front.classList.add('front');
        front.textContent = '❓';

        const back = document.createElement('div');
        back.classList.add('back');
        back.textContent = item;

        card.appendChild(front);
        card.appendChild(back);

        gameContainer.appendChild(card);

        card.addEventListener('click', virarCarta);
    });
}

function embaralhar(array) {
    let arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function virarCarta() {
    if (bloqueio) return;
    if (this.classList.contains('flip') || this.classList.contains('matched')) return;

    this.classList.add('flip');

    if (!primeiraCarta) {
        primeiraCarta = this;
        return;
    }

    segundaCarta = this;
    bloqueio = true;

    tentativas++;
    tentativasElemento.textContent = tentativas;

    verificarCartas();
}

function verificarCartas() {
    const valor1 = primeiraCarta.dataset.valor;
    const valor2 = segundaCarta.dataset.valor;

    if (valor1 === valor2) {
        primeiraCarta.classList.add('matched');
        segundaCarta.classList.add('matched');
        paresEncontrados++;
        resetarCartas();

        if (paresEncontrados === imagens.length) {
            fimDoJogo();
        }
    } else {
        setTimeout(() => {
            primeiraCarta.classList.remove('flip');
            segundaCarta.classList.remove('flip');
            resetarCartas();
        }, 1000);
    }
}

function resetarCartas() {
    [primeiraCarta, segundaCarta] = [null, null];
    bloqueio = false;
}

function fimDoJogo() {
    historico.push(tentativas);
    localStorage.setItem('historico', JSON.stringify(historico));
    atualizarHistorico();
    parabensElemento.style.display = 'flex';
}

function atualizarHistorico() {
    historicoElemento.innerHTML = '';
    historico.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `Rodada ${index + 1}: ${item} tentativas`;
        historicoElemento.appendChild(li);
    });
}

function reiniciarJogo() {
    [primeiraCarta, segundaCarta] = [null, null];
    bloqueio = false;
    tentativas = 0;
    paresEncontrados = 0;
    tentativasElemento.textContent = tentativas;
    parabensElemento.style.display = 'none';
    criarCartas();
}

function mostrarHistorico() {
    historicoModal.style.display = 'flex';
}

function fecharHistorico() {
    historicoModal.style.display = 'none';
}

reiniciarBotao.addEventListener('click', reiniciarJogo);
reiniciarFinalBotao.addEventListener('click', reiniciarJogo);
mostrarHistoricoBotao.addEventListener('click', mostrarHistorico);
fecharHistoricoBotao.addEventListener('click', fecharHistorico);

window.addEventListener('click', function(event) {
    if (event.target === historicoModal) {
        fecharHistorico();
    }
});

criarCartas();