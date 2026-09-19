document.addEventListener('DOMContentLoaded', function() {
    // Gestion du carrousel
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const slideInterval = 3000; // Change d'image toutes les 3 secondes
    let slideTimer;

    // Fonction pour afficher une diapositive spécifique
    function showSlide(n) {
        // Masquer toutes les diapositives
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Masquer tous les indicateurs
        dots.forEach(dot => {
            dot.classList.remove('active');
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
        // Activer l'indicateur correspondant
        dots[currentSlide].classList.add('active');
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

    // Événements pour les indicateurs cliquables
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetTimer();
        });
    });

    // Afficher la première diapositive
    showSlide(0);
    // Démarrer le défilement automatique
    startSlideShow();

    // Gestion du défilement tactile pour mobile
    let touchStartX = 0;
    let touchEndX = 0;

    const slider = document.querySelector('.slider');
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

    // Gestion de la lightbox pour la galerie
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    
    let currentImageIndex = 0;
    const galleryImages = Array.from(galleryItems).map(item => ({
        src: item.dataset.src,
        caption: item.querySelector('span').textContent
    }));

    // Ouvrir la lightbox au clic sur une image
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImageIndex = index;
            openLightbox();
        });
    });

    function openLightbox() {
        lightboxImage.src = galleryImages[currentImageIndex].src;
        lightboxCaption.textContent = galleryImages[currentImageIndex].caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightboxImage();
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    }

    function updateLightboxImage() {
        lightboxImage.src = galleryImages[currentImageIndex].src;
        lightboxCaption.textContent = galleryImages[currentImageIndex].caption;
    }

    // Événements pour la lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNextImage);
    lightboxPrev.addEventListener('click', showPrevImage);

    // Fermer la lightbox en cliquant sur le fond
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        }
    });

    // Navigation tactile pour la lightbox
    let touchStartXLightbox = 0;
    let touchEndXLightbox = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartXLightbox = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndXLightbox = e.changedTouches[0].screenX;
        handleLightboxSwipe();
    }, { passive: true });

    function handleLightboxSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartXLightbox - touchEndXLightbox;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe vers la gauche - image suivante
                showNextImage();
            } else {
                // Swipe vers la droite - image précédente
                showPrevImage();
            }
        }
    }

});
