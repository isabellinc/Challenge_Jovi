document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.preset-card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove a seleção e oculta os ícones de todos os cartões
            cards.forEach(c => {
                c.classList.remove('border-amber-500/80', 'bg-amber-500/5');
                c.classList.add('border-transparent');
                
                const check = c.querySelector('.check-icon');
                const edit = c.querySelector('.edit-btn');
                if (check) check.classList.add('hidden');
                if (edit) edit.classList.add('hidden');
            });

            // Aplica o contorno dourado e exibe os ícones no cartão clicado
            card.classList.remove('border-transparent');
            card.classList.add('border-amber-500/80', 'bg-amber-500/5');

            const activeCheck = card.querySelector('.check-icon');
            const activeEdit = card.querySelector('.edit-btn');
            if (activeCheck) activeCheck.classList.remove('hidden');
            if (activeEdit) activeEdit.classList.remove('hidden');
        });
    });
});