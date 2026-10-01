(() => {
 'use strict';
 const root=document.getElementById('site-intro');
 if(!root)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const yes=root.querySelector('.intro-yes');
 const no=root.querySelector('.intro-no');
 const skip=root.querySelector('.intro-skip');
 const hint=root.querySelector('.intro-hint');
 const replay=document.querySelector('.intro-replay');
 let active=false,leaving=false,started=false,manual=false,timers=[],priorFocus=null,fromReplay=false;
 function later(fn,ms){const id=setTimeout(fn,ms);timers.push(id);return id;}
 function clearTimers(){timers.forEach(clearTimeout);timers=[];}
 function unlock(){
  document.querySelectorAll('[data-intro-inert]').forEach(el=>{el.inert=false;el.removeAttribute('data-intro-inert');});
  document.documentElement.classList.remove('intro-pending');
 }
 function cleanup(){
  clearTimeout(window.__phoneIntroWatchdog);clearTimers();unlock();
  root.hidden=true;root.setAttribute('aria-hidden','true');root.className='';
  active=false;leaving=false;started=false;
  if(fromReplay&&priorFocus?.isConnected)priorFocus.focus({preventScroll:true});
  else if(document.activeElement===root||root.contains(document.activeElement)){
   const home=document.querySelector('.hero h1');if(home){home.setAttribute('tabindex','-1');home.focus({preventScroll:true});}
  }
 }
 function finish(animate=false){
  if(!active||leaving)return;
  leaving=true;clearTimers();clearTimeout(window.__phoneIntroWatchdog);
  if(animate&&!reduced.matches){
   root.classList.add('intro-selected','intro-burst');
   later(()=>root.classList.add('intro-leaving'),120);
   later(()=>cleanup(),540);
  }else cleanup();
 }
 function pauseAuto(){
  if(!active||leaving||manual)return;
  manual=true;clearTimers();clearTimeout(window.__phoneIntroWatchdog);
  hint.textContent='1 / Enter로 입장 · 2 / Esc로 건너뛰기';
 }
 function start(){
  if(!active||started||leaving)return;
  started=true;clearTimers();clearTimeout(window.__phoneIntroWatchdog);
  root.classList.add('intro-ready');
  if(reduced.matches){root.classList.add('intro-reduced');pauseAuto();return;}
  if(manual)return;
  later(()=>root.classList.add('intro-selected'),3500);
  later(()=>{root.classList.add('intro-burst');},4100);
  later(()=>{leaving=true;root.classList.add('intro-leaving');},4440);
  later(()=>cleanup(),4860);
 }
 function open(isReplay=false){
  if(active)return;
  fromReplay=isReplay;priorFocus=document.activeElement;
  active=true;leaving=false;started=false;manual=false;clearTimers();
  root.hidden=false;root.setAttribute('aria-hidden','false');root.className='';
  document.documentElement.classList.add('intro-pending');
  [...document.body.children].forEach(el=>{
   if(el!==root&&!['SCRIPT','STYLE','LINK'].includes(el.tagName)&&!el.inert){el.inert=true;el.setAttribute('data-intro-inert','');}
  });
  hint.textContent='잠시 후 입장합니다 · 1 / Enter로 바로 입장';
  root.focus({preventScroll:true});
  const image=new Image();
  image.onload=start;
  image.onerror=()=>cleanup();
  image.src='assets/intro-phone-v6.png';
  if(image.complete&&image.naturalWidth)start();
  else later(()=>{if(!started)cleanup();},1100);
 }
 yes.addEventListener('click',()=>finish(true));
 no.addEventListener('click',()=>finish(false));
 skip.addEventListener('click',()=>finish(false));
 root.addEventListener('pointerdown',pauseAuto);
 root.addEventListener('focusin',e=>{if(e.target!==root)pauseAuto();});
 root.addEventListener('keydown',e=>{
  if(!active||leaving)return;
  if(e.key==='Escape'||e.key==='2'){e.preventDefault();finish(false);return;}
  if(e.key==='1'){e.preventDefault();finish(true);return;}
  if(e.key==='Enter'&&e.target===root){e.preventDefault();finish(true);return;}
  if(e.key==='Tab'){
   pauseAuto();
   const buttons=[skip,yes,no];const first=buttons[0],last=buttons[buttons.length-1];
   if(e.shiftKey&&(document.activeElement===first||document.activeElement===root)){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&(document.activeElement===last||document.activeElement===root)){e.preventDefault();first.focus();}
  }
 });
 reduced.addEventListener('change',()=>{if(reduced.matches&&active)finish(false);});
 replay?.addEventListener('click',()=>open(true));
 if(document.documentElement.classList.contains('intro-pending')){
  try{open();}catch(e){cleanup();}
 }else{root.hidden=true;root.setAttribute('aria-hidden','true');}
 addEventListener('pagehide',()=>{if(active)cleanup();});
 addEventListener('pageshow',e=>{if(e.persisted&&active)cleanup();});
})();