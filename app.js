const $=s=>document.querySelector(s),app=$("#app");
const P=()=>JSON.parse(localStorage.getItem("gdp")||'{"level":"A1","q":{},"chk":{},"notes":"","fb":""}');
const save=p=>localStorage.setItem("gdp",JSON.stringify(p));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const lvl=()=>P().level;const isA=l=>l==="A1"||l==="A2";const bil=l=>isA(l)&&P().ar===true;
function lvSel(){return `<label>Your level <select id="lv">${["A1","A2","B1","B2"].map(l=>`<option ${l===lvl()?"selected":""}>${l}</option>`).join("")}</select></label>${isA(lvl())?`<label><input type="checkbox" id="arb" ${P().ar?"checked":""}> Show Arabic help (translations of vocabulary and instructions)</label>`:""}`}
function wireLv(){const a=$("#arb");if(a)a.onchange=()=>{const p=P();p.ar=a.checked;save(p);route()};const s=$("#lv");if(s)s.onchange=()=>{const p=P();p.level=s.value;save(p);route()}}
// Quiz engine: check, explain, retry, score
function quiz(id,items,l){return `<form data-quiz="${id}">`+items.map((it,i)=>`<div class="q"><b>${i+1}. ${esc(it[0])}</b>${it[1].map((o,j)=>`<label><input type="radio" name="q${i}" value="${j}"> ${esc(o)}</label>`).join("")}<div class="fb" id="f${i}" aria-live="polite"></div></div>`).join("")+`<button class="btn" type="submit">Check answers</button><button class="btn alt" type="reset">Try again</button> <b id="sc"></b></form>`}
function wireQuiz(id,items){const f=document.querySelector(`[data-quiz="${id}"]`);if(!f)return;
f.onreset=()=>{f.querySelectorAll(".fb").forEach(e=>e.innerHTML="");$("#sc").textContent=""};
f.onsubmit=e=>{e.preventDefault();let s=0;items.forEach((it,i)=>{const v=f.querySelector(`[name=q${i}]:checked`),fb=$("#f"+i);
if(!v){fb.innerHTML='<span class="bad">Choose an answer.</span>';return}
if(+v.value===it[2]){s++;fb.innerHTML=`<span class="ok">✓ Correct.</span> ${esc(it[3])}`}else fb.innerHTML=`<span class="bad">✗ Not quite.</span> Correct answer: <b>${esc(it[1][it[2]])}</b>. ${esc(it[3])}`});
$("#sc").textContent=`Score: ${s}/${items.length}`;const p=P();p.q[id]=Math.max(p.q[id]||0,Math.round(100*s/items.length));save(p)}}
const R={
"/placement"(){app.innerHTML=`<h1>Placement test</h1><p>Indicative only. It checks grammar and reading, and does not replace a speaking and writing assessment with your teacher.</p><p><b>Before you start:</b> complete the whole test in one sitting, without a dictionary, notes or help. Answer every question, then press "Check answers".</p>${quiz("placement",PLACEMENT,"")}<div id="res"></div>`;
wireQuiz("placement",PLACEMENT);const f=$("form");const old=f.onsubmit;f.onsubmit=e=>{old(e);const by={A1:0,A2:0,B1:0,B2:0},tot={A1:0,A2:0,B1:0,B2:0};PLACEMENT.forEach((it,i)=>{tot[it[4]]++;const v=f.querySelector(`[name=q${i}]:checked`);if(v&&+v.value===it[2])by[it[4]]++});
let lv="A1";["A1","A2","B1","B2"].forEach(l=>{if(by[l]>=1&&(l==="A1"||by[l]===tot[l]||by[l]>=1&&lv!=="A1"&&false))lv=l});
let r="A1";for(const l of ["A1","A2","B1","B2"]){if(by[l]===tot[l])r=l;else break}
const weak=Object.keys(by).filter(l=>by[l]<tot[l]);const p=P();p.level=r;save(p);
$("#res").innerHTML=`<div class="card"><h2>Estimated level: ${r}</h2><p>Strengths: ${r}-level and below. To work on: ${weak.join(", ")||"nothing, try B2 tasks"}.</p><p>Recommended start: Month 1, Lesson 1 at ${r}. Your level has been saved.</p><a class="btn" href="#/lesson">Start Lesson 1</a></div>`}},
"/dashboard"(){const p=P(),done=Object.keys(p.q).filter(k=>k!=="placement").length;app.innerHTML=`<h1>Dashboard</h1>${lvSel()}<div class="card"><p>Current lesson: <b>Month 1, Week 1: ${LESSON.title}</b></p><p>Quizzes completed: ${done}</p><div class="bar"><i style="width:${100/32*(p.q.m1w1?1:0)}%"></i></div><p>1 / 32 lessons started</p><a class="btn" href="#/lesson">Continue</a></div>`;wireLv()},
"/calendar"(){let n=0;app.innerHTML=`<h1>Course calendar</h1><p>${MONTHS.length} months, 32 lessons. ${bil("A1")?"":""}</p>`+MONTHS.map((m,i)=>`<div class="card"><h2>Month ${i+1}: ${m[0]}</h2><table>${m[1].split("|").map((t,j)=>{n++;const st=n===1?(P().q.m1w1!=null?"Completed":"Current"):"Upcoming";return `<tr><td>Week ${j+1}</td><td>${n===1?'<a href="#/lesson">'+t+'</a>':t}</td><td>${st}${n>1?" (in preparation)":""}</td></tr>`}).join("")}</table></div>`).join("")},
"/lesson"(){const p=P(),l=p.level,d=LESSON.levels[l];const ins=d.instr[0]+(bil(l)?`<div class="ar">${d.instr[1]}</div>`:"");
app.innerHTML=`<h1>${LESSON.title}</h1>${lvSel()}<p><span class="tag">${l}</span>Month 1, Week 1. 60-minute lesson.</p>
<div class="card"><h2>Instructions</h2><p>${ins}</p></div>
<div class="card"><h2>Vocabulary</h2><table>${d.vocab.map(v=>`<tr><td><b>${esc(v[0])}</b></td><td>${esc(v[2])}</td>${isA(l)?(bil(l)?`<td class="ar">${v[1]}</td>`:""):`<td>${esc(v[1])}</td>`}</tr>`).join("")}</table></div>
<div class="card"><h2>Grammar focus</h2><p>${esc(LESSON.grammar[l])}</p></div>
<div class="card"><h2>Reading</h2><p>${esc(d.reading)}</p></div>
<div class="card"><h2>Listening script (teacher reads aloud)</h2><p>${esc(d.script)}</p></div>
<div class="card"><h2>Quiz</h2>${quiz("m1w1",d.quiz,l)}</div>
<div class="card"><h2>Speaking</h2><ul>${d.speak.map(s=>`<li>${esc(s)}</li>`).join("")}</ul><p><b>Role-play:</b> ${esc(d.role)}</p><p><b>Model answer:</b> ${esc(d.model)}</p><a class="btn" href="#/speaking">Record your answers</a></div>
<div class="card"><h2>Writing</h2><p>${esc(d.write)}</p><p><b>Model:</b> ${esc(d.wmodel)}</p><p>Criteria: clear ideas, correct grammar, British spelling, suitable length.</p></div>`;wireLv();wireQuiz("m1w1",d.quiz)},
"/progress"(){const p=P();const c=Object.values(p.chk).filter(Boolean).length;app.innerHTML=`<h1>Progress</h1><div class="card"><p>Lesson 1 quiz best score: <b>${p.q.m1w1!=null?p.q.m1w1+"%":"not done yet"}</b></p><p>Placement test: <b>${p.q.placement!=null?p.q.placement+"%":"not done yet"}</b></p><p>Self-assessment items ticked: ${c}</p><p>Speaking answers submitted: ${p.sub||0}</p></div><div class="card"><p>Progress is saved only in this browser on this device. It is not shared between devices or with your teacher unless a backend is added.</p><button class="btn red" id="rs">Reset my progress</button></div>`;$("#rs").onclick=()=>{if(confirm("Delete all saved progress?")){localStorage.removeItem("gdp");route()}}}};
function route(){const h=(location.hash||"#/").slice(1);(R[h]||R["/"])();document.querySelectorAll("nav a").forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+h));app.focus()}
addEventListener("hashchange",route);
