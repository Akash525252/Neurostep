/* NEUROSTEP — main.js
   Progressive enhancement: nothing here should be required for the
   page to be usable. If a feature's browser API is missing, that
   feature is simply skipped rather than breaking the page. */
(function () {
  'use strict';

  /* ---------- 1. Confirm animation support, THEN opt in ---------- */
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('js');
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initReveal();
    initPopup();
    initGallery();
    initFaq();
    initBlogFilter();
    initWhatsAppLinks();
    initContactForm();
    initYear();
  });

  /* ---------- Mobile nav ---------- */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    if (!('IntersectionObserver' in window)) return; // content stays visible by default
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Lead-capture popup ---------- */
  function initPopup() {
    var overlay = document.querySelector('.lead-popup-overlay');
    if (!overlay) return;
    var STORAGE_KEY = 'neurostep_popup_shown';
    var closers = overlay.querySelectorAll('[data-popup-close]');

    function shownAlready() {
      try { return sessionStorage.getItem(STORAGE_KEY) === '1'; }
      catch (e) { return false; }
    }
    function markShown() {
      try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) { /* ignore */ }
    }
    function openPopup() {
      if (shownAlready()) return;
      overlay.classList.add('open');
      markShown();
      var firstField = overlay.querySelector('input');
      if (firstField) firstField.focus();
    }
    function closePopup() {
      overlay.classList.remove('open');
    }

    if (!shownAlready()) {
      window.setTimeout(openPopup, 60000); // ~60s after load
    }

    closers.forEach(function (el) { el.addEventListener('click', closePopup); });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closePopup();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closePopup();
    });

    var form = overlay.querySelector('form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        // Placeholder submit handler — wire to WhatsApp Business API /
        // CRM webhook (Interakt, WATI, AiSensy) here later.
        var name = form.querySelector('[name="popup_name"]');
        var phone = form.querySelector('[name="popup_phone"]');
        var thanks = overlay.querySelector('.popup-thanks');
        if (thanks) {
          overlay.querySelector('form').style.display = 'none';
          thanks.style.display = 'block';
        }
        window.setTimeout(closePopup, 2200);
      });
    }
  }

  /* ---------- Gallery: filter + lightbox ---------- */
  function initGallery() {
    var grid = document.querySelector('.gallery-grid');
    if (!grid) return;
    var chips = document.querySelectorAll('.filter-row .chip');
    var items = grid.querySelectorAll('.g-item');

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        var f = chip.getAttribute('data-filter');
        items.forEach(function (item) {
          var match = f === 'all' || item.getAttribute('data-cat') === f;
          item.style.display = match ? '' : 'none';
        });
      });
    });

    var lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;
    var lbSlot = lightbox.querySelector('.lightbox-img-slot');
    var lbCap = lightbox.querySelector('.lightbox-cap-text');
    var lbClose = lightbox.querySelector('.lightbox-close');

    items.forEach(function (item) {
      item.addEventListener('click', function () {
        var label = item.getAttribute('data-label') || '';
        var photo = item.querySelector('img');
        if (lbSlot) {
          if (photo) {
            lbSlot.innerHTML = '';
            lbSlot.style.padding = '0';
            var img = document.createElement('img');
            img.src = photo.src;
            img.alt = photo.alt;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            lbSlot.appendChild(img);
          } else {
            lbSlot.textContent = label;
            lbSlot.style.padding = '2em';
          }
        }
        if (lbCap) lbCap.textContent = label;
        lightbox.classList.add('open');
      });
    });
    function closeLb() { lightbox.classList.remove('open'); }
    if (lbClose) lbClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLb();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLb();
    });
  }

  /* ---------- FAQ accordion ---------- */
  function initFaq() {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      var btn = item.querySelector('.faq-q');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var wasOpen = item.classList.contains('open');
        item.parentElement.querySelectorAll('.faq-item.open').forEach(function (o) {
          if (o !== item) { o.classList.remove('open'); o.querySelector('.faq-q').setAttribute('aria-expanded', 'false'); }
        });
        item.classList.toggle('open', !wasOpen);
        btn.setAttribute('aria-expanded', (!wasOpen).toString());
      });
    });
  }

  /* ---------- Blog filter chips ---------- */
  function initBlogFilter() {
    var row = document.querySelector('.blog-filter-row');
    if (!row) return;
    var chips = row.querySelectorAll('.chip');
    var cards = document.querySelectorAll('.blog-grid .b-card');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        var f = chip.getAttribute('data-filter');
        cards.forEach(function (card) {
          var match = f === 'all' || card.getAttribute('data-cat') === f;
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* ---------- WhatsApp click-to-chat links ---------- */
  function initWhatsAppLinks() {
    var PHONE = '919286978337'; // primary number, international format, no + or spaces
    var MESSAGE = "Hi NEUROSTEP, I'd like to know more about your rehabilitation programs.";
    document.querySelectorAll('[data-wa-link]').forEach(function (el) {
      var customMsg = el.getAttribute('data-wa-message') || MESSAGE;
      el.setAttribute('href', 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(customMsg));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    });
  }

  /* ---------- Contact / appointment form ---------- */
  function initContactForm() {
    var form = document.querySelector('#appointment-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = form.querySelector('.form-status');
      // Placeholder: replace with real submission endpoint / CRM / WhatsApp API integration.
      if (status) {
        status.textContent = "Thanks — your request has been noted. We'll call you back shortly. For a faster response, tap the WhatsApp button below.";
        status.style.display = 'block';
      }
      form.reset();
    });
  }

  function initYear() {
    var el = document.querySelector('#current-year');
    if (el) el.textContent = new Date().getFullYear();
  }
})();
