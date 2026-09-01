(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      document.body.classList.toggle('menu-open', isOpen);
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      document.body.classList.remove('menu-open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }

  const filterButtons = [...document.querySelectorAll('.filter-btn')];
  const projectCards = [...document.querySelectorAll('.project-card')];
  filterButtons.forEach(button => button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    projectCards.forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  }));

  const inquiryForm = document.querySelector('#inquiry-form');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const form = new FormData(inquiryForm);
      const name = form.get('name') || 'غير مذكور';
      const type = form.get('type') || 'غير مذكور';
      const city = form.get('city') || 'غير مذكورة';
      const loads = form.get('loads') || 'غير مذكورة';
      const phone = form.get('phone') || 'غير مذكور';
      const message = [
        'مرحباً مهندس أنس، أريد الاستفسار عن منظومة طاقة لمشروعي.',
        '',
        `الاسم: ${name}`,
        `نوع المشروع: ${type}`,
        `المدينة: ${city}`,
        `الأحمال التقريبية: ${loads}`,
        `رقم التواصل: ${phone}`
      ].join('\n');

      const wa = (window.SITE_CONFIG && window.SITE_CONFIG.whatsapp) || '';
      if (wa) {
        window.open(`https://wa.me/${wa.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
      } else {
        navigator.clipboard?.writeText(message);
        alert('رمز الدولة لرقم WhatsApp غير مؤكد بعد. تم تجهيز نص الاستفسار ونسخه للحافظة إن كان المتصفح يسمح بذلك.');
      }
    });
  }

  document.querySelectorAll('[data-phone-link]').forEach(el => {
    const phone = (window.SITE_CONFIG && window.SITE_CONFIG.phone) || '0953772122';
    el.setAttribute('href', `tel:${phone.replace(/\s/g, '')}`);
  });

  const year = document.querySelector('[data-current-year]');
  if (year) year.textContent = new Date().getFullYear();
})();