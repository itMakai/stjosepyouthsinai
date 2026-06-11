/* ================================================
   ST. JOSEPH YOUTH SINAI — script.js
   Features:
   - Navbar: hamburger toggle, scroll-based style change, active link tracking
   - Hero: Ken Burns bg animation trigger
   - Scroll reveal: IntersectionObserver for .reveal elements
   - Animated counters: number count-up on viewport entry
   - Contact form: validation + loading state + toast notification
   - Lightbox: gallery modal with prev/next, keyboard & click-outside-to-close
   - Smooth scroll: for all internal anchor links
   ================================================ */

'use strict';

/* ==============================
   NAVBAR
============================== */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

// --- Hamburger toggle ---
if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        mobileNav.setAttribute('aria-hidden', String(!isOpen));
    });

    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            mobileNav.setAttribute('aria-hidden', 'true');
        });
    });
}

// --- Scroll behavior: add .scrolled after 80px ---
function handleNavbarScroll() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 80);
    trackActiveSection();
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });

// --- Active nav link tracking ---
function trackActiveSection() {
    const sections = document.querySelectorAll('section[id], div[id="gallery-preview"]');
    const links    = document.querySelectorAll('.nav-links .nav-link');
    let current    = '';

    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
    });

    links.forEach(link => {
        const href = link.getAttribute('href') || '';
        link.classList.toggle('active', href === `#${current}`);
    });
}

/* ==============================
   HERO — Ken Burns trigger
============================== */
const heroBg = document.getElementById('heroBg');
if (heroBg) {
    window.addEventListener('load', () => heroBg.classList.add('loaded'));
}

/* ==============================
   SCROLL REVEAL
============================== */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        // Stagger siblings within the same parent
        const parent   = entry.target.parentElement;
        const siblings = parent ? Array.from(parent.querySelectorAll('.reveal')) : [];
        const idx      = siblings.indexOf(entry.target);
        const delay    = Math.min(idx * 90, 400); // cap at 400ms

        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ==============================
   ANIMATED COUNTERS
============================== */
function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1600; // ms
    const fps      = 60;
    const steps    = (duration / 1000) * fps;
    const inc      = target / steps;
    let   current  = 0;

    const tick = () => {
        current += inc;
        if (current >= target) {
            // Add "+" suffix for all except single-digit targets
            el.textContent = target + (target > 9 ? '+' : '');
        } else {
            el.textContent = Math.floor(current);
            requestAnimationFrame(tick);
        }
    };
    requestAnimationFrame(tick);
}

const statsSection = document.getElementById('stats');
if (statsSection) {
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.stat-number[data-target]').forEach(animateCounter);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    statObserver.observe(statsSection);
}

/* ==============================
   CONTACT FORM — Validation & Submit
============================== */
const contactForm = document.getElementById('contactForm');
const toast       = document.getElementById('toast');
const toastMsg    = document.getElementById('toastMsg');

function setFieldError(inputId, errorId, show) {
    const input = document.getElementById(inputId);
    const err   = document.getElementById(errorId);
    if (input) input.classList.toggle('error', show);
    if (err)   err.classList.toggle('show', show);
}

// Live clear on input
['firstName', 'lastName', 'email', 'message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', () => setFieldError(id, id + 'Error', false));
    }
});

if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        let valid = true;

        const first   = document.getElementById('firstName');
        const last    = document.getElementById('lastName');
        const email   = document.getElementById('email');
        const message = document.getElementById('message');

        if (!first?.value.trim()) {
            setFieldError('firstName', 'firstNameError', true); valid = false;
        }
        if (!last?.value.trim()) {
            setFieldError('lastName', 'lastNameError', true); valid = false;
        }
        const emailVal = email?.value.trim() || '';
        if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
            setFieldError('email', 'emailError', true); valid = false;
        }
        if (!message?.value.trim()) {
            setFieldError('message', 'messageError', true); valid = false;
        }

        if (!valid) return;

        // Simulate sending
        const btn = document.getElementById('submitBtn');
        if (btn) {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending&hellip;';
            btn.disabled  = true;
        }

        setTimeout(() => {
            contactForm.reset();
            if (btn) {
                btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                btn.disabled  = false;
            }
            showToast('🙏 Thank you! Your message has been sent. We\'ll reply soon.');
        }, 1600);
    });
}

function showToast(msg) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4500);
}

/* ==============================
   LIGHTBOX  (Gallery page)
============================== */
const lightboxModal = document.getElementById('lightboxModal');
const lbImg         = document.getElementById('lbImg');
const lbCaption     = document.getElementById('lbCaption');
const lbCounter     = document.getElementById('lbCounter');
const lbClose       = document.getElementById('lbClose');
const lbPrev        = document.getElementById('lbPrev');
const lbNext        = document.getElementById('lbNext');
const lbItems       = document.querySelectorAll('.lb-item');

let currentLbIndex = 0;

function openLightbox(index) {
    if (!lightboxModal || lbItems.length === 0) return;
    currentLbIndex = index;
    renderLightboxImage();
    lightboxModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbClose?.focus();
}

function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('open');
    document.body.style.overflow = '';
}

function renderLightboxImage() {
    const item    = lbItems[currentLbIndex];
    const src     = item?.getAttribute('data-src') || '';
    const caption = item?.getAttribute('data-caption') || '';

    if (lbImg) {
        lbImg.style.opacity = '0';
        setTimeout(() => {
            lbImg.src       = src;
            lbImg.alt       = caption;
            lbImg.onload    = () => { lbImg.style.opacity = '1'; };
        }, 160);
    }
    if (lbCaption) lbCaption.textContent = caption;
    if (lbCounter) lbCounter.textContent = `${currentLbIndex + 1} / ${lbItems.length}`;
}

function shiftLightbox(direction) {
    currentLbIndex = (currentLbIndex + direction + lbItems.length) % lbItems.length;
    renderLightboxImage();
}

// Attach click listeners to each gallery item
lbItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
    // Also support keyboard activation
    item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(index);
        }
    });
});

if (lbClose) lbClose.addEventListener('click', closeLightbox);
if (lbPrev)  lbPrev.addEventListener('click',  () => shiftLightbox(-1));
if (lbNext)  lbNext.addEventListener('click',  () => shiftLightbox(+1));

// Click backdrop to close
if (lightboxModal) {
    lightboxModal.addEventListener('click', e => {
        if (e.target === lightboxModal) closeLightbox();
    });
}

// Keyboard navigation
document.addEventListener('keydown', e => {
    if (!lightboxModal?.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   shiftLightbox(-1);
    if (e.key === 'ArrowRight')  shiftLightbox(+1);
});

// Touch swipe support for lightbox
(function initSwipe() {
    if (!lightboxModal) return;
    let startX = 0;
    lightboxModal.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    lightboxModal.addEventListener('touchend',   e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) shiftLightbox(diff > 0 ? 1 : -1);
    }, { passive: true });
})();

/* ==============================
   SMOOTH SCROLL — Anchor Links
============================== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = navbar ? navbar.offsetHeight : 0;
            const top    = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});
