const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-nav');
const header = document.querySelector('.site-header');
const year = document.querySelector('#year');

if (year) year.textContent = new Date().getFullYear();

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    nav.classList.toggle('is-open', !isOpen);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
      nav.classList.remove('is-open');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
      nav.classList.remove('is-open');
      menuToggle.focus();
    }
  });
}

const updateHeader = () => {
  if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
};
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const testimonialCarousel = document.querySelector('[data-testimonial-carousel]');
if (testimonialCarousel) {
  const viewport = testimonialCarousel.querySelector('.testimonial-viewport');
  const slides = Array.from(testimonialCarousel.querySelectorAll('.testimonial-slide'));
  const dots = Array.from(testimonialCarousel.querySelectorAll('[data-testimonial-dot]'));
  const counter = testimonialCarousel.querySelector('.testimonial-count');
  const previous = testimonialCarousel.querySelector('[data-testimonial-prev]');
  const next = testimonialCarousel.querySelector('[data-testimonial-next]');
  let currentIndex = 0;

  const updateControls = () => {
    currentIndex = Math.max(0, Math.min(slides.length - 1, Math.round(viewport.scrollLeft / viewport.clientWidth)));
    dots.forEach((dot, index) => {
      const isActive = index === currentIndex;
      dot.classList.toggle('is-active', isActive);
      if (isActive) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    if (counter) {
      const current = String(currentIndex + 1).padStart(2, '0');
      const total = String(slides.length).padStart(2, '0');
      counter.textContent = `${current} / ${total}`;
    }
  };

  const goTo = (index) => {
    currentIndex = (index + slides.length) % slides.length;
    viewport.scrollTo({ left: currentIndex * viewport.clientWidth, behavior: 'smooth' });
    updateControls();
  };

  previous?.addEventListener('click', () => goTo(currentIndex - 1));
  next?.addEventListener('click', () => goTo(currentIndex + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => goTo(index)));
  viewport.addEventListener('scroll', updateControls, { passive: true });
  viewport.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(currentIndex - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(currentIndex + 1);
    }
  });
  window.addEventListener('resize', updateControls, { passive: true });
  updateControls();
}
