// ============================================================
        // Navegação entre a tela de dados do preset e a tela de ajustes
        // ============================================================
        const viewSettings = document.getElementById('view-settings');
        const viewAdjust = document.getElementById('view-adjust');

        function showAdjust() {
            viewSettings.classList.add('hidden');
            viewAdjust.classList.remove('hidden');
            viewAdjust.classList.add('flex');
        }
        function showSettings() {
            viewAdjust.classList.add('hidden');
            viewAdjust.classList.remove('flex');
            viewSettings.classList.remove('hidden');
        }

        document.getElementById('btn-open-adjust').addEventListener('click', showAdjust);
        document.getElementById('btn-back-adjust').addEventListener('click', showSettings);

        document.getElementById('btn-save-settings').addEventListener('click', () => {
            showToast('Preset salvo!');
        });
        document.getElementById('btn-save-adjust').addEventListener('click', () => {
            showToast('Ajustes salvos!');
        });

        // ============================================================
        // Seleção de categoria (tela de dados do preset)
        // ============================================================
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryButtons.forEach(b => {
                    b.classList.remove('border-amber-500', 'bg-amber-500/10');
                    b.classList.add('bg-zinc-800');
                });
                btn.classList.remove('bg-zinc-800');
                btn.classList.add('border-amber-500', 'bg-amber-500/10');
            });
        });

        // ============================================================
        // Imagem de capa: pré-visualização ao escolher um arquivo
        // ============================================================
        document.getElementById('input-capa').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            document.getElementById('preview-capa').src = URL.createObjectURL(file);
        });

        // ============================================================
        // Visibilidade (dropdown simples)
        // ============================================================
        const btnVisibilidade = document.getElementById('btn-visibilidade');
        const menuVisibilidade = document.getElementById('visibilidade-menu');
        const chevronVisibilidade = document.getElementById('visibilidade-chevron');

        btnVisibilidade.addEventListener('click', () => {
            menuVisibilidade.classList.toggle('hidden');
            chevronVisibilidade.classList.toggle('rotate-180');
        });
        document.querySelectorAll('.visibilidade-opt').forEach(opt => {
            opt.addEventListener('click', () => {
                document.getElementById('visibilidade-label').textContent = opt.dataset.visibilidade;
                menuVisibilidade.classList.add('hidden');
                chevronVisibilidade.classList.remove('rotate-180');
            });
        });

        // ============================================================
        // Comparador antes/depois (arraste para revelar)
        // ============================================================
        const compare = document.getElementById('compare');
        const compareAfter = document.getElementById('compare-after');
        const compareLine = document.getElementById('compare-line');
        const compareHandle = document.getElementById('compare-handle');
        let dragging = false;

        function setComparePosition(clientX) {
            const rect = compare.getBoundingClientRect();
            let x = clientX - rect.left;
            x = Math.max(0, Math.min(rect.width, x));
            const pct = (x / rect.width) * 100;
            compareAfter.style.clipPath = `inset(0 0 0 ${pct}%)`;
            compareLine.style.left = pct + '%';
            compareHandle.style.left = pct + '%';
        }

        compareHandle.addEventListener('pointerdown', (e) => { dragging = true; e.preventDefault(); });
        compare.addEventListener('pointerdown', (e) => { dragging = true; setComparePosition(e.clientX); });
        window.addEventListener('pointermove', (e) => { if (dragging) setComparePosition(e.clientX); });
        window.addEventListener('pointerup', () => { dragging = false; });

        // ============================================================
        // Dados dos ajustes por aba
        // ============================================================
        const tabsData = {
            luz: [
                { id: 'exposicao', label: 'Exposição', min: -2, max: 2, step: 0.01, value: 0.35, decimal: true,
                  desc: 'Ajusta o brilho geral. Aumente para clarear ambientes escuros ou diminua para evitar que fotos no sol fiquem brancas demais.' },
                { id: 'contraste', label: 'Contraste', min: -100, max: 100, step: 1, value: 20, decimal: false,
                  desc: 'Aumenta ou reduz a diferença entre tons claros e escuros, deixando a imagem mais vibrante ou mais suave.' },
                { id: 'realces', label: 'Realces', min: -100, max: 100, step: 1, value: -30, decimal: false,
                  desc: 'Controla o brilho das áreas mais claras da imagem, recuperando detalhes estourados.' },
                { id: 'sombras', label: 'Sombras', min: -100, max: 100, step: 1, value: 20, decimal: false,
                  desc: 'Ajusta o brilho das áreas mais escuras, revelando ou aprofundando detalhes.' },
                { id: 'brancos', label: 'Brancos', min: -100, max: 100, step: 1, value: 10, decimal: false,
                  desc: 'Define o ponto de branco da imagem, afetando o quão claros os tons mais claros podem ficar.' },
                { id: 'pretos', label: 'Pretos', min: -100, max: 100, step: 1, value: -15, decimal: false,
                  desc: 'Define o ponto de preto da imagem, aumentando ou diminuindo a profundidade das sombras.' },
            ],
            cor: [
                { id: 'saturacao', label: 'Saturação', min: -100, max: 100, step: 1, value: 15, decimal: false,
                  desc: 'Controla a intensidade das cores da imagem.' },
                { id: 'temperatura', label: 'Temperatura', min: -100, max: 100, step: 1, value: -10, decimal: false,
                  desc: 'Deixa a imagem com tons mais quentes (amarelados) ou mais frios (azulados).' },
                { id: 'matiz', label: 'Matiz', min: -100, max: 100, step: 1, value: 0, decimal: false,
                  desc: 'Desloca as cores da imagem ao longo do espectro de cores.' },
                { id: 'vibracao', label: 'Vibração', min: -100, max: 100, step: 1, value: 25, decimal: false,
                  desc: 'Intensifica cores fracas preservando os tons de pele.' },
            ],
            efeito: [
                { id: 'vinheta', label: 'Vinheta', min: -100, max: 100, step: 1, value: -20, decimal: false,
                  desc: 'Escurece ou clareia as bordas da imagem para direcionar o olhar ao centro.' },
                { id: 'grao', label: 'Grão', min: 0, max: 100, step: 1, value: 10, decimal: false,
                  desc: 'Adiciona uma textura granulada, lembrando fotografia analógica.' },
                { id: 'nitidez_efeito', label: 'Difusão', min: 0, max: 100, step: 1, value: 5, decimal: false,
                  desc: 'Suaviza levemente a imagem para um efeito mais artístico.' },
            ],
            detalhe: [
                { id: 'nitidez', label: 'Nitidez', min: 0, max: 100, step: 1, value: 45, decimal: false,
                  desc: 'Realça bordas e texturas, deixando a imagem com mais definição.' },
                { id: 'reducao_ruido', label: 'Redução de ruído', min: 0, max: 100, step: 1, value: 20, decimal: false,
                  desc: 'Suaviza ruídos digitais, comuns em fotos tiradas com pouca luz.' },
            ],
            otica: [
                { id: 'distorcao', label: 'Distorção', min: -100, max: 100, step: 1, value: 0, decimal: false,
                  desc: 'Corrige distorções causadas pela lente, deixando linhas retas.' },
                { id: 'aberracao', label: 'Aberração cromática', min: 0, max: 100, step: 1, value: 0, decimal: false,
                  desc: 'Remove franjas coloridas indesejadas nas bordas de alto contraste.' },
                { id: 'vinheta_lente', label: 'Vinheta da lente', min: -100, max: 100, step: 1, value: 0, decimal: false,
                  desc: 'Compensa o escurecimento natural nos cantos causado pela lente.' },
            ],
        };

        // Guarda os valores atuais e os valores padrão de cada ajuste
        const currentValues = {};
        const defaultValues = {};
        Object.values(tabsData).flat().forEach(item => {
            currentValues[item.id] = item.value;
            defaultValues[item.id] = item.value;
        });

        function formatValue(value, decimal) {
            const num = decimal ? parseFloat(value) : Math.round(value);
            let str = decimal ? num.toFixed(2) : String(num);
            str = str.replace('.', ',');
            if (num >= 0) str = '+' + str;
            return str;
        }

        const slidersContainer = document.getElementById('sliders-container');
        const tabButtons = document.querySelectorAll('.tab-btn');
        let activeTab = 'luz';

        function setActiveTab(tab) {
            activeTab = tab;
            tabButtons.forEach(btn => {
                const isActive = btn.dataset.tab === tab;
                btn.classList.toggle('bg-amber-500', isActive);
                btn.classList.toggle('text-black', isActive);
                btn.classList.toggle('text-zinc-300', !isActive);
            });
            renderSliders(tab);
        }

        function renderSliders(tab) {
            const items = tabsData[tab];
            slidersContainer.innerHTML = items.map(item => `
                <div class="py-3.5" data-row="${item.id}">
                    <div class="flex items-center justify-between mb-2">
                        <button type="button" class="info-btn flex items-center gap-1.5 text-sm text-zinc-200" data-info="${item.id}">
                            ${item.label}
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="w-3.5 h-3.5 text-amber-500">
                                <circle cx="12" cy="12" r="9"/>
                                <path d="M12 10.5v5.5M12 7.8v.1" stroke-linecap="round"/>
                            </svg>
                        </button>
                        <span id="value-${item.id}" class="text-sm text-zinc-300 tabular-nums">${formatValue(currentValues[item.id], item.decimal)}</span>
                    </div>
                    <input type="range" id="range-${item.id}" min="${item.min}" max="${item.max}" step="${item.step}" value="${currentValues[item.id]}">
                    <div id="desc-${item.id}" class="hidden mt-3 bg-zinc-800 rounded-xl p-3 text-xs leading-relaxed text-zinc-300">
                        ${item.desc}
                    </div>
                </div>
            `).join('');

            items.forEach(item => {
                const range = document.getElementById(`range-${item.id}`);
                const valueEl = document.getElementById(`value-${item.id}`);
                range.addEventListener('input', () => {
                    currentValues[item.id] = parseFloat(range.value);
                    valueEl.textContent = formatValue(currentValues[item.id], item.decimal);
                });
            });

            slidersContainer.querySelectorAll('.info-btn').forEach(btn => {
                btn.addEventListener('click', () => toggleDescription(btn.dataset.info));
            });
        }

        function toggleDescription(id) {
            const desc = document.getElementById(`desc-${id}`);
            const isOpen = !desc.classList.contains('hidden');
            // fecha todas as descrições abertas (comportamento tipo acordeão)
            slidersContainer.querySelectorAll('[id^="desc-"]').forEach(d => d.classList.add('hidden'));
            if (!isOpen) desc.classList.remove('hidden');
        }

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
        });

        // ============================================================
        // Ações do rodapé: Redefinir / Histórico / Copiar ajustes
        // ============================================================
        document.getElementById('btn-reset').addEventListener('click', () => {
            tabsData[activeTab].forEach(item => { currentValues[item.id] = defaultValues[item.id]; });
            renderSliders(activeTab);
            showToast('Ajustes redefinidos.');
        });

        document.getElementById('btn-historico').addEventListener('click', () => {
            showToast('Nenhum histórico de ajustes ainda.');
        });

        document.getElementById('btn-copiar').addEventListener('click', () => {
            const resumo = Object.values(tabsData).flat()
                .map(item => `${item.label}: ${formatValue(currentValues[item.id], item.decimal)}`)
                .join('\n');
            if (navigator.clipboard) {
                navigator.clipboard.writeText(resumo).catch(() => {});
            }
            showToast('Ajustes copiados!');
        });

        // ============================================================
        // Toast simples de feedback
        // ============================================================
        let toastTimeout;
        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.remove('hidden');
            requestAnimationFrame(() => { toast.classList.remove('opacity-0'); });
            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toast.classList.add('opacity-0');
                setTimeout(() => toast.classList.add('hidden'), 250);
            }, 2000);
        }

        // Inicialização
        setActiveTab('luz');