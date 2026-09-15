document.addEventListener('DOMContentLoaded', () => {

    const captureBtn = document.getElementById('capture-btn');

    if (captureBtn) {
        const btnFlash = document.getElementById('btn-flash');
        const btnTimer = document.getElementById('btn-timer');
        const timerMenu = document.getElementById('timer-menu');
        const timerBadge = document.getElementById('timer-badge');

        const btnFilter = document.getElementById('btn-filter');
        const filtersStrip = document.getElementById('filters-strip');
        const aspectRow = document.getElementById('aspect-row');

        const previewArea = document.getElementById('preview-area');
        const previewWrapper = document.getElementById('preview-wrapper');
        const cameraPreview = document.getElementById('camera-preview');
        const cameraLabel = document.getElementById('camera-label');

        const btnSettings = document.getElementById('btn-settings');
        const settingsOverlay = document.getElementById('settings-overlay');
        const settingsPanel = document.getElementById('settings-panel');
        const closeSettings = document.getElementById('close-settings');
        const gridOverlay = document.getElementById('grid-overlay');

        const captureFlash = document.getElementById('capture-flash');
        const countdownOverlay = document.getElementById('countdown-overlay');
        const countdownNumber = document.getElementById('countdown-number');

        const thumbnail = document.getElementById('thumbnail');
        const galleryCount = document.getElementById('gallery-count');
        const flipBtn = document.getElementById('flip-btn');
        const toast = document.getElementById('toast');

        const galleryPanel = document.getElementById('gallery-panel');
        const galleryGrid = document.getElementById('gallery-grid');
        const galleryEmpty = document.getElementById('gallery-empty');
        const galleryClose = document.getElementById('gallery-close');
        const galleryTotal = document.getElementById('gallery-total');

        const viewerPanel = document.getElementById('viewer-panel');
        const viewerImage = document.getElementById('viewer-image');
        const viewerInfo = document.getElementById('viewer-info');
        const viewerClose = document.getElementById('viewer-close');
        const viewerDelete = document.getElementById('viewer-delete');
        const viewerPrev = document.getElementById('viewer-prev');
        const viewerNext = document.getElementById('viewer-next');

        
        const IMG_TRASEIRA = './assets/camera/background_camera.png';
        const IMG_FRONTAL  = './assets/camera/background_camera.png';

        let tempoSelecionado = 0;
        let flashLigado = false;
        let disparando = false;
        let filtroAtual = 'none';
        let aspectoAtual = '4:3';
        let cameraFrontal = false;
        let virando = false;

        /* Galeria: cada item é { src, filter, aspect, espelhada, hora } */
        const galeria = [];

      //mensagem flutuante
        let toastTimer = null;
        function mostrarToast(texto) {
            if (!toast) return;
            toast.textContent = texto;
            toast.classList.remove('hidden');
            requestAnimationFrame(() => { toast.style.opacity = '1'; });

            clearTimeout(toastTimer);
            toastTimer = setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.classList.add('hidden'), 300);
            }, 1400);
        }

      //proporção
        const PROPORCOES = {
            '1:1':  [1, 1],
            '4:3':  [3, 4],
            '16:9': [9, 16]
        };

        function aplicarProporcao() {
            if (!previewArea || !previewWrapper) return;

            const [rw, rh] = PROPORCOES[aspectoAtual] || PROPORCOES['4:3'];

            const dispW = previewArea.clientWidth;
            const dispH = previewArea.clientHeight;
            if (dispW === 0 || dispH === 0) return;

            let largura = dispW;
            let altura = largura * rh / rw;

            if (altura > dispH) {
                altura = dispH;
                largura = altura * rw / rh;
            }

            previewWrapper.style.width = Math.floor(largura) + 'px';
            previewWrapper.style.height = Math.floor(altura) + 'px';
        }

        // recalcula quando a janela muda de tamanho ou quando a
        // faixa de filtros abre/fecha (o espaço disponível muda)
        window.addEventListener('resize', aplicarProporcao);
        if (window.ResizeObserver && previewArea) {
            new ResizeObserver(aplicarProporcao).observe(previewArea);
        }
        aplicarProporcao();

        document.querySelectorAll('.aspect-option').forEach(el => {
            el.addEventListener('click', () => {
                document.querySelectorAll('.aspect-option').forEach(o => {
                    o.classList.remove('opacity-100');
                    o.classList.add('opacity-60');
                });
                el.classList.remove('opacity-60');
                el.classList.add('opacity-100');

                aspectoAtual = el.dataset.aspect;
                aplicarProporcao();
                mostrarToast('Proporção ' + aspectoAtual);
            });
        });

     //flash
        if (btnFlash) {
            btnFlash.addEventListener('click', () => {
                flashLigado = !flashLigado;
                btnFlash.classList.toggle('opacity-100', flashLigado);
                btnFlash.style.filter = flashLigado ? 'drop-shadow(0 0 4px #eab308)' : 'none';
                mostrarToast(flashLigado ? 'Flash ligado' : 'Flash desligado');
            });
        }
//temporizador
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

        //filtros
        function abrirFiltros() {
            filtersStrip.classList.remove('hidden');
            if (aspectRow) aspectRow.classList.add('hidden');
            aplicarProporcao();
        }
        function fecharFiltros() {
            filtersStrip.classList.add('hidden');
            if (aspectRow) aspectRow.classList.remove('hidden');
            aplicarProporcao();
        }

        if (btnFilter && filtersStrip) {
            btnFilter.addEventListener('click', (e) => {
                e.stopPropagation();
                if (timerMenu) timerMenu.classList.add('hidden');

                const estaAberto = !filtersStrip.classList.contains('hidden');
                if (estaAberto) fecharFiltros();
                else abrirFiltros();
            });

            filtersStrip.querySelectorAll('.filter-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    // se o usuário estava arrastando a faixa, não seleciona
                    if (arrastou) return;

                    filtroAtual = btn.dataset.filter;
                    if (cameraPreview) cameraPreview.style.filter = filtroAtual;

                    filtersStrip.querySelectorAll('.filter-option div').forEach(div => {
                        div.classList.remove('border-yellow-400');
                        div.classList.add('border-transparent');
                    });
                    const activeDiv = btn.querySelector('div');
                    activeDiv.classList.remove('border-transparent');
                    activeDiv.classList.add('border-yellow-400');

                    // centraliza o filtro escolhido na faixa
                    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                });
            });

            //arrastar filtros
            let arrastando = false;
            var arrastou = false;
            let inicioX = 0;
            let inicioScroll = 0;

            filtersStrip.addEventListener('mousedown', (e) => {
                arrastando = true;
                arrastou = false;
                inicioX = e.pageX;
                inicioScroll = filtersStrip.scrollLeft;
            });

            window.addEventListener('mousemove', (e) => {
                if (!arrastando) return;
                const distancia = e.pageX - inicioX;
                if (Math.abs(distancia) > 4) arrastou = true;
                filtersStrip.scrollLeft = inicioScroll - distancia;
            });

            window.addEventListener('mouseup', () => {
                arrastando = false;
                // solta a trava do clique logo depois, para não bloquear
                // o próximo clique de verdade
                setTimeout(() => { arrastou = false; }, 50);
            });

            // roda do mouse: rola na horizontal em vez da vertical
            filtersStrip.addEventListener('wheel', (e) => {
                if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                    e.preventDefault();
                    filtersStrip.scrollLeft += e.deltaY;
                }
            }, { passive: false });
        }
//configurações
        if (btnSettings && settingsPanel && settingsOverlay) {
            const abrirConfiguracoes = () => {
                settingsOverlay.classList.remove('hidden');
                settingsPanel.classList.remove('hidden');
            };
            const fecharConfiguracoes = () => {
                settingsOverlay.classList.add('hidden');
                settingsPanel.classList.add('hidden');
            };

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

            const settingMirror = document.getElementById('setting-mirror');
            if (settingMirror) {
                settingMirror.addEventListener('change', atualizarEspelho);
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

    //modos
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
//trocar camera
        function espelhandoAgora() {
            const settingMirror = document.getElementById('setting-mirror');
            const espelharAtivo = settingMirror ? settingMirror.checked : true;
            return cameraFrontal && espelharAtivo;
        }

        function atualizarEspelho() {
            if (!cameraPreview) return;
            cameraPreview.style.transform = espelhandoAgora() ? 'scaleX(-1)' : 'scaleX(1)';
        }

        function mostrarEtiquetaCamera() {
            if (!cameraLabel) return;
            cameraLabel.textContent = cameraFrontal ? 'Frontal' : 'Traseira';
            cameraLabel.style.opacity = '1';
            setTimeout(() => { cameraLabel.style.opacity = '0'; }, 1400);
        }

        if (flipBtn) {
            flipBtn.addEventListener('click', () => {
                if (virando) return;
                virando = true;

                // gira o ícone
                flipBtn.style.transition = 'transform 400ms ease';
                flipBtn.style.transform = 'rotate(180deg)';
                setTimeout(() => {
                    flipBtn.style.transition = 'none';
                    flipBtn.style.transform = 'rotate(0deg)';
                }, 400);

                // "vira" o preview em 3D
                if (previewWrapper) {
                    previewWrapper.style.transition = 'transform 200ms ease-in';
                    previewWrapper.style.transform = 'rotateY(90deg)';

                    setTimeout(() => {
                        cameraFrontal = !cameraFrontal;

                        if (cameraPreview) {
                            cameraPreview.src = cameraFrontal ? IMG_FRONTAL : IMG_TRASEIRA;
                        }
                        atualizarEspelho();
                        mostrarEtiquetaCamera();

                        previewWrapper.style.transition = 'transform 200ms ease-out';
                        previewWrapper.style.transform = 'rotateY(0deg)';

                        setTimeout(() => { virando = false; }, 200);
                    }, 200);
                } else {
                    cameraFrontal = !cameraFrontal;
                    virando = false;
                }
            });
        }
//galeria
        function atualizarThumbnail() {
            if (!thumbnail) return;

            if (galeria.length === 0) {
                thumbnail.src = './assets/camera/mini_background_camera.png';
                thumbnail.style.filter = 'none';
                thumbnail.style.transform = 'scaleX(1)';
            } else {
                const ultima = galeria[galeria.length - 1];
                thumbnail.src = ultima.src;
                thumbnail.style.filter = ultima.filter === 'none' ? 'none' : ultima.filter;
                thumbnail.style.transform = ultima.espelhada ? 'scaleX(-1)' : 'scaleX(1)';
            }

            if (galleryCount) {
                if (galeria.length > 0) {
                    galleryCount.textContent = galeria.length;
                    galleryCount.classList.remove('hidden');
                } else {
                    galleryCount.classList.add('hidden');
                }
            }
        }

        function renderizarGaleria() {
            if (!galleryGrid) return;

            galleryGrid.innerHTML = '';
            if (galleryTotal) galleryTotal.textContent = galeria.length;

            if (galeria.length === 0) {
                galleryGrid.classList.add('hidden');
                if (galleryEmpty) galleryEmpty.classList.remove('hidden');
                return;
            }

            galleryGrid.classList.remove('hidden');
            if (galleryEmpty) galleryEmpty.classList.add('hidden');

            galeria.slice().reverse().forEach((foto) => {
                const indiceReal = galeria.indexOf(foto);

                const item = document.createElement('button');
                item.className = 'relative w-full aspect-square rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-yellow-400 transition-colors';

                const img = document.createElement('img');
                img.src = foto.src;
                img.alt = 'foto da galeria';
                img.className = 'w-full h-full object-cover pointer-events-none';
                img.style.filter = foto.filter === 'none' ? 'none' : foto.filter;
                if (foto.espelhada) img.style.transform = 'scaleX(-1)';

                const tag = document.createElement('span');
                tag.className = 'absolute bottom-1 right-1 bg-black/60 text-[8px] px-1 py-0.5 rounded text-white pointer-events-none';
                tag.textContent = foto.aspect;

                item.appendChild(img);
                item.appendChild(tag);
                item.addEventListener('click', () => abrirVisualizador(indiceReal));

                galleryGrid.appendChild(item);
            });
        }

        function abrirGaleria() {
            if (!galleryPanel) return;
            renderizarGaleria();
            galleryPanel.classList.remove('hidden');
        }

        function fecharGaleria() {
            if (galleryPanel) galleryPanel.classList.add('hidden');
        }

        if (thumbnail) thumbnail.addEventListener('click', abrirGaleria);
        if (galleryClose) galleryClose.addEventListener('click', fecharGaleria);

        let indiceAtual = 0;

        function abrirVisualizador(indice) {
            if (!viewerPanel || galeria.length === 0) return;
            indiceAtual = indice;
            atualizarVisualizador();
            viewerPanel.classList.remove('hidden');
        }

        function atualizarVisualizador() {
            const foto = galeria[indiceAtual];
            if (!foto) { viewerPanel.classList.add('hidden'); return; }

            viewerImage.src = foto.src;
            viewerImage.style.filter = foto.filter === 'none' ? 'none' : foto.filter;
            viewerImage.style.transform = foto.espelhada ? 'scaleX(-1)' : 'scaleX(1)';

            if (viewerInfo) {
                viewerInfo.textContent =
                    (indiceAtual + 1) + ' de ' + galeria.length + ' · ' + foto.aspect + ' · ' + foto.hora;
            }
        }

        if (viewerClose) viewerClose.addEventListener('click', () => viewerPanel.classList.add('hidden'));

        if (viewerPrev) viewerPrev.addEventListener('click', () => {
            if (galeria.length === 0) return;
            indiceAtual = (indiceAtual - 1 + galeria.length) % galeria.length;
            atualizarVisualizador();
        });

        if (viewerNext) viewerNext.addEventListener('click', () => {
            if (galeria.length === 0) return;
            indiceAtual = (indiceAtual + 1) % galeria.length;
            atualizarVisualizador();
        });

        if (viewerDelete) viewerDelete.addEventListener('click', () => {
            if (galeria.length === 0) return;
            galeria.splice(indiceAtual, 1);

            atualizarThumbnail();
            renderizarGaleria();
            mostrarToast('Foto excluída');

            if (galeria.length === 0) {
                viewerPanel.classList.add('hidden');
            } else {
                if (indiceAtual >= galeria.length) indiceAtual = galeria.length - 1;
                atualizarVisualizador();
            }
        });

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

            const agora = new Date();
            galeria.push({
                src: cameraPreview ? cameraPreview.src : IMG_TRASEIRA,
                filter: filtroAtual,
                aspect: aspectoAtual,
                espelhada: espelhandoAgora(),
                hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            });

            atualizarThumbnail();

            if (thumbnail) {
                thumbnail.animate(
                    [{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }],
                    { duration: 300, easing: 'ease-out' }
                );
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
                } catch (err) {  }
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

        atualizarThumbnail();
        atualizarEspelho();
        if (cameraPreview) cameraPreview.addEventListener('load', aplicarProporcao);
    }

    //presets
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