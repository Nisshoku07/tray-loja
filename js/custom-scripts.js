document.addEventListener('DOMContentLoaded', function () {
    const filterForm = document.querySelector('form.smart-filter');
    // Renomeei o botão para evitar conflito de nome com a função `submit` do formulário.
    const submitButton = document.getElementById('main-filter-button'); 
    const clearFiltersLink = document.getElementById('clear-all-filters');

    // --- LÓGICA DO BOTÃO PRINCIPAL "APLICAR FILTROS" ---
    if (submitButton) {
        submitButton.addEventListener('click', function (event) {
            // Previne o envio padrão do formulário para podermos adicionar a lógica de preço.
            event.preventDefault();

            const minInput = document.getElementById('price-min');
            const maxInput = document.getElementById('price-max');
            const errorBox = document.getElementById('price-error');
            
            errorBox.classList.add('hidden');
            minInput.classList.remove('input-error');
            maxInput.classList.remove('input-error');
            
            const min = parseFloat(minInput.value);
            const max = parseFloat(maxInput.value);

            if (!isNaN(min) && !isNaN(max) && min >= max) {
                errorBox.textContent = 'O minimo deve ser menor que o maximo.';
                errorBox.classList.remove('hidden');
                minInput.classList.add('input-error');
                maxInput.classList.add('input-error');
                return;
            }
            
            // Pega todos os parâmetros do formulário (checkboxes, etc.)
            const formData = new FormData(filterForm);
            const params = new URLSearchParams(formData);

            // --- LÓGICA DE PREÇO CORRIGIDA ---
            // Deleta qualquer filtro de preço existente para não duplicar.
            params.delete('prices[]');

            if (!isNaN(min) && !isNaN(max)) {
                // Cenário 1: Mínimo e Máximo preenchidos.
                params.set('prices[]', `${min},${max}`);
            } else if (!isNaN(min)) {
                // Cenário 2: Apenas Mínimo preenchido. Usa um valor máximo muito alto.
                params.set('prices[]', `${min},999999`);
            } else if (!isNaN(max)) {
                // Cenário 3: Apenas Máximo preenchido. Usa 0 como mínimo.
                params.set('prices[]', `0,${max}`);
            }
            // Se nenhum campo de preço foi preenchido, ele simplesmente não adiciona o parâmetro `prices[]`.

            // Redireciona para a URL com todos os filtros corretos.
            window.location.href = window.location.pathname + '?' + params.toString();
        });
    }

    // --- LÓGICA DO BOTÃO "LIMPAR FILTROS" ---
    if (clearFiltersLink) {
        clearFiltersLink.addEventListener('click', function (event) {
            event.preventDefault();
            // Redireciona para a URL da página atual, sem NENHUM parâmetro de filtro.
            window.location.href = window.location.pathname;
        });
    }
});


// ESTE CÓDIGO PERMANECE IGUAL.
const limparCategoriasMarcas = setInterval(() => {
    const checkboxes = document.querySelectorAll('.filter-block-categories input[type="checkbox"]');

    if (checkboxes.length > 0) {
        const nomesMarcasExibir = [
            "Amarante", "Amissima", "Anacapri", "Ana do Céu", "Anne Fernandes", "Betelgeuse", "Bfly",
            "Calvin Klein", "Cantão", "Caos", "Carrano", "Charth", "City Class", "Cleo Carvalho",
            "Decencia", "Delight", "Duplo Sentido", "Ellen Baptista", "Esquire", "Fleche Dor", "For Yetts",
            "Frutacor", "Graf", "Hush", "Inocence", "Iodice", "Iorane", "Isla", "Jorge Bischoff", "Lacoste",
            "Liuzzi", "Lina Brand", "Lore", "Loucos e Santos", "Lovit", "Luiza Barcelos", "Mamô", "Maracujá¡",
            "Maria Valentina", "M Nacional", "Mia Brand", "MM Especial", "MN Maxnino", "Modelan", "Morena Rosa",
            "Morena Rosa Beach", "Morena Rosa Living", "Patchoulee", "Plié", "Reserva", "Rosa Dahlia", "Ryzí",
            "Santa Lolla", "Schutz", "Seiki", "Sis Brand", "Skazi", "Skunk", "Strass", "Thamara Capelão",
            "Tommy Hilfiger", "Vicenza", "Victor Dzenk", "Wink", "YTCOM", "Zinco", "MARCAS", "ROUPAS"
        ];

        checkboxes.forEach(el => {
            const labelText = el.nextElementSibling?.querySelector('.filter-name')?.innerText.trim();
            if (nomesMarcasExibir.includes(labelText)) {
                const item = el.closest('.filter-item');
                if (item) item.remove();
            }
        });

        clearInterval(limparCategoriasMarcas);
    }
}, 300);