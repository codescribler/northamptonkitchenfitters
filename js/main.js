/* ============================================
   Northampton Kitchen Fitters — Main JavaScript
   Features: Sticky header, mobile nav, scroll reveal,
   smooth anchor scrolling
   ============================================ */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Sticky Header ----
  const header = document.getElementById('site-header');
  let lastScroll = 0;

  function handleScroll() {
    const y = window.scrollY;
    if (y > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = y;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ---- Mobile Nav Toggle ----
  const toggle = document.getElementById('mobile-toggle');
  const nav = document.getElementById('main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on nav link click
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  // ---- Scroll Reveal ----
  if (!prefersReducedMotion) {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, index) {
        if (entry.isIntersecting) {
          // Stagger siblings
          const parent = entry.target.parentElement;
          const siblings = parent ? Array.from(parent.querySelectorAll('.reveal')) : [];
          const siblingIndex = siblings.indexOf(entry.target);
          const delay = siblingIndex >= 0 ? siblingIndex * 80 : 0;

          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // If reduced motion, show everything immediately
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ---- Smooth Anchor Scrolling ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

        window.scrollTo({
          top: top,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  });

  // ---- Counter Animation ----
  function animateCounter(element, target, duration) {
    var current = 0;
    var increment = target / (duration / 16);
    var start = Date.now();

    function update() {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current) + '+';
        requestAnimationFrame(update);
      } else {
        element.textContent = target + '+';
      }
    }

    update();
  }

  if (!prefersReducedMotion) {
    var statElements = document.querySelectorAll('[data-stat]');
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          var target = parseInt(entry.target.dataset.stat, 10);
          animateCounter(entry.target, target, 800);
          entry.target.dataset.counted = 'true';
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statElements.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  // ---- Parallax Lite Effect ----
  if (!prefersReducedMotion) {
    var heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
      window.addEventListener('scroll', function () {
        var scrolled = window.scrollY;
        heroBg.style.transform = 'translateY(' + (scrolled * 0.5) + 'px)';
      }, { passive: true });
    }
  }

  // ---- Active Nav Highlighting ----
  // (Disabled: nav links use # placeholders for multi-page demo feel.
  //  On the real multi-page site, the current page link would get .active via server-side or routing.)

  // ---- Demo Modal ----
  var modal = document.getElementById('demo-modal');
  var modalClose = document.getElementById('demo-modal-close');

  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (modal && modalClose) {
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
  }

  // Intercept all CTA buttons (but not modal-internal links)
  document.querySelectorAll('.btn, .cta-primary, .cta-secondary').forEach(function (btn) {
    if (btn.closest('.demo-modal')) return;
    btn.addEventListener('click', openModal);
  });

})();
