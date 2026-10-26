const slides = [...document.querySelectorAll('.slide')];
const prevButton = document.querySelector('#prevButton');
const nextButton = document.querySelector('#nextButton');
const currentNumber = document.querySelector('#currentNumber');
const totalNumber = document.querySelector('#totalNumber');
const progressBar = document.querySelector('#progressBar');
const dotsContainer = document.querySelector('#dots');

let currentSlide = 0;
let touchStartX = 0;

totalNumber.textContent = String(slides.length).padStart(2, '0');

slides.forEach((slide, index) => {
  const dot = document.createElement('button');
  dot.className = 'dot';
  dot.type = 'button';
  dot.setAttribute('aria-label', `Ir a la diapositiva ${index + 1}`);
  dot.addEventListener('click', () => showSlide(index));
  dotsContainer.appendChild(dot);
});

const dots = [...document.querySelectorAll('.dot')];

function showSlide(index) {
  const boundedIndex = Math.max(0, Math.min(index, slides.length - 1));
  currentSlide = boundedIndex;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle('active', slideIndex === currentSlide);
    slide.classList.toggle('before', slideIndex < currentSlide);
    slide.setAttribute('aria-hidden', slideIndex === currentSlide ? 'false' : 'true');
  });

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle('active', dotIndex === currentSlide);
    dot.setAttribute('aria-current', dotIndex === currentSlide ? 'step' : 'false');
  });

  currentNumber.textContent = String(currentSlide + 1).padStart(2, '0');
  progressBar.style.width = `${((currentSlide + 1) / slides.length) * 100}%`;
  prevButton.disabled = currentSlide === 0;
  nextButton.innerHTML = currentSlide === slides.length - 1 ? 'Volver al inicio&nbsp; ↺' : 'Siguiente&nbsp; →';

  slides[currentSlide].classList.remove('flash');
  requestAnimationFrame(() => slides[currentSlide].classList.add('flash'));
}

function goNext() {
  showSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
}

function goPrevious() {
  showSlide(currentSlide - 1);
}

prevButton.addEventListener('click', goPrevious);
nextButton.addEventListener('click', goNext);

document.querySelectorAll('[data-target]').forEach((button) => {
  button.addEventListener('click', () => showSlide(Number(button.dataset.target)));
});

document.querySelectorAll('.fact-card').forEach((card) => {
  card.addEventListener('click', () => card.classList.toggle('expanded'));
});

document.addEventListener('keydown', (event) => {
  if (['ArrowRight', 'PageDown', ' '].includes(event.key)) {
    event.preventDefault();
    goNext();
  }
  if (['ArrowLeft', 'PageUp'].includes(event.key)) {
    event.preventDefault();
    goPrevious();
  }
  if (event.key === 'Home') showSlide(0);
  if (event.key === 'End') showSlide(slides.length - 1);
});

document.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(distance) < 55) return;
  distance < 0 ? goNext() : goPrevious();
}, { passive: true });

showSlide(0);
