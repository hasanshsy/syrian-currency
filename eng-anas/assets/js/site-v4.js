(() => {
  const ROUTES = ['home','services','portfolio','projects','partners','contact'];
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  let lang = localStorage.getItem('engAnasLang') || 'ar';
  let data = null;

  const setLang = (next) => {
    lang = next;
    localStorage.setItem('engAnasLang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    $('#langToggle').textContent = lang === 'ar' ? 'EN' : 'AR';
    $$('[data-ar][data-en]').forEach(el => {
      const v = el.dataset[lang];
      if (v) el.textContent = v;
    });
    renderData();
  };

  const waLink = (message='') => `https://wa.me/${data.contact.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

  function renderData(){
    if(!data) return;
    $('#heroEyebrow').textContent = data.hero?.[lang]?.eyebrow || (lang==='ar' ? 'حلول طاقة للمشاريع الصناعية والتجارية' : 'ENERGY SOLUTIONS FOR INDUSTRIAL & COMMERCIAL PROJECTS');
    $('#heroTitle').textContent = data.hero[lang].title;
    $('#heroLead').textContent = data.hero[lang].lead;
    $('#topWhatsApp').href = waLink();
    $('#heroWhatsApp').href = waLink(lang === 'ar' ? 'مرحباً مهندس أنس، أريد مناقشة مشروع طاقة.' : 'Hello Eng. Anas, I would like to discuss an energy project.');
    $('#contactPhone').href = waLink();

    $('#heroBrands').innerHTML = data.brands.map(b => `<span>${b.name}</span>`).join('');
    $('#serviceList').innerHTML = data.services.map((s,i)=>`<article class="service-card"><span class="s-num">0${i+1}</span><h3>${s[lang]}</h3><p>${lang==='ar'?s.descAr:s.descEn}</p><span class="s-arrow">↗</span></article>`).join('');
    $('#referenceList').innerHTML = data.projects.map((r,i)=>`<article class="reference-item"><span class="r-num">0${i+1}</span><div><b>${r[lang]}</b><small>${lang==='ar'?r.sectorAr:r.sectorEn}</small></div><span class="r-arrow">↗</span></article>`).join('');
    $('#solutionsGrid').innerHTML = data.solutions.map(s=>`<article class="solution-card"><img loading="lazy" src="${s.img}" alt="${s[lang]}"><div class="sol-info"><small>${lang==='ar'?s.tagAr:s.tagEn}</small><b>${s[lang]}</b></div></article>`).join('');
    $('#partnerGrid').innerHTML = data.brands.map(b=>`<article class="partner-card"><div class="partner-logo"><img loading="lazy" src="${b.img}" alt="${b.name}"></div><span class="certified">AUTHORIZED SALES AGENT</span><h3>${b.name}</h3><p>${b[lang]}</p></article>`).join('');
    renderPortfolio(currentFilter);
  }

  let currentFilter = 'all';
  function renderPortfolio(filter='all'){
    if(!data) return;
    const items = data.portfolio.filter(p=>filter==='all'||p.cat===filter);
    $('#portfolioGrid').innerHTML = items.map((p,i)=>`<article class="portfolio-card" data-full="${p.img}" data-title="${p[lang]}" data-meta="${lang==='ar'?p.metaAr:p.metaEn}"><img loading="lazy" src="${p.img}" alt="${p[lang]}"><div class="pc-info"><small>${lang==='ar'?p.metaAr:p.metaEn}</small><b>${p[lang]}</b></div></article>`).join('');
    $$('.portfolio-card').forEach(card=>card.addEventListener('click',()=>openLightbox(card)));
  }

  function openLightbox(card){
    $('#lightboxImg').src = card.dataset.full;
    $('#lightboxTitle').textContent = card.dataset.title;
    $('#lightboxMeta').textContent = card.dataset.meta;
    $('#lightbox').classList.add('open');
    $('#lightbox').setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }
  function closeLightbox(){
    $('#lightbox').classList.remove('open');
    $('#lightbox').setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }

  function routeTo(route, push=true){
    if(!ROUTES.includes(route)) route='home';
    document.body.dataset.route = route;
    $$('.view').forEach(v=>v.classList.toggle('active', v.dataset.view===route));
    $$('[data-route-link]').forEach(b=>b.classList.toggle('active', b.dataset.routeLink===route));
    const index = ROUTES.indexOf(route);
    $('#routeNumber').textContent = String(index+1).padStart(2,'0');
    $('#routeProgress').style.width = `${((index+1)/ROUTES.length)*100}%`;
    if(push) history.pushState({route},'',`#${route}`);
    window.scrollTo(0,0);
    closeMenu();
  }

  function openMenu(){ $('#mobileMenu').classList.add('open'); $('#mobileMenu').setAttribute('aria-hidden','false'); $('#menuToggle').classList.add('open'); }
  function closeMenu(){ $('#mobileMenu').classList.remove('open'); $('#mobileMenu').setAttribute('aria-hidden','true'); $('#menuToggle').classList.remove('open'); }

  async function init(){
    try{
      const res = await fetch('content/site.json', {cache:'no-store'});
      data = await res.json();
      setLang(lang);
      const first = location.hash.replace('#','') || 'home';
      routeTo(first,false);
    }catch(e){ console.error(e); }

    $$('[data-route-link]').forEach(el=>el.addEventListener('click',(e)=>{e.preventDefault();routeTo(el.dataset.routeLink)}));
    $('#langToggle').addEventListener('click',()=>setLang(lang==='ar'?'en':'ar'));
    $('#menuToggle').addEventListener('click',()=>$('#mobileMenu').classList.contains('open')?closeMenu():openMenu());
    window.addEventListener('popstate',()=>routeTo(location.hash.replace('#','')||'home',false));
    $('#lightboxClose').addEventListener('click',closeLightbox);
    $('#lightbox').addEventListener('click',e=>{if(e.target.id==='lightbox')closeLightbox()});
    window.addEventListener('keydown',e=>{if(e.key==='Escape'){closeLightbox();closeMenu();}});

    $$('.portfolio-filters button').forEach(btn=>btn.addEventListener('click',()=>{
      $$('.portfolio-filters button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active'); currentFilter=btn.dataset.filter; renderPortfolio(currentFilter);
    }));

    $('#projectForm').addEventListener('submit',e=>{
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const msg = lang==='ar'
        ? `مرحباً مهندس أنس،\nالاسم: ${fd.get('name')}\nنوع المشروع: ${fd.get('type')}\nالمدينة: ${fd.get('city')||'-'}\nأهم الأحمال: ${fd.get('loads')||'-'}\nأريد استشارة مبدئية للمنظومة المناسبة.`
        : `Hello Eng. Anas,\nName: ${fd.get('name')}\nProject type: ${fd.get('type')}\nCity: ${fd.get('city')||'-'}\nMain loads: ${fd.get('loads')||'-'}\nI would like an initial recommendation for the suitable system.`;
      window.open(waLink(msg),'_blank','noopener');
    });
  }
  init();
})();