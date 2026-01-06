// Presentation Navigation Logic - IEU

let currentSlide = 1;
const totalSlides = 15;

// DOM Elements
const slidesWrapper = document.getElementById('slidesWrapper');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const slideCounter = document.getElementById('slideCounter');
const progressFill = document.getElementById('progressFill');

// Initialize
function init() {
    updateSlide();
    updateCounter();
    updateProgress();
}

// Navigate to specific slide
function goToSlide(slideNumber) {
    if (slideNumber < 1 || slideNumber > totalSlides) return;

    const currentSlideEl = document.querySelector('.slide.active');
    const nextSlideEl = slides[slideNumber - 1];

    if (currentSlideEl) {
        currentSlideEl.classList.add('exiting');
        setTimeout(() => {
            currentSlideEl.classList.remove('active', 'exiting');
        }, 500);
    }

    nextSlideEl.classList.add('active');
    currentSlide = slideNumber;

    updateCounter();
    updateProgress();
}

// Next slide
function nextSlide() {
    if (currentSlide < totalSlides) {
        goToSlide(currentSlide + 1);
    }
}

// Previous slide
function prevSlide() {
    if (currentSlide > 1) {
        goToSlide(currentSlide - 1);
    }
}

// Update counter
function updateCounter() {
    slideCounter.textContent = `${currentSlide} / ${totalSlides}`;
}

// Update progress bar
function updateProgress() {
    const progress = (currentSlide / totalSlides) * 100;
    progressFill.style.width = `${progress}%`;
}

// Update slide visibility
function updateSlide() {
    slides.forEach((slide, index) => {
        if (index + 1 === currentSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
}

// Event Listeners
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
    } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(1);
    } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(totalSlides);
    }
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

slidesWrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

slidesWrapper.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide(); // Swipe left
        } else {
            prevSlide(); // Swipe right
        }
    }
}

// Poll selection function
function selectPoll(button) {
    const allPollBtns = document.querySelectorAll('.poll-btn');
    allPollBtns.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');

    // Optional: Add confetti or celebration animation
    setTimeout(() => {
        button.style.animation = 'none';
        setTimeout(() => {
            button.style.animation = '';
        }, 10);
    }, 100);
}

// Initialize on load
init();

// Console message for presenter
console.log(`
%c🎓 Presentación IEU 🎓
%cControles:
→ o Espacio = Siguiente slide
← = Slide anterior
Home = Primer slide
End = Último slide

¡Buena presentación!
`,
    'font-size: 24px; font-weight: bold; color: #FF6B35;',
    'font-size: 14px; color: #1D1D1D;'
);
