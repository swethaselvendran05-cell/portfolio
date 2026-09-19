/**
 * ==========================================================================
 * SWETHA SELVENDRAN - PORTFOLIO SCRIPT
 * Interactive functionality: Typewriter, Theme Toggle, ScrollSpy,
 * Scroll Reveal, Mobile Navigation, Modal Dialogs & Form Handling.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ------------------------------------------------------------------------
  // 1. THEME TOGGLE (DARK / LIGHT MODE)
  // ------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');

  // Check saved user preference or system default
  const savedTheme = localStorage.getItem('swetha-portfolio-theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('swetha-portfolio-theme', theme);

    if (theme === 'light') {
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
      if (themeToggleBtn) themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
    } else {
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
      if (themeToggleBtn) themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  // ------------------------------------------------------------------------
  // 2. MOBILE NAVIGATION MENU
  // ------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking outside or clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          mobileToggle.classList.remove('active');
          mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ------------------------------------------------------------------------
  // 3. ANIMATED TYPEWRITER EFFECT (HERO SECTION)
  // ------------------------------------------------------------------------
  const typewriterTarget = document.getElementById('typewriter-text');

  // Customizable phrases for hero section
  const phrases = [
    'Computer Science Engineering Student',
    'Aspiring Software Developer',
    'Web & AI Automation Enthusiast',
    'Problem Solver & Tech Explorer'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function typeEffect() {
    if (!typewriterTarget) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      // Remove characters
      typewriterTarget.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      // Add characters
      typewriterTarget.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    // Finished typing phrase
    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 2000; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 400; // Pause before typing new phrase
    }

    setTimeout(typeEffect, typeSpeed);
  }

  // Start typewriter
  setTimeout(typeEffect, 600);

  // ------------------------------------------------------------------------
  // 4. SCROLL REVEAL (INTERSECTION OBSERVER)
  // ------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('active'));
  }

  // ------------------------------------------------------------------------
  // 5. SCROLLSPY (ACTIVE NAV LINK HIGHLIGHTING)
  // ------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (activeLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          activeLink.classList.add('active');
        } else {
          activeLink.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ------------------------------------------------------------------------
  // 6. BACK TO TOP BUTTON
  // ------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ------------------------------------------------------------------------
  // 7. INTERACTIVE MODAL (CERTIFICATES & RESUME PREVIEW)
  // ------------------------------------------------------------------------
  const modalOverlay = document.getElementById('custom-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalActionBtn = document.getElementById('modal-action-btn');

  function openModal({ title, subtitle, content, buttonText, actionUrl }) {
    if (!modalOverlay) return;

    if (modalTitle) modalTitle.textContent = title;
    if (modalSubtitle) modalSubtitle.textContent = subtitle || '';
    if (modalBody) modalBody.innerHTML = content;

    if (modalActionBtn) {
      modalActionBtn.textContent = buttonText || 'Close';
      modalActionBtn.onclick = () => {
        if (actionUrl && actionUrl !== '#') {
          window.open(actionUrl, '_blank');
        }
        closeModal();
      };
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Attach modal trigger to "Download Resume" buttons
  const resumeButtons = document.querySelectorAll('.trigger-resume');
  resumeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal({
        title: 'Resume of Swetha Selvendran',
        subtitle: 'B.E. Computer Science and Engineering | 3rd Year',
        content: `
          <p>Thank you for your interest in my resume! You can download the complete curriculum vitae or view verified credentials.</p>
          <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: 8px; margin-top: 1rem; font-size: 0.9rem; border: 1px dashed var(--card-border);">
            <strong>📌 Tip for Swetha:</strong>
            <p style="margin-top: 0.4rem; color: var(--text-secondary);">Place your PDF resume inside <code>assets/Swetha_Selvendran_Resume.pdf</code> and update this button's <code>href</code> attribute to download your resume directly.</p>
          </div>
        `,
        buttonText: 'Download Mock Resume',
        actionUrl: '#'
      });
    });
  });

  // Attach modal trigger to "View Certificate" buttons
  const certButtons = document.querySelectorAll('.trigger-cert');
  certButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const certName = btn.getAttribute('data-cert-name') || 'Certificate Verification';
      const certIssuer = btn.getAttribute('data-cert-issuer') || 'Accredited Institute';
      const certYear = btn.getAttribute('data-cert-year') || '2024';

      openModal({
        title: certName,
        subtitle: `${certIssuer} • ${certYear}`,
        content: `
          <p>This verified credential recognizes successful completion and proficiency demonstrated in <strong>${certName}</strong> from <strong>${certIssuer}</strong>.</p>
          <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: 8px; margin-top: 1rem; font-size: 0.9rem; border: 1px dashed var(--card-border);">
            <strong>📌 Tip for Swetha:</strong>
            <p style="margin-top: 0.4rem; color: var(--text-secondary);">Replace the <code>href="#"</code> with your authentic credential URL or upload your certificate scans to the <code>assets/certificates/</code> directory.</p>
          </div>
        `,
        buttonText: 'Close Preview',
        actionUrl: '#'
      });
    });
  });

  // Attach modal trigger to "Live Demo" and "GitHub" buttons
  const demoButtons = document.querySelectorAll('.trigger-project-demo');
  demoButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectName = btn.getAttribute('data-project-name') || 'Project Demo';
      openModal({
        title: `${projectName} — Preview`,
        subtitle: 'Interactive Project Demo',
        content: `
          <p>You are viewing the preview container for <strong>${projectName}</strong>.</p>
          <p style="margin-top: 0.5rem; color: var(--text-secondary);">This project is ready to be linked to your live hosting URL (e.g. GitHub Pages, Vercel, Netlify, or Render).</p>
          <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: 8px; margin-top: 1rem; font-size: 0.9rem; border: 1px dashed var(--card-border);">
            <strong>📌 Tip for Swetha:</strong>
            <p style="margin-top: 0.4rem; color: var(--text-secondary);">Edit <code>index.html</code> and replace <code>href="#"</code> on this project card with your actual deployed application URL.</p>
          </div>
        `,
        buttonText: 'Got it',
        actionUrl: '#'
      });
    });
  });

  // ------------------------------------------------------------------------
  // 8. CONTACT FORM SUBMISSION (FRONTEND-ONLY WITH VALIDATION)
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');

  ```javascript
// ------------------------------------------------------------------------
// 8. CONTACT FORM SUBMISSION
// ------------------------------------------------------------------------

const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Check required fields
    if (!name || !email || !message) {
      e.preventDefault();
      showToast('Please fill out all required fields.');
      return;
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      e.preventDefault();
      showToast('Please enter a valid email address.');
      return;
    }

    // Do NOT use e.preventDefault() here.
    // Formspree will receive and send the form.
  });
}
```


  // Simulate sending state
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
        <svg style="animation: spin 1s linear infinite; width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
        </svg>
        <span>Sending Message...</span>
      `;

  setTimeout(() => {
    // Success state
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
    contactForm.reset();

    showToast('Message sent successfully! Thank you for reaching out, Swetha will get back to you soon.');
  }, 1200);
});


// ------------------------------------------------------------------------
// 9. COPY TO CLIPBOARD HELPER (FOR EMAIL CLICK)
// ------------------------------------------------------------------------
const copyEmailBtn = document.getElementById('copy-email-btn');
if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const emailText = copyEmailBtn.getAttribute('data-email') || 'swetha.selvendran@example.com';

    if (navigator.clipboard) {
      navigator.clipboard.writeText(emailText).then(() => {
        showToast(`Email copied to clipboard: ${emailText}`);
      }).catch(() => {
        window.location.href = `mailto:${emailText}`;
      });
    } else {
      window.location.href = `mailto:${emailText}`;
    }
  });
}

// ------------------------------------------------------------------------
// 10. TOAST NOTIFICATION UTILITY
// ------------------------------------------------------------------------
const toastElement = document.getElementById('toast-notification');
const toastMessage = document.getElementById('toast-message');
let toastTimeout;

function showToast(message) {
  if (!toastElement || !toastMessage) return;

  toastMessage.textContent = message;
  toastElement.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastElement.classList.remove('show');
  }, 3800);
}

// Expose showToast globally if needed
window.showPortfolioToast = showToast;


