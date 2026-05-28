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
      
      // Limpa os resíduos de formatação do PDF
      contentText = contentText.replace(/\d*\s*http:\/\/slidepdf\.com.*?slidepdf\.com/gi, '');
      contentText = contentText.replace(/\*\s*\*\s*\*/g, '<br><br>');
      
      const textForTTS = (titleText + ". " + contentText).replace(/<br>/g, " ").replace(/"/g, "").replace(/'/g, "");

      blockDiv.innerHTML = `
        <h3>${titleText}</h3>
        <p>${contentText}</p>
        <button class="listen-btn" onclick="lerTexto('${textForTTS}')">Ouvir Texto 🔊</button>
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

window.lerTexto = function(texto) {
  window.speechSynthesis.cancel(); 
  const ut = new SpeechSynthesisUtterance(texto);
  ut.lang = 'pt-BR';
  ut.rate = 1.0; 
  window.speechSynthesis.speak(ut);
};
