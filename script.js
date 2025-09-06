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

    // Gestion du carrousel
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    const slideInterval = 5000; // Change d'image toutes les 5 secondes
    let slideTimer;

    // Fonction pour afficher une diapositive spécifique
    function showSlide(n) {
        // Masquer toutes les diapositives
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Gérer le débordement des indices
        if (n >= slides.length) {
            currentSlide = 0;
        } else if (n < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = n;
        }
        
        // Afficher la diapositive actuelle
        slides[currentSlide].classList.add('active');
    }

    // Fonction pour passer à la diapositive suivante
    function nextSlide() {
        showSlide(currentSlide + 1);
        resetTimer();
    }

    // Fonction pour passer à la diapositive précédente
    function prevSlide() {
        showSlide(currentSlide - 1);
        resetTimer();
    }

    // Démarrer le défilement automatique
    function startSlideShow() {
        slideTimer = setInterval(nextSlide, slideInterval);
    }

    // Réinitialiser le minuteur
    function resetTimer() {
        clearInterval(slideTimer);
        startSlideShow();
    }

    // Événements pour les boutons de navigation
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Démarrer le carrousel
    document.addEventListener('DOMContentLoaded', () => {
        // Afficher la première diapositive
        showSlide(0);
        // Démarrer le défilement automatique
        startSlideShow();
        
        // Arrêter le défilement lorsque la souris est sur le carrousel
        const slider = document.querySelector('.slider');
        slider.addEventListener('mouseenter', () => {
            clearInterval(slideTimer);
        });
        
        // Reprendre le défilement lorsque la souris quitte le carrousel
        slider.addEventListener('mouseleave', startSlideShow);
    });

    // Gestion du défilement tactile pour mobile
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        if (touchEndX < touchStartX) {
            // Balayage vers la gauche - prochaine diapositive
            nextSlide();
        }
        if (touchEndX > touchStartX) {
            // Balayage vers la droite - diapositive précédente
            prevSlide();
        }
    }

    // Code existant pour la section "À propos"
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            moreText.style.display = moreText.style.display === 'block' ? 'none' : 'block';
            toggleButton.textContent = moreText.style.display === 'block' ? '▲' : '▼';
        });
    }

    if (pdfPreview) {
        pdfPreview.addEventListener('click', () => {
            pdfFile.style.display = pdfFile.style.display === 'block' ? 'none' : 'block';
            if (pdfFile.style.display === 'block') {
                pdfFile.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Code existant pour la lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const closeBtn = document.querySelector('.close');
    const prevBtnLightbox = document.querySelector('.prev');
    const nextBtnLightbox = document.querySelector('.next');
    const galleryImages = document.querySelectorAll('.photo-item img');
    let currentImageIndex = 0;

    if (galleryImages.length > 0) {
        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentImageIndex = index;
                updateLightboxImage();
                lightbox.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    if (prevBtnLightbox) {
        prevBtnLightbox.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            updateLightboxImage();
        });
    }

    if (nextBtnLightbox) {
        nextBtnLightbox.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            updateLightboxImage();
        });
    }

    function updateLightboxImage() {
        if (galleryImages.length > 0) {
            lightboxImg.src = galleryImages[currentImageIndex].src;
        }
    }

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'block') {
            if (e.key === 'Escape') {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            } else if (e.key === 'ArrowLeft') {
                currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
                updateLightboxImage();
            } else if (e.key === 'ArrowRight') {
                currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
                updateLightboxImage();
            }
        }
    });
});
