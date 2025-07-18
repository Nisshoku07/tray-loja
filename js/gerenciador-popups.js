// ==========================================================
// GERENCIADOR CENTRAL DE POP-UPS - V5 - GATILHO DE SAÍDA CORRIGIDO
// ==========================================================

// Usamos 'load' para garantir que este script seja o último a rodar, evitando conflitos.
window.addEventListener('load', function() {

    // --- VARIÁVEIS E ELEMENTOS ---
    const popupEntrada = document.getElementById('popup-entrada');
    const popupSaida = document.getElementById('popup-saida');
    const hoje = new Date().toISOString().slice(0, 10); // Formato YYYY-MM-DD
    let isAPopupOpen = false;

    // --- LÓGICA DO POP-UP DE ENTRADA ---
    if (popupEntrada) {
        const chaveEntrada = 'popup_entrada_exibido_v1';
        const valorSalvo = localStorage.getItem(chaveEntrada);

        // Se não foi visto hoje, mostra e já salva.
        if (valorSalvo !== hoje) {
            popupEntrada.style.display = 'flex';
            isAPopupOpen = true;
            localStorage.setItem(chaveEntrada, hoje);
        }
        
        // Lógica do botão de fechar
        const btnFecharEntrada = popupEntrada.querySelector('.close-btn');
        if (btnFecharEntrada) {
            btnFecharEntrada.addEventListener('click', function() {
                popupEntrada.style.display = 'none';
                isAPopupOpen = false;
            });
        }
    }

    // --- LÓGICA DO POP-UP DE SAÍDA (COM GATILHO NOVO) ---
    if (popupSaida) {
        const chaveSaida = 'popup_saida_exibido_v1';

        const mostrarPopupSaida = () => {
            if (isAPopupOpen) return; // Não mostra se outro pop-up já está aberto

            const valorSalvo = localStorage.getItem(chaveSaida);
            if (valorSalvo !== hoje) {
                popupSaida.style.display = 'flex';
                isAPopupOpen = true;
                localStorage.setItem(chaveSaida, hoje);
            }
        };

        // Gatilho de saída para Desktop - inteligente e sem conflitos
        document.addEventListener('mouseout', function(e) {
            // Dispara apenas se o cursor estiver saindo pela parte de CIMA da tela
            if (e.clientY <= 0) {
                mostrarPopupSaida();
            }
        });

        // Gatilho de saída para Mobile
        let lastScrollY = window.scrollY;
        document.addEventListener('scroll', () => {
            if (window.scrollY < lastScrollY && window.scrollY < 100) {
                mostrarPopupSaida();
            }
            lastScrollY = window.scrollY;
        });
        
        // Lógica dos botões de fechar
        const btnFecharSaida = popupSaida.querySelector('.close-btn');
        if (btnFecharSaida) {
            btnFecharSaida.addEventListener('click', () => {
                popupSaida.style.display = 'none';
                isAPopupOpen = false;
            });
        }
        const linkSaida = popupSaida.querySelector('a');
        if (linkSaida) {
            linkSaida.addEventListener('click', () => {
                popupSaida.style.display = 'none';
                isAPopupOpen = false;
            });
        }
    }

});