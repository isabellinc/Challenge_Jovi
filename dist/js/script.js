function abrirModal(id) {
    document.getElementById(id).classList.remove('hidden');
}

function fecharModal(id) {
    document.getElementById(id).classList.add('hidden');
}

let flashAtivo = false;

function alternarFlash() {
    flashAtivo = !flashAtivo;
    const icone = document.getElementById('icone-flash');

    icone.src = flashAtivo
        ? './assets/camera/flash-on.png'
        : './assets/camera/flash.png';
}

function tirarFoto() {
    if (flashAtivo) {
        const overlay = document.getElementById('flash-overlay');
        overlay.classList.remove('hidden');

        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 150);
    }

}

function selecionarFiltro(botaoClicado) {
    document.querySelectorAll('.filtro-btn img').forEach((img) => {
        img.classList.remove('border-[#ec1163]');
        img.classList.add('border-transparent');
    });

    const imagem = botaoClicado.querySelector('img');
    imagem.classList.remove('border-transparent');
    imagem.classList.add('border-[#ec1163]');
}

let tempoTimer = 0;

function selecionarTimer(botaoClicado, segundos) {
    tempoTimer = segundos;

    document.querySelectorAll('.timer-btn').forEach((btn) => {
        btn.classList.remove('bg-[#ec1163]');
        btn.classList.add('bg-neutral-800');
    });

    // Destaca o botão clicado
    botaoClicado.classList.remove('bg-neutral-800');
    botaoClicado.classList.add('bg-[#ec1163]');
}