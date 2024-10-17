import {
  modal,
  overlay,
  btnCloseModal,
  btnsOpenModal,
  btnConfirm,
} from './handleElements';

export function modalHandle() {
  const openModal = function () {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };
  const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };

  for (let i = 0; i < btnsOpenModal.length; i++)
    btnsOpenModal[i].addEventListener('click', openModal);

  if (modal) {
    btnCloseModal.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    btnConfirm.addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}
