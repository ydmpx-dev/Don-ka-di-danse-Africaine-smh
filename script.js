document.addEventListener('DOMContentLoaded', function() {

    // Gestion générique d'un carrousel (utilisé pour le hero et les affiches)
    function initCarousel(root, options = {}) {
        if (!root) return;

        const {
            slideSelector = '.slide',
            prevSelector = '.prev-btn',
            nextSelector = '.next-btn',
            dotsContainerSelector = '.slider-dots',
            interval = 3000,
        } = options;

        const slides = root.querySelectorAll(slideSelector);
        const prevBtn = root.querySelector(prevSelector);
        const nextBtn = root.querySelector(nextSelector);
        const dotsContainer = root.querySelector(dotsContainerSelector);

        if (!slides.length || !dotsContainer) return;

        // Générer les indicateurs dynamiquement (s'adapte si des diapositives sont ajoutées/retirées)
        dotsContainer.innerHTML = '';
        const dots = Array.from(slides).map((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'dot';
            dot.dataset.slide = index;
            dotsContainer.appendChild(dot);
            return dot;
        });

        let currentSlide = 0;
        let slideTimer;

        function showSlide(n) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            currentSlide = (n + slides.length) % slides.length;

            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            showSlide(currentSlide + 1);
            resetTimer();
        }

        function prevSlide() {
            showSlide(currentSlide - 1);
            resetTimer();
        }

        function startSlideShow() {
            slideTimer = setInterval(() => showSlide(currentSlide + 1), interval);
        }

        function resetTimer() {
            clearInterval(slideTimer);
            startSlideShow();
        }

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                resetTimer();
            });
        });

        // Défilement tactile pour mobile
        let touchStartX = 0;
        let touchEndX = 0;

        root.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        root.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeThreshold = 30;
            if (touchStartX - touchEndX > swipeThreshold) nextSlide();
            else if (touchEndX - touchStartX > swipeThreshold) prevSlide();
        }, { passive: true });

        showSlide(0);
        startSlideShow();
    }

    // Carrousel principal (header)
    initCarousel(document.querySelector('.slider'), {
        interval: 3000,
    });

    // Petit carrousel des affiches
    initCarousel(document.querySelector('.affiche-carousel'), {
        slideSelector: '.affiche-slide',
        prevSelector: '.affiche-prev',
        nextSelector: '.affiche-next',
        dotsContainerSelector: '.affiche-dots',
        interval: 5000,
    });

    // Gestion de la lightbox (galerie photos + affiches), groupée par conteneur
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxCaption = document.querySelector('.lightbox-caption');

    let currentGalleryImages = [];
    let currentImageIndex = 0;

    function getCaption(el) {
        const overlaySpan = el.querySelector('.gallery-info span');
        return el.dataset.caption || (overlaySpan ? overlaySpan.textContent : '');
    }

    // Ouvrir la lightbox au clic sur une image, en ne naviguant qu'au sein de son groupe
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.lightbox-trigger');
        if (!trigger) return;

        const group = trigger.closest('[data-lightbox-group]') || document;
        const items = Array.from(group.querySelectorAll('.lightbox-trigger'));

        currentGalleryImages = items.map(item => ({
            src: item.dataset.src,
            caption: getCaption(item),
        }));
        currentImageIndex = items.indexOf(trigger);

        openLightbox();
    });

    function openLightbox() {
        lightboxImage.src = currentGalleryImages[currentImageIndex].src;
        lightboxCaption.textContent = currentGalleryImages[currentImageIndex].caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
        updateLightboxImage();
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
        updateLightboxImage();
    }

    function updateLightboxImage() {
        lightboxImage.src = currentGalleryImages[currentImageIndex].src;
        lightboxCaption.textContent = currentGalleryImages[currentImageIndex].caption;
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
