// Portfolio JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Sticky header functionality
    const stickyHeader = document.getElementById('stickyHeader');
    
    // Function to handle scroll events
    function handleScroll() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        
        // Show header when scrolled past 100px
        if (scrollPosition > 100) {
            stickyHeader.classList.add('visible');
        } else {
            stickyHeader.classList.remove('visible');
        }
    }
    
    // Multiple scroll event listeners for better Windows compatibility
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    
    // Throttle scroll events for better performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16); // ~60fps
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('wheel', requestTick, { passive: true });
    
    // Additional Windows-specific scroll detection
    document.addEventListener('mousewheel', requestTick, { passive: true }); // IE/Edge
    document.addEventListener('DOMMouseScroll', requestTick, { passive: true }); // Firefox

    // Smooth scrolling for internal links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections for animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Card hover effects
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Slideshow functionality for images and videos
    function initSlideshow(container, index) {
        const slides = container.querySelectorAll('.slides > *');
        const prevBtn = container.querySelector('.prev');
        const nextBtn = container.querySelector('.next');
        const counter = container.parentElement.querySelector('.slide-counter');
        let currentSlide = 0;
        let autoAdvanceInterval;
        let isVideoPaused = false;

        if (slides.length === 0) return;

        // Hide all slides initially
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.display = 'none';
        });

        // Show first slide
        slides[0].classList.add('active');
        slides[0].style.display = 'block';

        // Update counter
        function updateCounter() {
            if (counter) {
                counter.textContent = `${currentSlide + 1} / ${slides.length}`;
            }
        }

        function showSlide(slideIndex) {
            slides.forEach((slide, idx) => {
                slide.classList.remove('active');
                slide.style.display = 'none';
                
                // Pause videos when not active
                if (slide.tagName === 'VIDEO') {
                    slide.pause();
                    slide.currentTime = 0;
                }
            });
            
            slides[slideIndex].classList.add('active');
            slides[slideIndex].style.display = 'block';
            updateCounter();
            
            // Handle video events for the current slide
            if (slides[slideIndex].tagName === 'VIDEO') {
                const video = slides[slideIndex];
                
                // Add event listeners for video control
                video.addEventListener('play', () => {
                    isVideoPaused = true;
                    clearInterval(autoAdvanceInterval);
                });
                
                video.addEventListener('pause', () => {
                    if (!video.ended) {
                        isVideoPaused = true;
                        clearInterval(autoAdvanceInterval);
                    }
                });
                
                video.addEventListener('ended', () => {
                    isVideoPaused = false;
                    startAutoAdvance();
                    // Auto advance to next slide when video ends
                    setTimeout(() => {
                        if (!isVideoPaused) {
                            currentSlide = (currentSlide + 1) % slides.length;
                            showSlide(currentSlide);
                        }
                    }, 1000);
                });
            } else {
                // For images, ensure auto-advance is running
                isVideoPaused = false;
                startAutoAdvance();
            }
        }

        function startAutoAdvance() {
            clearInterval(autoAdvanceInterval);
            if (!isVideoPaused) {
                autoAdvanceInterval = setInterval(() => {
                    if (!isVideoPaused) {
                        currentSlide = (currentSlide + 1) % slides.length;
                        showSlide(currentSlide);
                    }
                }, 5000);
            }
        }

        // Initialize counter
        updateCounter();

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                isVideoPaused = false;
                clearInterval(autoAdvanceInterval);
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(currentSlide);
                console.log(`Slideshow ${index}: Previous clicked, now showing slide ${currentSlide + 1}`);
            });

            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                isVideoPaused = false;
                clearInterval(autoAdvanceInterval);
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
                console.log(`Slideshow ${index}: Next clicked, now showing slide ${currentSlide + 1}`);
            });
        }

        // Start auto advance for the initial slide
        if (slides[0] && slides[0].tagName === 'IMG') {
            startAutoAdvance();
        }
        
        // Handle initial slide if it's a video
        if (slides[0] && slides[0].tagName === 'VIDEO') {
            const video = slides[0];
            video.addEventListener('play', () => {
                isVideoPaused = true;
                clearInterval(autoAdvanceInterval);
            });
            
            video.addEventListener('pause', () => {
                if (!video.ended) {
                    isVideoPaused = true;
                    clearInterval(autoAdvanceInterval);
                }
            });
            
            video.addEventListener('ended', () => {
                isVideoPaused = false;
                startAutoAdvance();
                setTimeout(() => {
                    if (!isVideoPaused) {
                        currentSlide = (currentSlide + 1) % slides.length;
                        showSlide(currentSlide);
                    }
                }, 1000);
            });
        }
    }

    // Initialize all slideshows with unique identifiers
    const slideshowContainers = document.querySelectorAll('.slideshow-container, .video-slideshow-container');
    slideshowContainers.forEach((container, index) => {
        initSlideshow(container, index);
        console.log(`Initialized slideshow ${index} with ${container.querySelectorAll('.slides > *').length} slides`);
    });
});
