
/* RankXCL shared FX engine */
(function(){
  // Cursor
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx=-999,my=-999,rx=-999,ry=-999;
  document.addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    if(cursor){cursor.style.left=mx+'px';cursor.style.top=my+'px';}
  });
  (function animRing(){
    rx+=(mx-rx)*.12;ry+=(my-ry)*.12;
    if(ring){ring.style.left=rx+'px';ring.style.top=ry+'px';}
    requestAnimationFrame(animRing);
  })();

  // Canvas
  const canvas=document.getElementById('fx-canvas');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
  resize(); window.addEventListener('resize',resize);

  const FX={
    calls:{label:'CALL',draw(c,p){c.save();c.globalAlpha=p.life;c.translate(p.x,p.y);c.strokeStyle='#c9501a';c.lineWidth=1.5;c.beginPath();c.arc(0,0,p.size+2,0,Math.PI*2);c.stroke();c.fillStyle='#c9501a';c.font=(p.size*1.8)+'px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('☎',0,1);c.restore();}},
    leads:{label:'LEAD',draw(c,p){c.save();c.globalAlpha=p.life;c.translate(p.x,p.y);c.rotate(p.rot);c.fillStyle='rgba(201,80,26,'+(p.life*.9)+')';const w=p.size*3,h=p.size*2;c.fillRect(-w/2,-h/2,w,h);c.strokeStyle='#f2ede4';c.lineWidth=.5;c.strokeRect(-w/2,-h/2,w,h);c.fillStyle='#f2ede4';c.fillRect(-w/2+2,-h/2+3,w-4,1);c.fillRect(-w/2+2,-h/2+6,w*.6,1);c.restore();}},
    revenue:{label:'REVENUE',draw(c,p){c.save();c.globalAlpha=p.life;c.translate(p.x,p.y);c.fillStyle='rgba(201,80,26,'+p.life+')';c.beginPath();c.arc(0,0,p.size+2,0,Math.PI*2);c.fill();c.fillStyle='rgba(242,237,228,0.9)';c.font='bold '+(p.size+2)+'px monospace';c.textAlign='center';c.textBaseline='middle';c.fillText('$',0,0);c.restore();}},
    visibility:{label:'VISIBLE',draw(c,p){c.save();c.globalAlpha=p.life;c.translate(p.x,p.y);for(let r=0;r<3;r++){const rad=(p.size+r*p.size*1.2)*(1+(1-p.life)*.5);c.strokeStyle='rgba(201,80,26,'+(p.life*(.7-r*.2))+')';c.lineWidth=1;c.beginPath();c.arc(0,0,rad,-Math.PI*.8,Math.PI*.8);c.stroke();}c.fillStyle='#c9501a';c.beginPath();c.arc(0,0,p.size*.5,0,Math.PI*2);c.fill();c.restore();}},
    alignment:{label:'ALIGN',draw(c,p){c.save();c.globalAlpha=p.life;c.translate(p.x,p.y);c.rotate(p.rot);const r=p.size+2,t=6;c.strokeStyle='#c9501a';c.lineWidth=1.5;c.beginPath();for(let i=0;i<t*2;i++){const a=(Math.PI*2*i)/(t*2),rad=i%2===0?r:r*.7;i===0?c.moveTo(Math.cos(a)*rad,Math.sin(a)*rad):c.lineTo(Math.cos(a)*rad,Math.sin(a)*rad);}c.closePath();c.stroke();c.beginPath();c.arc(0,0,r*.35,0,Math.PI*2);c.stroke();c.restore();}},
    tracking:{label:'TRACK',draw(c,p){c.save();c.globalAlpha=p.life;c.translate(p.x,p.y);const s=5;for(let i=0;i<s;i++){const t=i/s,px=(i-s/2)*p.size*1.2,py=-Math.sin(t*Math.PI+p.extra*2)*p.size*2;c.fillStyle='rgba(201,80,26,'+(.4+t*.6)+')';c.beginPath();c.arc(px,py,p.size*.5,0,Math.PI*2);c.fill();if(i<s-1){const px2=((i+1)-s/2)*p.size*1.2,py2=-Math.sin((i+1)/s*Math.PI+p.extra*2)*p.size*2;c.strokeStyle='rgba(201,80,26,'+(p.life*.4)+')';c.lineWidth=1;c.beginPath();c.moveTo(px,py);c.lineTo(px2,py2);c.stroke();}}c.restore();}},
    conversion:{label:'CONVERT',draw(c,p){c.save();c.globalAlpha=p.life;c.translate(p.x,p.y);c.rotate(p.rot*.2);c.strokeStyle='#c9501a';c.lineWidth=1.5;c.lineCap='round';c.beginPath();c.moveTo(0,0);c.lineTo(0,p.size*2);c.lineTo(p.size*.6,p.size*1.4);c.lineTo(p.size,p.size*2.5);c.stroke();for(let i=0;i<6;i++){const a=Math.PI*2*i/6;c.strokeStyle='rgba(201,80,26,'+(p.life*.5)+')';c.lineWidth=1;c.beginPath();c.moveTo(Math.cos(a)*p.size*.8,Math.sin(a)*p.size*.8);c.lineTo(Math.cos(a)*p.size*1.8,Math.sin(a)*p.size*1.8);c.stroke();}c.restore();}},
    traffic:{label:'TRAFFIC',draw(c,p){c.save();c.globalAlpha=p.life;c.translate(p.x,p.y);c.strokeStyle='#c9501a';c.lineWidth=2;c.lineCap='round';c.beginPath();c.moveTo(-p.size*1.5,p.size);c.lineTo(0,-p.size);c.lineTo(p.size*1.5,-p.size*2.5);c.stroke();c.fillStyle='#c9501a';c.beginPath();c.moveTo(p.size*1.5,-p.size*2.5);c.lineTo(p.size*.8,-p.size*1.5);c.lineTo(p.size*2.2,-p.size*1.8);c.closePath();c.fill();c.restore();}},
    rankings:{label:'RANKING',draw(c,p){c.save();c.globalAlpha=p.life;const h=p.size*(1+p.extra*2),w=p.size*1.5;c.fillStyle='rgba(201,80,26,'+p.life+')';c.fillRect(p.x-w/2,p.y-h,w,h);c.fillStyle='#c9501a';c.font='bold '+(p.size+3)+'px monospace';c.textAlign='center';c.fillText('▲',p.x,p.y-h-3);c.restore();}},
    search:{label:'SEARCH',draw(c,p){c.save();c.globalAlpha=p.life;c.translate(p.x,p.y);c.rotate(p.rot);c.strokeStyle='#c9501a';c.lineWidth=1.5;c.beginPath();c.arc(0,0,p.size+1,0,Math.PI*2);c.stroke();c.beginPath();c.moveTo((p.size+1)*.7,(p.size+1)*.7);c.lineTo((p.size+1)*1.5,(p.size+1)*1.5);c.stroke();c.restore();}}
  };
  const particles=[];
  function spawn(x,y,type,n){for(let i=0;i<n;i++){const a=(Math.PI*2*i/n)+Math.random()*.5,sp=1.5+Math.random()*3;particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-Math.random()*2,life:1,decay:.012+Math.random()*.018,type,size:2+Math.random()*4,rot:Math.random()*Math.PI*2,rotV:(Math.random()-.5)*.15,extra:Math.random()});}}
  const amb=[];
  function render(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if(mx>0&&Math.random()<.22){amb.push({x:mx+(Math.random()-.5)*50,y:my+(Math.random()-.5)*50,vx:(Math.random()-.5)*.4,vy:-.3-Math.random()*.6,life:.5+Math.random()*.35,decay:.016+Math.random()*.02,size:1+Math.random()*2});}
    for(let i=amb.length-1;i>=0;i--){const p=amb[i];p.x+=p.vx;p.y+=p.vy;p.life-=p.decay;if(p.life<=0){amb.splice(i,1);continue;}ctx.save();ctx.globalAlpha=p.life*.35;ctx.fillStyle='#c9501a';ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();ctx.restore();}
    for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.04;p.vx*=.98;p.rot+=p.rotV;p.life-=p.decay;if(p.life<=0){particles.splice(i,1);continue;}if(FX[p.type])FX[p.type].draw(ctx,p);}
    requestAnimationFrame(render);
  }
  render();

  // Magic words
  const tip=document.getElementById('fx-tip');
  const cds={};
  function bindMagic(){
    document.querySelectorAll('.magic-word:not([data-bound])').forEach(el=>{
      el.dataset.bound='1';
      const type=el.dataset.fx||'rankings';
      if(!FX[type])return;
      el.addEventListener('mouseenter',e=>{
        if(tip){tip.style.opacity='1';tip.textContent=FX[type].label;}
        const now=Date.now();if(cds[type]&&now-cds[type]<500)return;cds[type]=now;
        const r=el.getBoundingClientRect();spawn(r.left+r.width/2,r.top+r.height/2,type,10+Math.floor(Math.random()*6));
      });
      el.addEventListener('mouseleave',()=>{if(tip)tip.style.opacity='0';});
      el.addEventListener('mousemove',e=>{if(tip){tip.style.left=(e.clientX+14)+'px';tip.style.top=(e.clientY-18)+'px';}});
    });
  }
  bindMagic();
  // mouse trail particles
  let lmx=0,lmy=0;
  document.addEventListener('mousemove',e=>{
    const dx=e.clientX-lmx,dy=e.clientY-lmy,sp=Math.sqrt(dx*dx+dy*dy);
    if(sp>20&&Math.random()<.3){const types=Object.keys(FX);spawn(e.clientX,e.clientY,types[Math.floor(Math.random()*types.length)],2);}
    lmx=e.clientX;lmy=e.clientY;
  });

  // Auto-wrap magic keywords in body copy
  const FX_MAP={
    rankings:'rankings',ranking:'rankings',ranks:'rankings',rank:'rankings',
    calls:'calls',call:'calls',
    leads:'leads',lead:'leads',inquiries:'leads',inquiry:'leads',
    revenue:'revenue',growth:'revenue',profit:'revenue',
    visibility:'visibility',visible:'visibility',
    alignment:'alignment',aligned:'alignment',align:'alignment',
    tracking:'tracking',tracked:'tracking',track:'tracking',
    conversion:'conversion',convert:'conversion',converts:'conversion',converting:'conversion',
    traffic:'traffic',
    search:'search',searches:'search',searching:'search',
    maps:'visibility',
    data:'tracking',metrics:'tracking',analytics:'tracking',performance:'tracking'
  };
  const SELECTOR='p, li, h1, h2, h3, .lede';
  const SKIP='.nav-logo, .footer-logo, .ticker, .pack-search, .pack-chip, .pack-name, .pack-meta, .stat-val, .stat-label, .stat-note, .price-amount, .case-metric-val, code';
  function wrapTextNodes(root){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{
      acceptNode(n){
        if(!n.nodeValue||!n.nodeValue.trim())return NodeFilter.FILTER_REJECT;
        let p=n.parentElement;while(p){if(p.matches&&p.matches(SKIP))return NodeFilter.FILTER_REJECT;if(p.classList&&(p.classList.contains('magic-word')||p.classList.contains('word-unit')))return NodeFilter.FILTER_REJECT;p=p.parentElement;}
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      const text=node.nodeValue;
      const re=/\b([A-Za-z]+)\b/g;
      let m,last=0,frag=null;
      while((m=re.exec(text))){
        const word=m[1].toLowerCase();
        const fx=FX_MAP[word];
        if(!fx)continue;
        if(!frag)frag=document.createDocumentFragment();
        if(m.index>last)frag.appendChild(document.createTextNode(text.slice(last,m.index)));
        const span=document.createElement('span');
        span.className='magic-word';span.dataset.fx=fx;span.textContent=m[0];
        frag.appendChild(span);
        last=m.index+m[0].length;
      }
      if(frag){
        if(last<text.length)frag.appendChild(document.createTextNode(text.slice(last)));
        node.parentNode.replaceChild(frag,node);
      }
    });
  }
  document.querySelectorAll(SELECTOR).forEach(el=>wrapTextNodes(el));
  bindMagic();

  // Word physics on headings
  function wrapWords(el){
    const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{
      acceptNode(n){
        if(!n.nodeValue||!n.nodeValue.trim())return NodeFilter.FILTER_REJECT;
        let p=n.parentElement;while(p){if(p.classList&&(p.classList.contains('magic-word')||p.classList.contains('word-unit')))return NodeFilter.FILTER_REJECT;p=p.parentElement;}
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      const words=node.nodeValue.split(/(\s+)/);
      if(words.length<=1)return;
      const frag=document.createDocumentFragment();
      words.forEach(w=>{if(/^\s+$/.test(w)){frag.appendChild(document.createTextNode(w));}else{const s=document.createElement('span');s.className='word-unit';s.textContent=w;frag.appendChild(s);}});
      node.parentNode.replaceChild(frag,node);
    });
    // also wrap magic-word spans as units
    el.querySelectorAll('.magic-word:not(.word-unit)').forEach(mw=>{mw.classList.add('word-unit');});
  }
  const headSel='h1, h2, .page-hero h1, section.body h2';
  const targets=Array.from(document.querySelectorAll(headSel));
  const units=[];
  targets.forEach(t=>{wrapWords(t);t.querySelectorAll('.word-unit').forEach(u=>units.push({el:u,cx:0,cy:0,vx:0,vy:0}));});
  (function physics(){
    units.forEach(w=>{
      const r=w.el.getBoundingClientRect(),ex=r.left+r.width/2,ey=r.top+r.height/2;
      const dx=ex-mx,dy=ey-my,dist=Math.sqrt(dx*dx+dy*dy);
      let fx=0,fy=0;
      if(dist<110&&dist>0){const f=(110-dist)/110;fx=(dx/dist)*f*f*2.2;fy=(dy/dist)*f*f*2.2;}
      fx+=(-w.cx)*.12;fy+=(-w.cy)*.12;
      w.vx=(w.vx+fx)*.72;w.vy=(w.vy+fy)*.72;
      w.cx+=w.vx;w.cy+=w.vy;
      const mag=Math.sqrt(w.cx*w.cx+w.cy*w.cy);
      if(mag>55){w.cx=w.cx/mag*55;w.cy=w.cy/mag*55;}
      w.el.style.transform='translate('+w.cx.toFixed(2)+'px,'+w.cy.toFixed(2)+'px)';
    });
    requestAnimationFrame(physics);
  })();
})();
