document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('apply-price-filter');
    const errorBox = document.getElementById('price-error');

    if (btn) {
        btn.addEventListener('click', function () {
            const minInput = document.getElementById('price-min');
            const maxInput = document.getElementById('price-max');

            const min = parseInt(minInput.value, 10);
            const max = parseInt(maxInput.value, 10);

            // Resetar mensagens e estilos de erro
            errorBox.classList.add('hidden');
            minInput.classList.remove('input-error');
            maxInput.classList.remove('input-error');

            // ValidaÃ§Ã£o: nenhum campo preenchido
            if (isNaN(min) && isNaN(max)) {
                errorBox.classList.remove('hidden');
                errorBox.textContent = 'Informe pelo menos um valor para filtrar.';
                return;
            }

            // ValidaÃ§Ã£o: mínimo >= máximo
            if (!isNaN(min) && !isNaN(max) && min >= max) {
                errorBox.classList.remove('hidden');
                errorBox.textContent = 'O mínimo deve ser menor que o máximo.';
                minInput.classList.add('input-error');
                maxInput.classList.add('input-error');
                return;
            }

            // Redireciona sempre para a busca
            let url = new URL('/loja/busca.php', window.location.origin);

            // Preserva a categoria atual (se existir)
            const categoriaInput = document.querySelector('input[name="categoria"]');
            if (categoriaInput && categoriaInput.value) {
                url.searchParams.append('categoria', categoriaInput.value);
            }

            // Aplica o filtro de preÃ§o
            url.searchParams.delete('prices[]');

            if (!isNaN(min) && !isNaN(max)) {
                url.searchParams.append('prices[]', `${min},${max}`);
            } else if (!isNaN(min)) {
                url.searchParams.append('prices[]', `${min},999999`);
            } else if (!isNaN(max)) {
                url.searchParams.append('prices[]', `0,${max}`);
            }

            // Redireciona com os parametros finais
            window.location.href = url.toString();
        });
    }
});