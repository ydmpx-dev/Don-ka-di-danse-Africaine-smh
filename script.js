document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggle-button');
    const moreText = document.querySelector('.more-text');
    const pdfPreview = document.querySelector('.pdf-preview');
    const pdfFile = document.querySelector('.pdf-file');
    let isTextVisible = false;

    // Fonction pour dérouler le texte
    toggleButton.addEventListener('click', function() {
        isTextVisible = !isTextVisible;
        if (isTextVisible) {
            moreText.style.display = 'block';
            toggleButton.textContent = '▲';
        } else {
            moreText.style.display = 'none';
            toggleButton.textContent = '▼';
        }
    });

    // Fonction pour afficher le PDF quand on clique sur l'aperçu
    pdfPreview.addEventListener('click', function() {
        pdfFile.style.display = pdfFile.style.display === 'block' ? 'none' : 'block';
    });
});

