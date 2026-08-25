
(function(){
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* zer0noise-style transitions: mark internal navigations */
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href]');
    if(!a) return;
    var h = a.getAttribute('href')||'';
    if(h.indexOf('#/')===0 || /\.html($|#)/.test(h)){
      try{ sessionStorage.setItem('tz-nav','1'); }catch(err){}
      document.documentElement.style.opacity='0';   /* hard cut out */
    }
  }, true);
  var CAME_FROM_NAV = false;
  try{ CAME_FROM_NAV = sessionStorage.getItem('tz-nav')==='1'; sessionStorage.removeItem('tz-nav'); }catch(err){}
  document.documentElement.style.opacity='';

  if(reduced || !window.gsap){ document.documentElement.classList.add('reduced'); }

  function tick(){
    try{
      var t=new Intl.DateTimeFormat('en-US',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'America/New_York'}).format(new Date());
      var el=document.getElementById('clock'); if(el) el.textContent=t;
    }catch(e){}
  }
  tick(); setInterval(tick,30000);

  document.querySelectorAll('[data-illuminate]').forEach(function(p){
    function splitNode(node,accent){
      if(node.nodeType===3){
        var frag=document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function(part){
          if(/^\s+$/.test(part)||part===''){frag.appendChild(document.createTextNode(part));}
          else{var s=document.createElement('span');s.className='w'+(accent?' accent':'');s.textContent=part;frag.appendChild(s);}
        });
        node.parentNode.replaceChild(frag,node);
      }else if(node.nodeType===1){
        var isA=accent||node.hasAttribute('data-accent');
        Array.prototype.slice.call(node.childNodes).forEach(function(c){splitNode(c,isA);});
      }
    }
    Array.prototype.slice.call(p.childNodes).forEach(function(c){splitNode(c,false);});
  });

  if(reduced || !window.gsap){
    document.querySelectorAll('.w').forEach(function(w){w.classList.add('lit');});
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  var EASE='expo.out';

  if(window.Lenis){
    var lenis=new Lenis({anchors:true});
    lenis.on('scroll',ScrollTrigger.update);
    gsap.ticker.add(function(t){lenis.raf(t*1000);});
    gsap.ticker.lagSmoothing(0);
  }

  if(matchMedia('(hover:hover)').matches){
    document.querySelectorAll('.cta-gold,.cta-dark').forEach(function(el){
      var qx=gsap.quickTo(el,'x',{duration:.4,ease:'power3.out'});
      var qy=gsap.quickTo(el,'y',{duration:.4,ease:'power3.out'});
      el.addEventListener('pointermove',function(e){
        var r=el.getBoundingClientRect();
        qx((e.clientX-r.left-r.width/2)*.22);
        qy((e.clientY-r.top-r.height/2)*.3);
      });
      el.addEventListener('pointerleave',function(){qx(0);qy(0);});
    });
  }

  document.fonts.ready.then(function(){
    /* load: frame scales in like IB, plate text rises */

    if(CAME_FROM_NAV){
      /* ZERO NOISE deal-in: blank, then hard-cut elements one by one */
      var seen=[], sels='main .chip, main .crumb, main h1, main .page-hero .lede, main .hero-frame, main .statement, main .st-sub, main .hero-actions, main .card, main .prod-card, main .frame, main .stile, main .two-col > div, main .aud, main .feat, main .row, main .ledger, main .cta-band h2, main .cta-band p, main .cta-band .cta-gold, main .media-grid > *, main .serif-say p, main .contact h2, main .contact p, main .contact .cta-gold';
      document.querySelectorAll(sels).forEach(function(el){
        if(el.closest('[data-dealt]')) return;
        var r=el.getBoundingClientRect();
        if(r.top < innerHeight*1.5){ el.setAttribute('data-dealt','1'); seen.push(el); }
      });
      /* neutralize soft-reveal initial states so cuts are clean */
      seen.forEach(function(el){
        el.classList.remove('fade'); 
        el.querySelectorAll('.fade').forEach(function(f){f.classList.remove('fade');});
        el.querySelectorAll('.oline>span').forEach(function(s){s.style.transform='none';});
      });
      gsap.set(seen,{autoAlpha:0});
      gsap.set('header .fade',{opacity:1,y:0});
      var dtl=gsap.timeline();
      seen.forEach(function(el,i){
        dtl.set(el,{autoAlpha:1}, 0.12 + i*0.085);
      });
      dtl.to('body',{duration:.001},0);
    }
    var tl=gsap.timeline({defaults:{ease:EASE}});
    if(!CAME_FROM_NAV)
    if(document.getElementById('heroFrame')){
      tl.fromTo('#heroFrame',{clipPath:'inset(3% 3% 3% 3% round 16px)',scale:.985},{clipPath:'inset(0% 0% 0% 0% round 16px)',scale:1,duration:1.4},0);
      tl.to('header .fade',{opacity:1,y:0,duration:.8,stagger:.08},.2);
      tl.to('.hero-plate h1 .oline>span',{y:0,duration:1.05,stagger:.12},.5);
      tl.to('.hero-coin,.hero-scroll',{opacity:1,y:0,duration:.8,stagger:.1},.8);
      gsap.to('.hero-frame img',{yPercent:6,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
    } else {
      tl.to('header .fade',{opacity:1,y:0,duration:.8,stagger:.08},0);
      var ph=document.querySelector('.page-hero h1');
      if(ph){
        var inner=document.createElement('span');inner.style.display='inline-block';
        while(ph.firstChild)inner.appendChild(ph.firstChild);
        ph.appendChild(inner);ph.style.overflow='hidden';ph.style.paddingBottom='.14em';ph.style.marginBottom='-.14em';
        gsap.set(inner,{yPercent:112});
        tl.to(inner,{yPercent:0,duration:1.05},.2);
      }
      tl.to('.page-hero .fade',{opacity:1,y:0,duration:.9,stagger:.1},.55);
    }

    gsap.utils.toArray('main .fade, footer .fade').forEach(function(el){
      if(el.closest('header'))return;
      gsap.to(el,{opacity:1,y:0,duration:1,ease:EASE,scrollTrigger:{trigger:el,start:'top 88%'}});
    });

    /* section titles mask rise */
    document.querySelectorAll('.sec-head h2, .contact h2').forEach(function(t){
      if(t.closest('[data-dealt]')||t.hasAttribute('data-dealt'))return;
      t.classList.remove('fade');
      var inner=document.createElement('span');
      inner.style.display='inline-block';
      while(t.firstChild)inner.appendChild(t.firstChild);
      t.appendChild(inner);t.style.overflow='hidden';
      gsap.set(t,{opacity:1,y:0});
      gsap.set(inner,{yPercent:112});
      gsap.to(inner,{yPercent:0,duration:1.1,ease:EASE,scrollTrigger:{trigger:t,start:'top 87%'}});
    });

    /* illumination (dialedweb 1:1) */
    document.querySelectorAll('[data-illuminate]').forEach(function(p){
      var words=p.querySelectorAll('.w');
      ScrollTrigger.create({
        trigger:p,start:'top 80%',end:'bottom 48%',scrub:.6,
        onUpdate:function(self){
          var n=Math.floor(self.progress*words.length);
          words.forEach(function(w,i){w.classList.toggle('lit',i<=n);});
        }
      });
    });

    /* payy tiles rise */
    gsap.from('.stile',{y:34,opacity:0,duration:.9,ease:EASE,stagger:.12,
      scrollTrigger:{trigger:'.stat-tiles',start:'top 85%'}});

    gsap.from('.bars i',{scaleY:0,duration:.9,ease:EASE,stagger:.05,
      scrollTrigger:{trigger:'.signal',start:'top 85%'}});

    /* image frames clip reveal */
    gsap.utils.toArray('.labs-side .frame, .media-img, .ven-img').forEach(function(f){
      if(f.closest('[data-dealt]')||f.hasAttribute('data-dealt'))return;
      f.classList.remove('fade');
      gsap.set(f,{opacity:1,y:0});
      gsap.fromTo(f,{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(0 0 0% 0)',duration:1.2,ease:EASE,
        scrollTrigger:{trigger:f,start:'top 84%'}});
    });

    gsap.from('.foot-word',{yPercent:50,duration:1.2,ease:EASE,
      scrollTrigger:{trigger:'footer',start:'top 80%'}});
  });
})();
