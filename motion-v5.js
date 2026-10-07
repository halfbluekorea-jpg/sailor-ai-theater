(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches || !('IntersectionObserver' in window)) return;
  const targets = document.querySelectorAll('.extra-card,.section-heading,.cast-console,.world-copy,.interlude-title,.cat-screen,.coming-copy,.last-sections h2,.creator-bio>section,.creator-name,.creator-role,.faq-list details,.creator-signoff,.presentation-section .section-heading,.about-grid>* , .project-facts,.source-links,.story-visual,.story-acts article,.ending-note,.film-frame,.movie-links,.making-intro>* , .craft-grid article,.tone-heading,.palette-grid article,.continuity-note');
  const observer = new IntersectionObserver(entries => {
    for (const e of entries) {
      e.target.classList.toggle('is-visible', e.isIntersecting);
    }
  }, {threshold:0.06, rootMargin:'0px 0px -30px 0px'});
  targets.forEach((el,i) => {
    el.classList.add('scroll-reveal');
    el.style.setProperty('--reveal-delay', `${(i%3)*65}ms`);
    observer.observe(el);
  });
  const panels = [...document.querySelectorAll('main>section,.last-sections>article')];
  const scenes = new IntersectionObserver(entries => {
    entries.forEach(e=>e.target.classList.toggle('scene-in',e.isIntersecting));
  },{threshold:0.05});
  panels.forEach(el=>{el.classList.add('motion-scene');scenes.observe(el);});
  const layers = [...document.querySelectorAll('.hero-bg,.world-bg,.ribbon span')];
  let frame = 0;
  function paint() {
    frame=0;
    if(reduce.matches) return;
    layers.forEach(el=>{
      const r=el.parentElement.getBoundingClientRect();
      if(r.bottom<0||r.top>innerHeight) return;
      const shift=Math.max(-36,Math.min(36,(innerHeight/2-r.top-r.height/2)*.065));
      el.style.setProperty('--scroll-shift', `${shift}px`);
    });
  }
  const schedule=()=>{if(!frame) frame=requestAnimationFrame(paint);};
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  reduce.addEventListener('change',()=>{
    if(reduce.matches){observer.disconnect(); scenes.disconnect();targets.forEach(el=>el.classList.add('is-visible'));panels.forEach(el=>el.classList.add('scene-in'));layers.forEach(el=>el.style.removeProperty('--scroll-shift'));}
  });
  schedule();
})();
