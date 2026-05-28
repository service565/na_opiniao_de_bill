const buttonContainer = document.getElementById('button-container');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('close-btn');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

Object.keys(indexData).forEach(keyword => {
  const btn = document.createElement('button');
  btn.classList.add('keyword-btn');
  btn.textContent = keyword;
  btn.addEventListener('click', () => openModal(keyword));
  buttonContainer.appendChild(btn);
});

function openModal(keyword) {
  modalTitle.textContent = keyword;
  modalBody.innerHTML = ''; 

  const pageNumbers = indexData[keyword];
  let contentHtml = '';

  pageNumbers.forEach(pageNum => {
    const pageStr = pageNum.toString();
    if (pagesData[pageStr]) {
      contentHtml += `
        <div class='page-content'>
          <h3>Texto ${pageStr} - ${pagesData[pageStr].title}</h3>
          <p>${pagesData[pageStr].content}</p>
        </div>
        <hr>
      `;
    } else {
      contentHtml += `
        <div class='page-content'>
          <h3>Texto ${pageStr}</h3>
          <p><em>[Conteúdo não encontrado]</em></p>
        </div>
        <hr>
      `;
    }
  });

  modalBody.innerHTML = contentHtml;
  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
}

closeBtn.addEventListener('click', closeModal);

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});