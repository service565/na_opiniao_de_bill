// Limpa o nome da chave com erro gerada pelo extrator
const chaveComErro = Object.keys(indexData).find(key => key.includes("GUIA PARA DISCUSSÃO E LEITURA"));
if (chaveComErro) {
  const novaChave = chaveComErro.replace(/GUIA PARA DISCUSSÃO E LEITURA\s*[A-Z]?\s*/i, "").trim() || "Aceitação";
  indexData[novaChave] = indexData[chaveComErro];
  delete indexData[chaveComErro];
}

const buttonContainer = document.getElementById('button-container');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('close-btn');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const searchBar = document.getElementById('search-bar');

function renderButtons(filter = "") {
  buttonContainer.innerHTML = '';
  const keywords = Object.keys(indexData).sort((a, b) => a.localeCompare(b));
  
  keywords.forEach(keyword => {
    if (keyword.toLowerCase().includes(filter.toLowerCase())) {
      const btn = document.createElement('button');
      btn.classList.add('keyword-btn');
      btn.textContent = keyword;
      btn.addEventListener('click', () => openModal(keyword));
      buttonContainer.appendChild(btn);
    }
  });
}

renderButtons();

searchBar.addEventListener('input', (e) => {
  renderButtons(e.target.value);
});

function openModal(keyword) {
  modalTitle.textContent = keyword;
  modalBody.innerHTML = ''; 

  const pageNumbers = indexData[keyword];
  
  pageNumbers.forEach(pageNum => {
    const pageStr = pageNum.toString();
    const blockDiv = document.createElement('div');
    blockDiv.classList.add('page-content');
    
    if (pagesData[pageStr]) {
      const titleText = `Texto ${pageStr} - ${pagesData[pageStr].title}`;
      let contentText = pagesData[pageStr].content;
      
      // Limpa a URL e os rodapés com datas e paginação do SlidePDF
      contentText = contentText.replace(/\d*\s*http:\/\/slidepdf\.com[^\s]*/gi, '');
      contentText = contentText.replace(/\d+\/\d+\s+\d{1,2}\/\d{1,2}\/\d{4}\s+Na Opiniao Do Bill\s*-\s*slidepdf\.com/gi, '');
      
      // Transforma os asteriscos em parágrafos visuais
      contentText = contentText.replace(/\*\s*\*\s*\*/g, '<br><br>');

      blockDiv.innerHTML = `
        <h3>${titleText}</h3>
        <p>${contentText}</p>
        <div class="actions-container">
          <button class="listen-btn" onclick="lerTexto('${pageStr}')">Ouvir Texto 🔊</button>
          <button class="share-btn" onclick="compartilharWhatsApp('${pageStr}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/>
            </svg>
            Compartilhar
          </button>
        </div>
      `;
    } else {
      blockDiv.innerHTML = `
        <h3>Texto ${pageStr}</h3>
        <p><em>[Conteúdo não encontrado]</em></p>
      `;
    }
    
    modalBody.appendChild(blockDiv);
    modalBody.appendChild(document.createElement('hr'));
  });

  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
  window.speechSynthesis.cancel();
}

closeBtn.addEventListener('click', closeModal);

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

window.lerTexto = function(pageStr) {
  window.speechSynthesis.cancel(); 
  if (!pagesData[pageStr]) return;
  
  const titleText = `Texto ${pageStr} - ${pagesData[pageStr].title}`;
  let contentText = pagesData[pageStr].content.replace(/<br\s*\/?>/gi, " ");
  
  const ut = new SpeechSynthesisUtterance(titleText + ". " + contentText);
  ut.lang = 'pt-BR';
  ut.rate = 1.0; 
  window.speechSynthesis.speak(ut);
};

window.compartilharWhatsApp = function(pageStr) {
  if (!pagesData[pageStr]) return;

  const titleText = `Texto ${pageStr} - ${pagesData[pageStr].title}`;
  let contentText = pagesData[pageStr].content;

  // Limpezas de segurança adicionais para o envio de texto bruto
  contentText = contentText.replace(/\d*\s*http:\/\/slidepdf\.com[^\s]*/gi, '');
  contentText = contentText.replace(/\d+\/\d+\s+\d{1,2}\/\d{1,2}\/\d{4}\s+Na Opiniao Do Bill\s*-\s*slidepdf\.com/gi, '');
  
  // Converte quebras de HTML em quebras de linha normais para o WhatsApp
  let textoFormatado = contentText.replace(/<br\s*\/?>/gi, "\n");
  textoFormatado = textoFormatado.replace(/\*\s*\*\s*\*/g, "\n\n");

  const mensagemCompleta = `*${titleText}*\n\n${textoFormatado}`;
  const urlWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensagemCompleta)}`;
  
  window.open(urlWhatsApp, '_blank');
};
