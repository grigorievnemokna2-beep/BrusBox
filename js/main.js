document.addEventListener('DOMContentLoaded', () => {

  // ===== MOBILE MENU =====
  const burger = document.querySelector('.nav__burger');
  const menu = document.querySelector('.nav__menu');
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(28,35,49,0.5);z-index:1000;display:none;';
  document.body.appendChild(overlay);

  if (burger && menu) {
    const toggle = () => {
      const open = menu.classList.toggle('active');
      burger.classList.toggle('active');
      overlay.style.display = open ? 'block' : 'none';
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', toggle);
    overlay.addEventListener('click', toggle);
  }

  // Mobile dropdown toggle
  document.querySelectorAll('.nav__item').forEach(item => {
    item.querySelector('.nav__link')?.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && item.querySelector('.nav__mega, .nav__dropdown')) {
        e.preventDefault();
        item.classList.toggle('active');
      }
    });
  });

  // ===== TARIFF TABS (mobile) =====
  document.querySelectorAll('.tariffs__tabs').forEach(tabsContainer => {
    const tabs = tabsContainer.querySelectorAll('.tariffs__tab');
    const grid = tabsContainer.nextElementSibling;
    if (!grid) return;
    const cards = grid.querySelectorAll('.tariff-card');

    function activateTab(index) {
      tabs.forEach((t, i) => t.classList.toggle('tariffs__tab--active', i === index));
      cards.forEach((c, i) => c.classList.toggle('tariff-card--mobile-active', i === index));
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activateTab(i));
    });

    // Activate popular tab by default
    const popularIndex = [...tabs].findIndex(t => t.classList.contains('tariffs__tab--popular'));
    activateTab(popularIndex >= 0 ? popularIndex : 1);
  });

  // ===== QUIZ =====
  const quizSteps = document.querySelectorAll('.quiz__step');
  const progressBar = document.querySelector('.quiz__progress-bar');
  let currentStep = 0;
  const quizData = {};

  window.quizNext = function() {
    const step = quizSteps[currentStep];
    const selected = step?.querySelector('.quiz__option.selected');
    if (!selected && step?.querySelectorAll('.quiz__option').length) {
      step.querySelectorAll('.quiz__option').forEach(o => {
        o.style.borderColor = 'var(--red)';
        setTimeout(() => o.style.borderColor = '', 800);
      });
      return;
    }
    if (selected) quizData[`step${currentStep + 1}`] = selected.dataset.value || selected.textContent.trim();
    currentStep = Math.min(currentStep + 1, quizSteps.length - 1);
    showStep();
  };

  window.quizPrev = function() {
    currentStep = Math.max(currentStep - 1, 0);
    showStep();
  };

  function showStep() {
    quizSteps.forEach(s => s.classList.remove('active'));
    quizSteps[currentStep]?.classList.add('active');
    if (progressBar) progressBar.style.width = ((currentStep + 1) / quizSteps.length * 100) + '%';
  }

  document.querySelectorAll('.quiz__option').forEach(opt => {
    opt.addEventListener('click', () => {
      opt.closest('.quiz__step').querySelectorAll('.quiz__option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });

  // Quiz form submit
  document.querySelector('.quiz__final-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    quizData.name = f.querySelector('[name="name"]')?.value;
    quizData.phone = f.querySelector('[name="phone"]')?.value;
    if (!quizData.phone) return;
    showSuccess(f.closest('.quiz__step'));
  });

  // ===== FAQ =====
  document.querySelectorAll('.faq-item__question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const answer = item.querySelector('.faq-item__answer');
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-item__answer').style.maxHeight = '0';
      });
      if (!wasActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ===== MODALS =====
  window.openModal = (id) => {
    document.getElementById(id)?.classList.add('active');
    document.body.style.overflow = 'hidden';
  };
  window.closeModal = (id) => {
    document.getElementById(id)?.classList.remove('active');
    document.body.style.overflow = '';
  };
  document.querySelectorAll('.modal-overlay').forEach(o => {
    o.addEventListener('click', (e) => {
      if (e.target === o) { o.classList.remove('active'); document.body.style.overflow = ''; }
    });
  });

  // ===== TIMER =====
  const timerEl = document.querySelector('.promo__timer');
  if (timerEl) {
    const end = new Date();
    end.setDate(end.getDate() + 14);
    const update = () => {
      const d = end - new Date();
      if (d <= 0) return;
      const set = (sel, val) => { const el = timerEl.querySelector(sel); if (el) el.textContent = String(val).padStart(2, '0'); };
      set('[data-days]', Math.floor(d / 864e5));
      set('[data-hours]', Math.floor(d % 864e5 / 36e5));
      set('[data-minutes]', Math.floor(d % 36e5 / 6e4));
      set('[data-seconds]', Math.floor(d % 6e4 / 1e3));
    };
    update();
    setInterval(update, 1000);
  }

  // ===== FORM SUBMISSIONS =====
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showSuccess(form.parentElement);
    });
  });

  function showSuccess(container) {
    if (!container) return;
    const original = container.innerHTML;
    container.innerHTML = `
      <div style="text-align:center;padding:24px 0;">
        <div style="width:48px;height:48px;border-radius:50%;background:#E8F8F0;color:#27AE60;font-size:1.4rem;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">&#10003;</div>
        <h3 style="font-size:1.15rem;margin-bottom:6px;color:#1C2331;">Заявка отправлена!</h3>
        <p style="color:#4A5568;font-size:0.88rem;">Перезвоним в течение 15 минут</p>
      </div>`;
    setTimeout(() => { container.innerHTML = original; }, 5000);
  }

  // ===== PHONE MASK =====
  document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 12) v = v.slice(0, 12);
      if (v.startsWith('375')) {
        const parts = ['+' + v.slice(0, 3)];
        if (v.length > 3) parts.push(' (' + v.slice(3, 5));
        if (v.length > 5) parts.push(') ' + v.slice(5, 8));
        if (v.length > 8) parts.push('-' + v.slice(8, 10));
        if (v.length > 10) parts.push('-' + v.slice(10, 12));
        e.target.value = parts.join('');
      } else if (v) {
        e.target.value = '+' + v;
      }
    });
  });

  // ===== SCROLL ANIMATIONS =====
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.benefit-card, .tariff-card, .step-card, .review-card, .portfolio-card, .feature-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    obs.observe(el);
  });
  const style = document.createElement('style');
  style.textContent = '.vis{opacity:1!important;transform:translateY(0)!important;}';
  document.head.appendChild(style);

  // ===== EXIT INTENT =====
  let exitShown = false;
  document.addEventListener('mouseout', (e) => {
    if (e.clientY < 5 && !exitShown) {
      exitShown = true;
      document.getElementById('exit-modal')?.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

});
