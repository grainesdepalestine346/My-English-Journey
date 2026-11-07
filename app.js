const $=(s,r=document)=>r.querySelector(s),E=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const S={get:()=>{try{return JSON.parse(localStorage.getItem('gdp'))||{}}catch(e){return{}}},set:o=>{try{localStorage.setItem('gdp',JSON.stringify(o))}catch(e){}}};
const J=u=>fetch(u).then(r=>{if(!r.ok)throw 0;return r.json()});
function shell(cur){const L=[['index.html','Home'],['programme.html','Programme'],['unit.html?u=01','My units'],['unit.html?u=01#vocabulary','Vocabulary'],['unit.html?u=01#speaking','Speaking'],['unit.html?u=01#listening','Listening'],['progress.html','My progress']];
 const h=E('header','',`<div class="bar"><a href="index.html"><img src="assets/logo/logo.webp" alt="Graines de Palestine – home"></a><button id="mb" class="btn alt" aria-expanded="false">Menu</button><nav aria-label="Main">${L.map(l=>`<a href="${l[0]}"${l[1]===cur?' aria-current="page"':''}>${l[1]}</a>`).join('')}</nav></div>`);
 document.body.prepend(h);$('#mb').onclick=e=>{const o=$('nav').classList.toggle('open');e.target.setAttribute('aria-expanded',o)};
 document.body.append(E('footer','','Graines de Palestine · English Learning Platform · CEFR levels (B1–C1) are practice indicators only and are not an official assessment.'))}
function save(u,sec,box){const all=[...box.querySelectorAll('.ex')],s=S.get();s[u]=s[u]||{};s[u][sec]={ok:all.filter(e=>e.dataset.ok==='1').length,n:all.length};S.set(s)}
function exercise(x,id,u,sec,box){const d=E('div','ex');d.innerHTML=`<p><b>${x.q}</b></p>`;
 if(x.t==='mcq')x.o.forEach((o,i)=>d.insertAdjacentHTML('beforeend',`<label class="opt"><input type="radio" name="${sec}${id}" value="${i}"> ${o}</label>`));
 else d.insertAdjacentHTML('beforeend','<input class="gap" type="text" aria-label="Your answer" autocomplete="off" autocapitalize="off">');
 const b=E('button','btn','Check answer'),r=E('button','btn alt','Try again'),f=E('p','fb');f.setAttribute('aria-live','polite');r.hidden=true;
 b.onclick=()=>{let ok;if(x.t==='mcq'){const c=$('input:checked',d);if(!c)return f.textContent='Choose an answer first.';ok=+c.value===x.a}
  else{const v=$('.gap',d).value.trim().toLowerCase().replace(/\s+/g,' ');if(!v)return f.textContent='Type an answer first.';ok=x.a.includes(v)}
  d.dataset.ok=ok?1:0;f.className='fb '+(ok?'ok':'no');f.textContent=(ok?'✓ Correct. ':'✗ Not quite. ')+x.e;r.hidden=false;save(u,sec,box)};
 r.onclick=()=>{d.dataset.ok='';f.textContent='';f.className='fb';r.hidden=true;d.querySelectorAll('input').forEach(i=>{i.checked=false;if(i.type==='text')i.value=''});save(u,sec,box)};
 d.append(b,' ',r,f);return d}
function exSet(list,u,sec){const box=E('div');list.forEach((x,i)=>box.append(exercise(x,i,u,sec,box)));return box}
