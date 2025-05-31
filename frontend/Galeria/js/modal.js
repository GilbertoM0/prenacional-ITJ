function openModal(image) {
    let modal = document.getElementById("modal");
    let modalImg = document.getElementById("modalImg");
    
    modal.style.display = "flex";
    modalImg.src = image.src;
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}