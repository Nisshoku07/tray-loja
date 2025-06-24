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

            // Validação: nenhum campo preenchido
            if (isNaN(min) && isNaN(max)) {
                errorBox.classList.remove('hidden');
                errorBox.textContent = 'Informe pelo menos um valor para filtrar.';
                return;
            }

            // Validação: mínimo >= máximo
            if (!isNaN(min) && !isNaN(max) && min >= max) {
                errorBox.classList.remove('hidden');
                errorBox.textContent = 'O mínimo deve ser menor que o máximo.';
                minInput.classList.add('input-error');
                maxInput.classList.add('input-error');
                return;
            }

            // --- INÍCIO DA MUDANÇA RECOMENDADA ---

            // Crie um objeto URL com base na URL ATUAL da página
            // Isso garante que todos os parâmetros existentes sejam preservados
            let url = new URL(window.location.href);

            // Remove o parâmetro de preço existente para substituí-lo
            url.searchParams.delete('prices[]');

            // Adiciona os novos valores de preço
            if (!isNaN(min) && !isNaN(max)) {
                url.searchParams.append('prices[]', `${min},${max}`);
            } else if (!isNaN(min)) {
                url.searchParams.append('prices[]', `${min},999999`);
            } else if (!isNaN(max)) {
                url.searchParams.append('prices[]', `0,${max}`);
            }

            // --- FIM DA MUDANÇA RECOMENDADA ---

            // Redireciona com os parâmetros finais (que agora incluem os antigos e os novos de preço)
            window.location.href = url.toString();
        });
    }
});