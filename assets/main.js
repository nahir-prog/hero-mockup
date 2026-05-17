// Hero of the Talk — mockup v2

(function () {

  // ── Mobile nav toggle ───────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('.mobile-nav-toggle');
    var nav = document.querySelector('.site-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () { nav.classList.toggle('open'); });
    }

    // ── Smooth-scroll för anchor-länkar ───────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  });

  // ── SPOTLIGHT GLOW CARDS — cursor-tracked ──────────────────
  // Sätter --x och --y på varje glow-card baserat på muspekarens position
  // (relativ till kortets bounding rect, så glow:n följer pixelperfekt).
  document.addEventListener('pointermove', function (e) {
    document.querySelectorAll('.glow-card').forEach(function (card) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var xp = x / rect.width;
      card.style.setProperty('--x', x.toFixed(2));
      card.style.setProperty('--y', y.toFixed(2));
      card.style.setProperty('--xp', xp.toFixed(2));
    });
  });

  // Mouse-tilt borttagen i v3 — det laggade. Hover-glow sköts nu av ren CSS.

  // ── MATERIAL TABS ───────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    var tabBtns = document.querySelectorAll('.material-tabs .tab-btn');
    var tabPanels = document.querySelectorAll('.material-tabs .tab-panel');
    if (!tabBtns.length) return;

    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = this.getAttribute('data-tab');
        // Uppdatera knappar
        tabBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        // Uppdatera paneler
        tabPanels.forEach(function (p) {
          if (p.getAttribute('data-tab') === target) {
            p.classList.add('active');
            p.removeAttribute('hidden');
          } else {
            p.classList.remove('active');
            p.setAttribute('hidden', '');
          }
        });
      });
    });
  });

  // ── SHUFFLE TESTIMONIAL CARDS ───────────────────────────────
  // Klicka eller dra första kortet vänster för att blanda
  document.addEventListener('DOMContentLoaded', function () {
    var stack = document.getElementById('shuffle-stack');
    if (!stack) return;
    var cards = Array.from(stack.querySelectorAll('.shuffle-card'));
    var positions = ['front', 'middle', 'back', 'hidden'];
    var isAnimating = false;

    function shuffle() {
      if (isAnimating) return;
      isAnimating = true;

      // Rotera positions — det som var "front" hamnar sist
      positions.push(positions.shift());
      // Hitta vilket kort som är i vilken position
      cards.forEach(function (card, i) {
        card.setAttribute('data-position', positions[i]);
      });

      setTimeout(function () { isAnimating = false; }, 500);
    }

    // Klick på front-kort = shuffle
    stack.addEventListener('click', function (e) {
      var card = e.target.closest('.shuffle-card');
      if (card && card.getAttribute('data-position') === 'front' && !dragMoved) {
        shuffle();
      }
    });

    // Drag-to-shuffle
    var dragStartX = 0;
    var dragMoved = false;
    var dragging = false;
    var frontCard = null;

    stack.addEventListener('pointerdown', function (e) {
      var card = e.target.closest('.shuffle-card');
      if (!card || card.getAttribute('data-position') !== 'front') return;
      frontCard = card;
      dragging = true;
      dragMoved = false;
      dragStartX = e.clientX;
      frontCard.classList.add('dragging');
      frontCard.setPointerCapture(e.pointerId);
    });

    stack.addEventListener('pointermove', function (e) {
      if (!dragging || !frontCard) return;
      var dx = e.clientX - dragStartX;
      if (Math.abs(dx) > 4) dragMoved = true;
      var rotation = -6 + (dx / 25);
      frontCard.style.transform = 'translate(' + dx + 'px, 0) rotate(' + rotation + 'deg)';
    });

    stack.addEventListener('pointerup', function (e) {
      if (!dragging || !frontCard) return;
      dragging = false;
      var dx = e.clientX - dragStartX;
      frontCard.classList.remove('dragging');
      frontCard.style.transform = '';
      if (Math.abs(dx) > 100) {
        shuffle();
      }
      frontCard = null;
      // Reset dragMoved efter en kort tid så click-eventet kan kollas
      setTimeout(function () { dragMoved = false; }, 50);
    });

    stack.addEventListener('pointercancel', function () {
      if (frontCard) {
        frontCard.classList.remove('dragging');
        frontCard.style.transform = '';
      }
      dragging = false;
      frontCard = null;
    });
  });

})();
