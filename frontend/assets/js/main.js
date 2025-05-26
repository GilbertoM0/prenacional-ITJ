const openModal =document.querySelector('.abrirModal');
const modal =document.querySelector('.modal');
const modalClose = document.querySelector('.modalClose');

openModal.addEventListener('click',(e)=>{
    e.preventDefault();
    modal.classList.add('modalShow');
});

modalClose.addEventListener('click',(e)=>{
    e.preventDefault();
    modal.classList.remove('modalShow');
});