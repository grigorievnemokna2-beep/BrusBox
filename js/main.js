/* ===== MAIN JS ===== */
document.addEventListener('DOMContentLoaded', () => {

  // ===== MOBILE MENU =====
  const burger = document.querySelector('.nav__burger');
  const menu = document.querySelector('.nav__menu');
  const overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:1000;display:none;';
  document.body.appendChild(overlay);

  if (burger && menu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      menu.classList.toggle('active');
      overlay.style.display = menu.classList.contains('active') ? 'block' : 'none';
      document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    overlay.addEventListener('click', () => {
      burger.classList.remove('active');
      menu.classList.remove('active');
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    });
  }

  // Mobile dropdown toggle
  document.querySelectorAll('.nav__item').forEach(item => {
    const link = item.querySelector('.nav__link');
    const dropdown = item.querySelector('.nav__dropdown');
    if (link && dropdown && window.innerWidth <= 768) {
      link.addEventListener('click', (e) => {
        if (dropdown) {
          e.preventDefault();
          item.classList.toggle('active');
        }
      });
    }
  });

  // ===== QUIZ =====
  const quizSteps = document.querySelectorAll('.quiz__step');
  const progressBar = document.querySelector('.quiz__progress-bar');
  let currentStep = 0;
  const quizData = {};

  window.quizNext = function(step) {
    const currentStepEl = quizSteps[currentStep];
    const selected = currentStepEl.querySelector('.quiz__option.selected');

    if (!selected && currentStep < quizSteps.length - 1) {
      const options = currentStepEl.querySelectorAll('.quiz__option');
      if (options.length > 0) {
        // Highlight that selection is needed
        options.forEach(o => {
          o.style.borderColor = '#ff4444';
          setTimeout(() => { o.style.borderColor = ''; }, 1000);
        });
        return;
      }
    }

    if (selected) {
      quizData[`step${currentStep + 1}`] = selected.dataset.value || selected.textContent.trim();
    }

    if (step !== undefined) {
      currentStep = step;
    } else {
      currentStep++;
    }

    if (currentStep >= quizSteps.length) currentStep = quizSteps.length - 1;

    quizSteps.forEach(s => s.classList.remove('active'));
    if (quizSteps[currentStep]) {
      quizSteps[currentStep].classList.add('active');
    }

    if (progressBar) {
      const progress = ((currentStep + 1) / quizSteps.length) * 100;
      progressBar.style.width = progress + '%';
    }
  };

  window.quizPrev = function() {
    if (currentStep > 0) {
      currentStep--;
      quizSteps.forEach(s => s.classList.remove('active'));
      quizSteps[currentStep].classList.add('active');

      if (progressBar) {
        const progress = ((currentStep + 1) / quizSteps.length) * 100;
        progressBar.style.width = progress + '%';
      }
    }
  };

  // Quiz option selection
  document.querySelectorAll('.quiz__option').forEach(option => {
    option.addEventListener('click', () => {
      const parent = option.closest('.quiz__step');
      parent.querySelectorAll('.quiz__option').forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');
    });
  });

  // Quiz form submission
  const quizForm = document.querySelector('.quiz__final-form');
  if (quizForm) {
    quizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = quizForm.querySelector('input[name="name"]');
      const phone = quizForm.querySelector('input[name="phone"]');

      if (name && phone && phone.value.trim()) {
        quizData.name = name.value;
        quizData.phone = phone.value;
        console.log('Quiz data:', quizData);

        // Show success
        const wrapper = quizForm.closest('.quiz__step');
        if (wrapper) {
          wrapper.innerHTML = `
            <div style="text-align:center; padding: 40px 0;">
              <div style="font-size:3rem; margin-bottom:16px;">&#10003;</div>
              <h3 style="font-size:1.4rem; margin-bottom:8px;">Спасибо за заявку!</h3>
              <p style="color:#666;">Мы перезвоним вам в течение 15 минут и предоставим точный расчёт.</p>
            </div>
          `;
        }
      }
    });
  }

  // ===== FAQ ACCORDION =====
  document.querySelectorAll('.faq-item__question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const answer = item.querySelector('.faq-item__answer');
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-item__answer').style.maxHeight = '0';
      });

      // Open clicked if not already open
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ===== MODAL =====
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Close modal on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // ===== COUNTDOWN TIMER =====
  function startTimer() {
    const timerEl = document.querySelector('.promo__timer');
    if (!timerEl) return;

    // Set end date to 14 days from now
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14);

    function update() {
      const now = new Date();
      const diff = endDate - now;

      if (diff <= 0) return;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const daysEl = timerEl.querySelector('[data-days]');
      const hoursEl = timerEl.querySelector('[data-hours]');
      const minutesEl = timerEl.querySelector('[data-minutes]');
      const secondsEl = timerEl.querySelector('[data-seconds]');

      if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }
  startTimer();

  // ===== FORM SUBMISSIONS =====
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      console.log('Form submitted:', data);

      // Show success message
      const parent = form.parentElement;
      const originalHTML = parent.innerHTML;
      parent.innerHTML = `
        <div style="text-align:center; padding: 20px;">
          <div style="font-size:2rem; color:#28a745; margin-bottom:12px;">&#10003;</div>
          <h3 style="font-size:1.2rem; margin-bottom:8px;">Заявка отправлена!</h3>
          <p style="color:#666; font-size:0.9rem;">Мы свяжемся с вами в ближайшее время.</p>
        </div>
      `;

      // Reset after 5 seconds
      setTimeout(() => {
        parent.innerHTML = originalHTML;
      }, 5000);
    });
  });

  // ===== PHONE MASK =====
  document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 0) {
        if (value[0] === '3') {
          // Belarus format
          if (value.length <= 3) {
            value = '+' + value;
          } else if (value.length <= 5) {
            value = '+' + value.slice(0, 3) + ' (' + value.slice(3);
          } else if (value.length <= 8) {
            value = '+' + value.slice(0, 3) + ' (' + value.slice(3, 5) + ') ' + value.slice(5);
          } else if (value.length <= 10) {
            value = '+' + value.slice(0, 3) + ' (' + value.slice(3, 5) + ') ' + value.slice(5, 8) + '-' + value.slice(8);
          } else {
            value = '+' + value.slice(0, 3) + ' (' + value.slice(3, 5) + ') ' + value.slice(5, 8) + '-' + value.slice(8, 10) + '-' + value.slice(10, 12);
          }
        } else {
          if (value.length > 12) value = value.slice(0, 12);
          value = '+' + value;
        }
      }
      e.target.value = value;
    });
  });

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== SCROLL ANIMATIONS =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section, .catalog-card, .feature-card, .step-card, .review-card, .advantage-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Add visible class styles
  const style = document.createElement('style');
  style.textContent = '.visible { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);

  // ===== EXIT INTENT POPUP =====
  let exitShown = false;
  document.addEventListener('mouseout', (e) => {
    if (e.clientY < 5 && !exitShown) {
      exitShown = true;
      const exitModal = document.getElementById('exit-modal');
      if (exitModal) {
        exitModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  });

  // ===== HEADER SCROLL EFFECT =====
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
      header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
      header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)';
    }
    lastScroll = currentScroll;
  });

});
