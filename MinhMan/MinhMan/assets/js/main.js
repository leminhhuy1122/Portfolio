

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

  { 
    // Auto-apply 'liquid' class to common presentation elements to enable liquid effect
    (function enableLiquid() {
      try {
        const selectors = [
          '.service-card',
          '.project-card',
          '.about-enhanced',
          '.hero-content',
          '.contact-info-area',
          '.image-main',
          '.stats-card',
          '.testimonial-card',
          '.service-vertical .service-card'
        ];
        const applied = new Set();
        selectors.forEach(s => {
          document.querySelectorAll(s).forEach(el => {
            if (!el.classList.contains('liquid')) {
              el.classList.add('liquid');
              applied.add(s);
            }
          });
        });

        // Track mouse position to update sheen center for visible liquid elements
        const liquids = () => Array.from(document.querySelectorAll('.liquid'));
        document.addEventListener('mousemove', e => {
          const liqs = liquids();
          if (!liqs.length) return;
          liqs.forEach(el => {
            const rect = el.getBoundingClientRect();
            // compute relative position inside element as percent
            const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100 || 50));
            const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100 || 40));
            el.style.setProperty('--liquid-x', x + '%');
            el.style.setProperty('--liquid-y', y + '%');
          });
        }, { passive: true });

        // gentle random movement for the body wood blotches (for older browsers that don't animate)
        let tick = 0;
        setInterval(() => {
          tick++;
          if (tick % 3 === 0) {
            document.documentElement.style.setProperty('--wood-offset-x', (Math.sin(tick / 20) * 2) + 'px');
          }
        }, 1200);
      } catch (err) {
        // fail silently if DOM not ready yet
        console.warn('Liquid init error', err);
      }
    })();
  }

  /* Smooth anchor scrolling with header offset + active nav highlighting */
  (function(){
    const header = document.getElementById('header');
    function headerHeight(){
      if(!header) return 86;
      const h = header.getBoundingClientRect().height;
      // add small breathing space
      return Math.round(h + 10);
    }

    // intercept in-page links and scroll with offset
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', function(e){
        const href = this.getAttribute('href');
        if(!href || href === '#') return;
        const target = document.querySelector(href);
        if(!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight();
        window.scrollTo({ top, behavior: 'smooth' });
        // update history (optional)
        if(history.replaceState) history.replaceState(null, '', href);
      });
    });

    // highlight nav item based on scroll position
    const navLinks = Array.from(document.querySelectorAll('#navmenu a'));
    const sections = navLinks.map(l => {
      const sel = l.getAttribute('href');
      return (sel && sel.startsWith('#')) ? document.querySelector(sel) : null;
    });

    function updateActive(){
      const offset = headerHeight() + 8;
      let activeId = null;
      for(const s of sections){
        if(!s) continue;
        if(s.getBoundingClientRect().top + window.pageYOffset - offset <= window.pageYOffset + 8){
          activeId = s.id;
        }
      }
      navLinks.forEach(l=>{
        const sel = l.getAttribute('href');
        l.classList.toggle('active', sel === ('#' + activeId));
      });
    }

    window.addEventListener('scroll', updateActive, { passive:true });
    window.addEventListener('resize', updateActive);
    // run once on load
    setTimeout(updateActive, 150);

  })();

  /* Hero 3D: follow-mouse tilt + autoplay slider */
  (function(){
    const wrap = document.getElementById('hero3d');
    if(!wrap) return;

    const container = wrap.querySelector('.hero-3d');
    const slides = Array.from(container.querySelectorAll('.slide'));
    const dotsContainer = document.getElementById('heroDots');
    let active = 0;
    let paused = false;
    let autoTimer = null;
    const count = slides.length;

    // build dots
    if(dotsContainer){
      slides.forEach((s,i)=>{
        const b = document.createElement('button');
        b.type = 'button';
        b.dataset.index = i;
        b.addEventListener('click', ()=> { goTo(i); restartAuto(); });
        dotsContainer.appendChild(b);
      });
    }

    // update transforms based on active index and mouse tilt
    let tiltX = 0, tiltY = 0;
    function updateTransforms(){
      slides.forEach((s,i)=>{
        // circular distance (-floor to +)
        let diff = i - active;
        if(diff > count/2) diff -= count;
        if(diff < -count/2) diff += count;
        const tx = diff * 170;               // horizontal offset
        const rz = -diff * 18;               // rotateY
        const scale = Math.max(0.6, 1 - Math.abs(diff) * 0.12);
        const z = 100 - Math.abs(diff);
        // apply mouse tilt only to centered-ish slide
        const tiltFactor = Math.abs(diff) < 0.9 ? 1 : 0.12;
        const rotateX = tiltX * tiltFactor;
        const rotateY = tiltY * tiltFactor;
        s.style.zIndex = z;
        s.style.transform = `translate3d(${tx}px, 0, 0) rotateY(${rz + rotateY}deg) rotateX(${rotateX}deg) scale(${scale})`;
        s.setAttribute('aria-hidden', Math.abs(diff) > 1.9 ? 'true' : 'false');
      });
      // update dots
      if(dotsContainer){
        Array.from(dotsContainer.children).forEach((b, idx)=> b.classList.toggle('active', idx===active));
      }
    }

    // pointer tracking -> tilt values (-12deg..12deg)
    function onPointer(e){
      const r = wrap.getBoundingClientRect();
      const cx = r.left + r.width/2;
      const cy = r.top + r.height/2;
      const dx = ( (e.clientX || (e.touches && e.touches[0].clientX)) - cx ) / (r.width/2);
      const dy = ( (e.clientY || (e.touches && e.touches[0].clientY)) - cy ) / (r.height/2);
      tiltY = Math.max(-12, Math.min(12, dx * 12));
      tiltX = Math.max(-8, Math.min(8, -dy * 8));
      updateTransforms();
    }

    // clear tilt gradually on leave
    function resetTilt(){
      tiltX = 0; tiltY = 0; updateTransforms();
    }

    // navigation
    function goTo(i){
      active = (i + count) % count;
      updateTransforms();
    }
    function next(){
      active = (active + 1) % count;
      updateTransforms();
    }

    // autoplay
    function startAuto(){
      if(autoTimer) clearInterval(autoTimer);
      autoTimer = setInterval(()=> { if(!paused) next(); }, 3500);
    }
    function restartAuto(){ paused = false; startAuto(); }

    // pause on hover / touch
    wrap.addEventListener('mouseenter', ()=> paused = true);
    wrap.addEventListener('mouseleave', ()=> { paused = false; resetTilt(); });
    wrap.addEventListener('touchstart', ()=> paused = true, {passive:true});
    wrap.addEventListener('touchend', ()=> { paused = false; resetTilt(); });

    // pointer move
    window.addEventListener('mousemove', onPointer, {passive:true});
    window.addEventListener('touchmove', onPointer, {passive:true});

    // initial placement and start
    updateTransforms();
    startAuto();

    // expose for debugging
    window.__hero3d = { goTo, next, startAuto, stop: ()=> clearInterval(autoTimer) };
  })();

  /* === Fix: ensure hero3d initializes after DOM ready and re-applies transforms === */
  document.addEventListener('DOMContentLoaded', function(){
    try{
      // if hero3d code already present (previously appended), call update once more
      if(window.__hero3d && typeof window.__hero3d.goTo === 'function'){
        // force reflow and call goTo(0) to set correct positions and aria-hidden
        setTimeout(()=> { window.__hero3d.goTo(0); window.__hero3d.startAuto && window.__hero3d.startAuto(); }, 80);
      }
      // ensure boxicons loaded (fallback): replace any missing <i class="bx ..."> with inline svg fallback class (no-op if loaded)
      // no heavy fallback here — just log if missing
      if(!document.querySelector('.bx')){
        console.warn('Boxicons not found; ensure CDN link in head is correct.');
      }
    }catch(e){
      console.warn('hero3d init fix error', e);
    }
  }, { once:true });

  /* small: ensure name-rainbow visible if scripts changed class names */
  (function(){
    const el = document.querySelector('.name-rainbow');
    if(el){
      // force repaint for browsers that sometimes don't apply background-clip on dynamic content
      el.style.transform = 'translateZ(0)';
      setTimeout(()=> el.style.transform = '', 120);
    }
  })();

})();

/* Hero 3D carousel: autoplay + mouse tilt + parallax */
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const wrap = document.querySelector('.hero-3d-wrap');
    const stage = document.querySelector('.hero-3d');
    const slides = Array.from(document.querySelectorAll('.hero-3d .slide'));
    const dotsContainer = document.getElementById('heroDots');
    if(!wrap || !stage || slides.length === 0) return;

    const N = slides.length;
    let idx = 0;
    let raf = null;
    let autoplayTimer = null;
    const spacing = Math.min(260, Math.max(160, Math.round(wrap.clientWidth * 0.14)));

    // create dots
    if(dotsContainer){
      dotsContainer.innerHTML = '';
      slides.forEach((_, i)=>{
        const b = document.createElement('button');
        b.type = 'button';
        b.addEventListener('click', ()=>{ goTo(i); resetAutoplay(); });
        dotsContainer.appendChild(b);
      });
    }

    function setTransforms(){
      for(let i=0;i<N;i++){
        const slide = slides[i];
        // compute distance (-floor to +)
        let d = i - idx;
        // wrap shortest direction
        if(d > N/2) d -= N;
        if(d < -N/2) d += N;
        const absd = Math.abs(d);
        const tx = d * spacing;
        const tz = -Math.min(400, Math.abs(d) * 140);
        const ry = d * -8;
        const scale = Math.max(0.86, 1 - absd*0.06);
        const opacity = absd > 2 ? 0 : 1 - (absd * 0.22);

        slide.style.transform = `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`;
        slide.style.opacity = opacity;
        slide.classList.toggle('active', Math.abs(d) < 1.1);
      }

      // update dots
      if(dotsContainer){
        Array.from(dotsContainer.children).forEach((b,i)=> b.classList.toggle('active', i===idx));
      }
    }

    function goTo(i){
      idx = (i % N + N) % N;
      setTransforms();
    }
    function next(){
      goTo(idx+1);
    }
    function prev(){ goTo(idx-1); }

    // autoplay
    function startAutoplay(){ stopAutoplay(); autoplayTimer = setInterval(next, 3500); }
    function stopAutoplay(){ if(autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; } }
    function resetAutoplay(){ stopAutoplay(); setTimeout(startAutoplay, 1800); }

    // mouse tilt + parallax
    let lastX = 0, lastY = 0;
    wrap.addEventListener('mousemove', (e)=>{
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=>{
        const rect = wrap.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width; // 0..1
        const py = (e.clientY - rect.top) / rect.height;
        const normX = (px - 0.5) * 2; // -1 .. 1
        const normY = (py - 0.5) * 2;

        const rotY = normX * 10; // degrees
        const rotX = -normY * 8;

        stage.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;

        // slight parallax on images inside slides
        slides.forEach((slide, i)=>{
          const img = slide.querySelector('img');
          if(!img) return;
          const depth = (i - idx);
          // smaller movement for farther slides
          const moveX = -normX * (12 - Math.min(10, Math.abs(depth)*2));
          const moveY = -normY * (8 - Math.min(6, Math.abs(depth)*1.2));
          img.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(${1 + Math.max(0, (1 - Math.abs(depth))*0.02)})`;
        });

        lastX = e.clientX; lastY = e.clientY;
      });
    });

    wrap.addEventListener('mouseleave', ()=>{
      // smooth reset
      stage.style.transition = 'transform 700ms cubic-bezier(.2,.9,.2,1)';
      stage.style.transform = 'rotateX(0deg) rotateY(0deg)';
      slides.forEach(s=>{
        const img = s.querySelector('img');
        if(img) img.style.transform = '';
      });
      setTimeout(()=> stage.style.transition = '', 700);
    });

    // keyboard optional
    wrap.addEventListener('click', ()=> next());

    // init
    setTransforms();
    startAutoplay();

    // pause on hover for touch devices & when interacting
    wrap.addEventListener('mouseenter', ()=> { stopAutoplay(); });
    wrap.addEventListener('touchstart', ()=> { stopAutoplay(); }, {passive:true});
    document.addEventListener('visibilitychange', ()=> { if(document.hidden) stopAutoplay(); else startAutoplay(); });

    // responsive recompute spacing on resize
    window.addEventListener('resize', ()=> {
      // recompute spacing if you want adaptive...
    }, { passive: true });

  });
})();

/* Hero 3D carousel init: autoplay, mouse tilt, dots/arrows */
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const wrap = document.getElementById('hero3d');
    if(!wrap) return;
    const stage = wrap.querySelector('.hero-3d');
    const slides = Array.from(wrap.querySelectorAll('.slide'));
    const dotsWrap = wrap.querySelector('#heroDots');
    const prevBtn = wrap.querySelector('.hero-arrow.prev');
    const nextBtn = wrap.querySelector('.hero-arrow.next');
    const N = slides.length;
    if(N === 0) return;

    // prepare structure & set data-index
    slides.forEach((s,i)=> s.dataset.index = i);

    // create dots if not exist
    if(dotsWrap && dotsWrap.children.length === 0){
      for(let i=0;i<N;i++){
        const b = document.createElement('button');
        b.type = 'button';
        b.addEventListener('click', ()=> goTo(i));
        dotsWrap.appendChild(b);
      }
    }

    let index = 0;
    let autoplay = null;
    function clampIndex(i){ return ((i%N)+N)%N; }

    function setPositions(){
      const spacing = Math.round(wrap.clientWidth * 0.14);
      for(let i=0;i<N;i++){
        const slide = slides[i];
        let d = i - index;
        if(d > N/2) d -= N;
        if(d < -N/2) d += N;
        const absd = Math.abs(d);
        const tx = d * spacing;
        const tz = -Math.min(420, absd * 140);
        const ry = d * -8;
        const scale = Math.max(0.82, 1 - absd*0.06);
        const opacity = absd > 2 ? 0 : 1 - (absd * 0.22);
        slide.style.transform = `translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`;
        slide.style.opacity = opacity;
        slide.classList.toggle('active', Math.abs(d) < 0.9);
        slide.classList.toggle('side', Math.abs(d) >= 1);
      }
      // update dots
      if(dotsWrap) Array.from(dotsWrap.children).forEach((b,i)=> b.classList.toggle('active', i===index));
    }

    function goTo(i){
      index = clampIndex(i);
      setPositions();
      resetAutoplay();
    }
    function next(){ goTo(index+1); }
    function prev(){ goTo(index-1); }

    // autoplay
    function startAutoplay(){ stopAutoplay(); autoplay = setInterval(next, 3800); }
    function stopAutoplay(){ if(autoplay){ clearInterval(autoplay); autoplay = null; } }
    function resetAutoplay(){ stopAutoplay(); setTimeout(startAutoplay, 1800); }

    // arrows
    if(nextBtn) nextBtn.addEventListener('click', ()=> next());
    if(prevBtn) prevBtn.addEventListener('click', ()=> prev());

    // keyboard
    wrap.addEventListener('keydown', (e)=> {
      if(e.key === 'ArrowRight') next();
      if(e.key === 'ArrowLeft') prev();
    });

    // mouse tilt + parallax on images
    let raf = null;
    wrap.addEventListener('mousemove', (e)=>{
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(()=>{
        const r = wrap.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width; // 0..1
        const py = (e.clientY - r.top) / r.height;
        const nx = (px - 0.5) * 2; // -1..1
        const ny = (py - 0.5) * 2;
        const rotY = nx * 8;
        const rotX = -ny * 6;
        stage.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;

        slides.forEach((s,i)=>{
          const img = s.querySelector('.slide-img');
          if(!img) return;
          const depth = i - index;
          let moveX = -nx * Math.max(8, 12 - Math.abs(depth)*2);
          let moveY = -ny * Math.max(6, 10 - Math.abs(depth)*1.2);
          img.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(${1 + Math.max(0, (1 - Math.abs(depth))*0.02)})`;
        });
      });
    });

    wrap.addEventListener('mouseleave', ()=>{
      stage.style.transition = 'transform 700ms cubic-bezier(.2,.9,.2,1)';
      stage.style.transform = 'rotateX(0deg) rotateY(0deg)';
      slides.forEach(s=> {
        const img = s.querySelector('.slide-img');
        if(img) img.style.transform = '';
      });
      setTimeout(()=> stage.style.transition = '', 700);
    });

    // click/tap advances
    wrap.addEventListener('click', (e)=>{
      // ignore clicks on controls
      if(e.target.closest('.hero-arrow') || e.target.closest('#heroDots')) return;
      next();
    });

    // init
    setPositions();
    startAutoplay();

    // pause on hover/touch
    wrap.addEventListener('mouseenter', ()=> stopAutoplay());
    wrap.addEventListener('touchstart', ()=> stopAutoplay(), {passive:true});
    document.addEventListener('visibilitychange', ()=> document.hidden ? stopAutoplay() : startAutoplay() );

    // responsive reposition on resize
    let resizeTimer;
    window.addEventListener('resize', ()=> {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(()=> setPositions(), 120);
    });

  });
})();

/* Orbiting skill init */
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const wrap = document.querySelector('.orbit-wrap');
    if(!wrap) return;
    const rings = Array.from(document.querySelectorAll('.orbit-ring'));
    const core = document.getElementById('orbitCore');
    const slowBtn = document.getElementById('orbitSlowBtn');
    const info = document.getElementById('orbitInfo');
    const fills = Array.from(document.querySelectorAll('.skill-row .fill'));
    // place items around rings evenly
    rings.forEach((ring)=>{
      const items = Array.from(ring.querySelectorAll('.orb-item'));
      const Rw = ring.offsetWidth/2;
      const Rh = ring.offsetHeight/2;
      items.forEach((it, idx)=>{
        const angle = (360 / items.length) * idx; // degrees
        // position: rotate then translate radius then counter-rotate the icon so it stays upright
        const rad = (angle * Math.PI) / 180;
        const radius = (Math.min(Rw,Rh) * 0.75);
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        it.style.transform = `translate(${x}px, ${y}px)`;
      });
    });

    // function to set skill fills with target values
    const SKILLS = { HTML:80, "JavaScript":50, CSS:60, React:30, MySQL:70, "Node.js":20 };

    function showInfo(){
      if(!info) return;
      info.hidden = false;
      // animate fills
      fills.forEach(f=>{
        const id = f.dataset.id;
        const target = SKILLS[id] || 0;
        f.style.width = target + '%';
        const valEl = f.parentElement.querySelector('.val');
        if(valEl) valEl.textContent = target + '%';
      });
    }

    function hideInfo(){
      if(!info) return;
      // reset fills
      fills.forEach(f=>{
        f.style.width = '0%';
        const valEl = f.parentElement.querySelector('.val');
        if(valEl) valEl.textContent = '0%';
      });
      info.hidden = true;
    }

    // slow / pause toggle
    let slowed = false;
    slowBtn.addEventListener('click', ()=>{
      slowed = !slowed;
      wrap.classList.toggle('slow', slowed);
      // when slowed show info and animate bars
      if(slowed) showInfo(); else hideInfo();
    });

    // click core toggles global pause/resume
    let paused = false;
    core.addEventListener('click', ()=>{
      paused = !paused;
      wrap.classList.toggle('paused', paused);
      core.setAttribute('aria-pressed', paused ? 'true' : 'false');
      // if paused also reveal values
      if(paused) showInfo(); else hideInfo();
    });
    core.addEventListener('keydown', (e)=> { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); core.click(); } });

    // clicking any orb-item shows that single skill value quickly
    document.querySelectorAll('.orb-item').forEach(it=>{
      it.addEventListener('click', (ev)=>{
        // flash info and show that skill only
        const skill = it.dataset.skill;
        // set fills: show only clicked skill full, others zero
        fills.forEach(f=>{
          const id = f.dataset.id;
          const tgt = (id === skill) ? (SKILLS[id]||0) : 0;
          f.style.width = tgt + '%';
          const valEl = f.parentElement.querySelector('.val');
          if(valEl) valEl.textContent = tgt + '%';
        });
        info.hidden = false;
        // slow rotation briefly
        wrap.classList.add('slow');
        setTimeout(()=> wrap.classList.remove('slow'), 2200);
      });
    });

    // responsive: recalc positions on resize
    let t;
    window.addEventListener('resize', ()=>{
      clearTimeout(t); t = setTimeout(()=>{
        rings.forEach((ring)=>{
          const items = Array.from(ring.querySelectorAll('.orb-item'));
          const Rw = ring.offsetWidth/2; const Rh = ring.offsetHeight/2;
          items.forEach((it, idx)=>{
            const angle = (360 / items.length) * idx;
            const rad = (angle * Math.PI) / 180;
            const radius = (Math.min(Rw,Rh) * 0.75);
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
            it.style.transform = `translate(${x}px, ${y}px)`;
          });
        });
      }, 120);
    });

  });
})();

/* Skills: animate progress on enter + hover interactivity */
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const bars = Array.from(document.querySelectorAll('.skill-card .bar'));
    const rows = Array.from(document.querySelectorAll('.skill-card .prog-row'));
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          // animate bars within visible card
          entry.target.querySelectorAll('.bar').forEach(b=>{
            const target = parseInt(b.dataset.target || b.getAttribute('data-target') || 0, 10);
            b.style.width = target + '%';
            // update pct text
            const pct = b.closest('.prog-row').querySelector('.pct');
            if(pct) pct.textContent = target + '%';
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    // observe each skill-card
    document.querySelectorAll('.skill-card').forEach(card => observer.observe(card));

    // hover: pulse gradient of bar and show exact percent tooltip-like
    rows.forEach(r=>{
      r.addEventListener('mouseenter', ()=>{
        const b = r.querySelector('.bar');
        r.classList.add('hovered');
        if(b){
          b.style.transition = 'width 300ms ease, filter 300ms ease';
          b.style.filter = 'brightness(1.12) saturate(1.15)';
        }
      });
      r.addEventListener('mouseleave', ()=>{
        const b = r.querySelector('.bar');
        r.classList.remove('hovered');
        if(b){
          b.style.filter = '';
        }
      });
    });

    // small color cycling for .auto-glow bars to match card glow
    const glowKeyframes = [
      { background: 'linear-gradient(90deg,#b67834,#ff9f43)' },
      { background: 'linear-gradient(90deg,#8e44ad,#ff6b6b)' },
      { background: 'linear-gradient(90deg,#7b4bff,#ff5da1)' }
    ];
    const glowEls = Array.from(document.querySelectorAll('.auto-glow .bar'));
    if(window.Element && glowEls.length){
      // animate using setInterval fallback
      let gi = 0;
      setInterval(()=> {
        gi = (gi+1) % glowKeyframes.length;
        glowEls.forEach(el => el.style.background = glowKeyframes[gi].background);
      }, 4200);
    }

  });
})();