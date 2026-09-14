document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       TELA DA CÂMERA (index.html)
       Tudo aqui dentro só roda se os elementos existirem,
       então este mesmo arquivo pode ser usado em outras páginas
       (como presets.html) sem quebrar nada.
    ========================================================= */
    const captureBtn = document.getElementById('capture-btn');

    if (captureBtn) {
        const btnFlash = document.getElementById('btn-flash');
        const btnTimer = document.getElementById('btn-timer');
        const timerMenu = document.getElementById('timer-menu');
        const timerBadge = document.getElementById('timer-badge');

        const btnFilter = document.getElementById('btn-filter');
        const filtersStrip = document.getElementById('filters-strip');
        const aspectRow = document.getElementById('aspect-row');
        const cameraPreview = document.getElementById('camera-preview');

        const btnSettings = document.getElementById('btn-settings');
        const settingsOverlay = document.getElementById('settings-overlay');
        const settingsPanel = document.getElementById('settings-panel');
        const closeSettings = document.getElementById('close-settings');
        const gridOverlay = document.getElementById('grid-overlay');

        const captureFlash = document.getElementById('capture-flash');
        const countdownOverlay = document.getElementById('countdown-overlay');
        const countdownNumber = document.getElementById('countdown-number');

        const thumbnail = document.getElementById('thumbnail');
        const flipBtn = document.getElementById('flip-btn');

        let tempoSelecionado = 0;
        let flashLigado = false;
        let disparando = false;

        /* ---------- FLASH ---------- */
        if (btnFlash) {
            btnFlash.addEventListener('click', () => {
                flashLigado = !flashLigado;
                btnFlash.classList.toggle('opacity-100', flashLigado);
                btnFlash.style.filter = flashLigado ? 'drop-shadow(0 0 4px #eab308)' : 'none';
            });
        }

        /* ---------- TEMPORIZADOR ---------- */
        if (btnTimer && timerMenu) {
            btnTimer.addEventListener('click', (e) => {
                e.stopPropagation();
                if (filtersStrip) fecharFiltros();
                timerMenu.classList.toggle('hidden');
            });

            timerMenu.querySelectorAll('.timer-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    tempoSelecionado = parseInt(btn.dataset.timer, 10);
                    timerMenu.classList.add('hidden');

                    if (timerBadge) {
                        if (tempoSelecionado > 0) {
                            timerBadge.textContent = tempoSelecionado;
                            timerBadge.classList.remove('hidden');
                        } else {
                            timerBadge.classList.add('hidden');
                        }
                    }
                });
            });

            document.addEventListener('click', () => timerMenu.classList.add('hidden'));
        }

        /* ---------- FILTROS ---------- */
        // ao abrir a faixa de filtros, escondemos a linha de proporção (1:1/4:3/16:9)
        // pra não empurrar o layout e afetar a posição do botão de disparo
        function abrirFiltros() {
            filtersStrip.classList.remove('hidden');
            if (aspectRow) aspectRow.classList.add('hidden');
        }
        function fecharFiltros() {
            filtersStrip.classList.add('hidden');
            if (aspectRow) aspectRow.classList.remove('hidden');
        }

        if (btnFilter && filtersStrip) {
            btnFilter.addEventListener('click', (e) => {
                e.stopPropagation();
                if (timerMenu) timerMenu.classList.add('hidden');

                const estaAberto = !filtersStrip.classList.contains('hidden');
                if (estaAberto) {
                    fecharFiltros();
                } else {
                    abrirFiltros();
                }
            });

            filtersStrip.querySelectorAll('.filter-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (cameraPreview) cameraPreview.style.filter = btn.dataset.filter;

                    filtersStrip.querySelectorAll('.filter-option div').forEach(div => {
                        div.classList.remove('border-yellow-400');
                        div.classList.add('border-transparent');
                    });
                    const activeDiv = btn.querySelector('div');
                    activeDiv.classList.remove('border-transparent');
                    activeDiv.classList.add('border-yellow-400');
                });
            });
        }

        /* ---------- CONFIGURAÇÕES ---------- */
        if (btnSettings && settingsPanel && settingsOverlay) {
            function abrirConfiguracoes() {
                settingsOverlay.classList.remove('hidden');
                settingsPanel.classList.remove('hidden');
            }
            function fecharConfiguracoes() {
                settingsOverlay.classList.add('hidden');
                settingsPanel.classList.add('hidden');
            }

            btnSettings.addEventListener('click', abrirConfiguracoes);
            if (closeSettings) closeSettings.addEventListener('click', fecharConfiguracoes);
            settingsOverlay.addEventListener('click', fecharConfiguracoes);

            const settingGrid = document.getElementById('setting-grid');
            if (settingGrid && gridOverlay) {
                settingGrid.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        gridOverlay.classList.remove('hidden');
                        gridOverlay.style.backgroundImage = `
                            linear-gradient(to right, rgba(255,255,255,0.4) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.4) 1px, transparent 1px)`;
                        gridOverlay.style.backgroundSize = '33.33% 33.33%';
                    } else {
                        gridOverlay.classList.add('hidden');
                    }
                });
            }

            document.querySelectorAll('.res-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.res-option').forEach(b => {
                        b.classList.remove('bg-yellow-500', 'text-black');
                        b.classList.add('bg-zinc-800', 'text-white');
                    });
                    btn.classList.remove('bg-zinc-800', 'text-white');
                    btn.classList.add('bg-yellow-500', 'text-black');
                });
            });
        }

        /* ---------- ASPECTO (1:1 / 4:3 / 16:9) ---------- */
        document.querySelectorAll('.aspect-option').forEach(el => {
            el.addEventListener('click', () => {
                document.querySelectorAll('.aspect-option').forEach(o => o.classList.replace('opacity-100', 'opacity-60'));
                el.classList.replace('opacity-60', 'opacity-100');
            });
        });

        /* ---------- MODOS ---------- */
        document.querySelectorAll('.mode-option').forEach(el => {
            el.addEventListener('click', () => {
                document.querySelectorAll('.mode-option').forEach(o => {
                    o.classList.remove('opacity-100', 'text-yellow-400');
                    o.classList.add('opacity-60');
                });
                el.classList.remove('opacity-60');
                el.classList.add('opacity-100', 'text-yellow-400');
            });
        });

        /* ---------- DISPARO ---------- */
        function dispararFoto() {
            if (disparando) return;
            disparando = true;

            const somAtivo = document.getElementById('setting-sound')
                ? document.getElementById('setting-sound').checked
                : true;

            if (captureFlash) {
                captureFlash.classList.remove('hidden');
                requestAnimationFrame(() => {
                    captureFlash.style.opacity = flashLigado ? '0.9' : '0.35';
                    setTimeout(() => {
                        captureFlash.style.opacity = '0';
                        setTimeout(() => captureFlash.classList.add('hidden'), 150);
                    }, 100);
                });
            }

            if (thumbnail && cameraPreview) {
                thumbnail.src = cameraPreview.src;
                thumbnail.style.filter = cameraPreview.style.filter;
            }

            if (somAtivo) {
                try {
                    const ctx = new (window.AudioContext || window.webkitAudioContext)();
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.frequency.value = 880;
                    gain.gain.value = 0.15;
                    osc.connect(gain).connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.08);
                } catch (err) { /* ambiente sem suporte a áudio: ignora */ }
            }

            disparando = false;
        }

        captureBtn.addEventListener('click', () => {
            if (disparando) return;

            if (tempoSelecionado > 0 && countdownOverlay && countdownNumber) {
                let restante = tempoSelecionado;
                countdownOverlay.classList.remove('hidden');
                countdownNumber.textContent = restante;

                const intervalo = setInterval(() => {
                    restante -= 1;
                    if (restante > 0) {
                        countdownNumber.textContent = restante;
                    } else {
                        clearInterval(intervalo);
                        countdownOverlay.classList.add('hidden');
                        dispararFoto();
                    }
                }, 1000);
            } else {
                dispararFoto();
            }
        });

        /* ---------- TROCAR CÂMERA ---------- */
        if (flipBtn) {
            flipBtn.addEventListener('click', () => {
                flipBtn.style.transition = 'transform 300ms ease';
                flipBtn.style.transform = 'rotate(180deg)';
                setTimeout(() => { flipBtn.style.transform = 'rotate(0deg)'; }, 300);
            });
        }
    }

    /* =========================================================
       TELA DE PRESETS (presets.html)
    ========================================================= */
    const presetCards = document.querySelectorAll('.preset-card');

    if (presetCards.length > 0) {
        presetCards.forEach(card => {
            card.addEventListener('click', () => {
                presetCards.forEach(c => {
                    c.classList.remove('border-amber-500/80', 'bg-amber-500/5');
                    c.classList.add('border-transparent');

                    const check = c.querySelector('.check-icon');
                    const edit = c.querySelector('.edit-btn');
                    if (check) check.classList.add('hidden');
                    if (edit) edit.classList.add('hidden');
                });

                card.classList.remove('border-transparent');
                card.classList.add('border-amber-500/80', 'bg-amber-500/5');

                const activeCheck = card.querySelector('.check-icon');
                const activeEdit = card.querySelector('.edit-btn');
                if (activeCheck) activeCheck.classList.remove('hidden');
                if (activeEdit) activeEdit.classList.remove('hidden');
            });
        });
    }

});