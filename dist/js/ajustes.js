document.addEventListener('DOMContentLoaded', () => {

    // 1. Alternar exibição do Balão Explicativo (Tooltip do ícone 'i')
    const btnInfo = document.getElementById('btn-info-exposicao');
    const tooltip = document.getElementById('tooltip-exposicao');

    if (btnInfo && tooltip) {
        btnInfo.addEventListener('click', (e) => {
            e.stopPropagation();
            tooltip.classList.toggle('hidden');
        });

        // Fecha o balão se clicar em qualquer outro lugar fora dele
        document.addEventListener('click', (e) => {
            if (!tooltip.contains(e.target) && e.target !== btnInfo) {
                tooltip.classList.add('hidden');
            }
        });
    }

    // 2. Atualizar valores dos Sliders dinamicamente (+35, +20, -30...)
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        slider.addEventListener('input', (e) => {
            const container = e.target.closest('.space-y-1');
            const display = container ? container.querySelector('span[id^="val-"]') : null;
            if (display) {
                const valor = Number(e.target.value);
                display.textContent = valor > 0 ? `+${valor}` : `${valor}`;
            }
        });
    });

    // 3. Alternar Abas (Luz, Cor, Efeito, Detalhe, Ótica)
    const tabButtons = document.querySelectorAll('nav button');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => {
                b.classList.remove('bg-zinc-800', 'text-amber-500', 'shadow-sm');
                b.classList.add('text-zinc-400');
            });
            btn.classList.add('bg-zinc-800', 'text-amber-500', 'shadow-sm');
            btn.classList.remove('text-zinc-400');
        });
    });

    // 4. Ação do Botão Salvar (Feedback e Redirecionamento)
    const btnSalvar = document.getElementById('btn-salvar');
    if (btnSalvar) {
        btnSalvar.addEventListener('click', () => {
            alert('Ajustes salvos com sucesso!');
            window.location.href = 'presets.html';
        });
    }

});