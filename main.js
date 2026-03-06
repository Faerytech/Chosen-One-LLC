/* ================================================================
   CHOSENONE LLC CLEANING SERVICES — main.js
   Built by Faery Tech (faerytech.net)

   What this file does:
   1. Scroll spy — highlights active nav link based on scroll position
   2. Navbar shadow strengthens when user scrolls down
   3. Fade-in animation on cards as they enter the viewport
   4. Form submission state (shows "Sending..." on submit button)
================================================================ */


/* ================================================================
   1. SCROLL SPY
   Watches which section is in view and highlights the matching
   nav link by adding the Bootstrap .active class.
================================================================ */

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.site-nav .nav-link[href^="#"]');

  let currentId = '';

  sections.forEach(function(section) {
    /* 100px offset fires the highlight slightly before the section top */
    if (window.scrollY >= section.offsetTop - 100) {
      currentId = section.getAttribute('id');
    }
  });

  navLinks.forEach(function(link) {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + currentId) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNavLink);
updateActiveNavLink();


/* ================================================================
   2. NAVBAR SCROLL EFFECT
   Adds .nav-scrolled when user scrolls past 60px.
   Deepens the shadow for visual depth.
================================================================ */

const siteNav = document.querySelector('.site-nav');

/* Inject the scrolled style — keeps it self-contained */
const navScrollStyle = document.createElement('style');
navScrollStyle.textContent = `
  .site-nav {
    transition: box-shadow 0.3s ease, padding 0.3s ease;
  }
  .nav-scrolled {
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.45) !important;
    padding-top: 0.4rem !important;
    padding-bottom: 0.4rem !important;
  }
`;
document.head.appendChild(navScrollStyle);

window.addEventListener('scroll', function() {
  if (window.scrollY > 60) {
    siteNav.classList.add('nav-scrolled');
  } else {
    siteNav.classList.remove('nav-scrolled');
  }
});


/* ================================================================
   3. FADE-IN ON SCROLL
   Service cards, pricing cards, and contact cards animate
   in when they scroll into view using IntersectionObserver.
================================================================ */

/* Base invisible styles — only applied when JS is running */
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
  .fade-on-scroll {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.55s ease, transform 0.55s ease;
  }
  .fade-on-scroll.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(fadeStyle);

/* Elements to animate */
const animatedEls = document.querySelectorAll(
  '.service-card, .pricing-card, .contact-card, .addon-item, .notices-box'
);

animatedEls.forEach(function(el) {
  el.classList.add('fade-on-scroll');
});

/* Observer — triggers when 12% of the element is visible */
const observer = new IntersectionObserver(
  function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); /* Stop watching once animated */
      }
    });
  },
  { threshold: 0.12 }
);

animatedEls.forEach(function(el) {
  observer.observe(el);
});


/* ================================================================
   4. BOOKING FORM — SUBMIT STATE
   Disables the button and shows "Sending..." while submitting.
   Warns in console if form action hasn't been set yet.
================================================================ */

const bookingForm = document.querySelector('.booking-form form');

if (bookingForm) {
  bookingForm.addEventListener('submit', function() {
    const action = bookingForm.getAttribute('action');

    /* Warn in dev if endpoint hasn't been updated */
    if (!action || action === 'REPLACE_WITH_ENDPOINT') {
      console.warn('Faery Tech: Form action not set. Update action= in index.html before going live.');
      return;
    }

    /* Show loading state on submit button */
    const submitBtn = bookingForm.querySelector('.btn-book-submit');
    if (submitBtn) {
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
    }
  });
}