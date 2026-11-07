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
"/"(){const st=[["A1","Seed","Hello, my name is…",'<ellipse cx="32" cy="50" rx="7" ry="5" fill="currentColor"/>'],["A2","Sprout","I went to the market.",'<path d="M32 56V34M32 40c-9 0-12-6-12-12 9 0 12 6 12 12zm0-4c0-8 5-12 12-12 0 8-5 12-12 12z" fill="currentColor" stroke="currentColor" stroke-width="2"/>'],["B1","Plant","I would like to explain…",'<path d="M32 58V20M32 44c-11 0-15-7-15-14 11 0 15 7 15 14zm0-12c0-10 6-15 15-15 0 10-6 15-15 15zm0 14c8 0 12-5 12-11-8 0-12 5-12 11z" fill="currentColor" stroke="currentColor" stroke-width="2"/>'],["B2","Tree","To what extent do you agree?",'<rect x="29" y="34" width="6" height="24" fill="currentColor"/><circle cx="32" cy="22" r="16" fill="currentColor"/>']];
const sk=[["Listening","Teacher-read scripts with questions and answer keys."],["Speaking","Record yourself, listen back and track your confidence."],["Reading","Emails, articles, stories and academic texts."],["Writing","Models, structures and criteria from messages to essays."]];
app.innerHTML=`<section class="hero"><p class="kicker">Graines de Palestine presents</p><h1>Plant your English.<br>Grow it into university.</h1><p class="lead">Eight months. One lesson a week with your teacher. A free online space to revise, speak and practise in British English, from A1 to B2.</p><a class="btn big" href="#/placement">Find your level</a><a class="btn alt big" href="#/lesson">Try Lesson 1</a></section>
<section aria-label="Levels"><h2>Four stages of growth</h2><div class="stages">${st.map(s=>`<a class="stage" href="#/lesson" onclick="const p=P();p.level='${s[0]}';save(p)"><svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">${s[3]}</svg><b>${s[0]}: ${s[1]}</b><span>“${s[2]}”</span></a>`).join("")}</div></section>
<section><h2>Every lesson trains four skills</h2><div class="grid">${sk.map(k=>`<div class="card"><h3>${k[0]}</h3><p>${k[1]}</p></div>`).join("")}</div></section>
<section><h2>Your eight-month journey</h2><ol class="months">${MONTHS.map((m,i)=>`<li><a href="#/calendar"><small>Month ${i+1}</small>${m[0]}</a></li>`).join("")}</ol></section>
<section class="card how"><h2>How it works</h2><p><b>Before class:</b> preview the vocabulary. <b>In class:</b> speak, read and write with your teacher. <b>After class:</b> revise, take the quiz and record your answers. Your progress stays on your device.</p></section>`},
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
"/speaking"(){const p=P(),l=p.level,d=LESSON.levels[l],ASR=window.SpeechRecognition||window.webkitSpeechRecognition,canRec=navigator.mediaDevices&&window.MediaRecorder;
app.innerHTML=`<h1>Speaking practice</h1>${lvSel()}<div class="card"><p><b>Works in your browser:</b> recording, playback, deleting, local storage${ASR?", and an optional transcript (en-GB)":""}.</p><p><b>Not available:</b> automatic grammar or pronunciation marking needs an external AI service, which this static site does not use. Use the checklist below and ask your teacher for feedback. Your accent is welcome: aim for clear, understandable English, not a different accent.${ASR?" Note: the browser's transcript tool may send audio to the browser provider.":""}</p></div>
<div class="card"><label>Prompt<select id="pr">${d.speak.map(s=>`<option>${esc(s)}</option>`).join("")}<option>Role-play: ${esc(d.role)}</option></select></label>
<button class="btn" id="rec" ${canRec?"":"disabled"}>● Record</button><button class="btn alt" id="stop" disabled>Stop</button> <span id="st" class="rec"></span>${canRec?"":'<p class="bad">Recording is not supported in this browser. Try a recent Chrome, Edge, Firefox or Safari over HTTPS.</p>'}
<label>Transcript (edit if wrong)<textarea id="tx" rows="3"></textarea></label><button class="btn alt" id="chk">Check British spelling and words</button><div id="uk" aria-live="polite"></div></div>
<div class="card"><h2>My recordings</h2><div id="list"></div></div>
<div class="card"><h2>Self-assessment (${l})</h2>${CHECKLIST[l].map((c,i)=>`<label><input type="checkbox" data-c="${l}${i}" ${p.chk[l+i]?"checked":""}> ${esc(c)}</label>`).join("")}<p>Also ask: Was I clear? Did I use the target words? What will I improve?</p></div>
<div class="card"><h2>Notes and teacher feedback</h2><label>My improvement notes<textarea id="nt" rows="3">${esc(p.notes)}</textarea></label><label>Feedback I received<textarea id="fbk" rows="3">${esc(p.fb)}</textarea></label></div>
<div class="card"><h2>Monthly challenge (Month 1)</h2><p>Record a 30-second introduction of yourself every week and compare your first and last recording.</p></div>`;wireLv();
document.querySelectorAll("[data-c]").forEach(c=>c.onchange=()=>{const q=P();q.chk[c.dataset.c]=c.checked;save(q)});
$("#nt").oninput=e=>{const q=P();q.notes=e.target.value;save(q)};$("#fbk").oninput=e=>{const q=P();q.fb=e.target.value;save(q)};
$("#chk").onclick=()=>{const t=$("#tx").value.toLowerCase(),h=Object.keys(UKUS).filter(k=>new RegExp("\\b"+k+"\\b").test(t));$("#uk").innerHTML=h.length?h.map(k=>`<p><span class="bad">${k}</span> → British: <b>${UKUS[k]}</b></p>`).join(""):'<p class="ok">No American spellings or words found in this short list.</p>'};
const db=()=>new Promise((r,j)=>{const q=indexedDB.open("gdp",1);q.onupgradeneeded=()=>q.result.createObjectStore("rec",{keyPath:"id"});q.onsuccess=()=>r(q.result);q.onerror=j});
const all=async()=>{const d=await db();return new Promise(r=>{const q=d.transaction("rec").objectStore("rec").getAll();q.onsuccess=()=>r(q.result)})};
const put=async o=>{const d=await db();d.transaction("rec","readwrite").objectStore("rec").put(o)};
const del=async id=>{const d=await db();d.transaction("rec","readwrite").objectStore("rec").delete(id)};
async function draw(){let rs;try{rs=await all()}catch(e){$("#list").innerHTML="<p>Local storage for recordings is unavailable here.</p>";return}
$("#list").innerHTML=rs.length?"":"<p>No recordings yet. Choose a prompt and press Record.</p>";
rs.sort((a,b)=>b.id-a.id).forEach(r=>{const u=URL.createObjectURL(r.blob),dv=document.createElement("div");dv.innerHTML=`<p><b>${esc(r.prompt)}</b><br>${new Date(r.id).toLocaleString("en-GB")}${r.tx?"<br><i>"+esc(r.tx)+"</i>":""}</p><audio controls src="${u}"></audio><br><button class="btn red">Delete</button>`;dv.querySelector("button").onclick=async()=>{await del(r.id);draw()};$("#list").append(dv)})}
draw();let mr,ch=[],sr,txt="";
$("#rec").onclick=async()=>{try{const s=await navigator.mediaDevices.getUserMedia({audio:true});mr=new MediaRecorder(s);ch=[];txt="";mr.ondataavailable=e=>ch.push(e.data);
mr.onstop=async()=>{s.getTracks().forEach(t=>t.stop());if(sr)try{sr.stop()}catch(e){}await put({id:Date.now(),prompt:$("#pr").value,blob:new Blob(ch,{type:mr.mimeType}),tx:txt});$("#tx").value=txt;draw()};mr.start();
if(ASR){sr=new ASR();sr.lang="en-GB";sr.continuous=true;sr.onresult=e=>{txt=[...e.results].map(r=>r[0].transcript).join(" ")};try{sr.start()}catch(e){}}
$("#rec").disabled=true;$("#stop").disabled=false;$("#st").textContent="Recording…"}catch(e){$("#st").textContent="Microphone blocked. Allow microphone access in your browser settings."}};
$("#stop").onclick=()=>{mr.stop();$("#rec").disabled=false;$("#stop").disabled=true;$("#st").textContent="Saved on this device."}},
"/progress"(){const p=P();const c=Object.values(p.chk).filter(Boolean).length;app.innerHTML=`<h1>Progress</h1><div class="card"><p>Lesson 1 quiz best score: <b>${p.q.m1w1!=null?p.q.m1w1+"%":"not done yet"}</b></p><p>Placement test: <b>${p.q.placement!=null?p.q.placement+"%":"not done yet"}</b></p><p>Self-assessment items ticked: ${c}</p></div><div class="card"><p>Progress is saved only in this browser on this device. It is not shared between devices or with your teacher unless a backend is added.</p><button class="btn red" id="rs">Reset my progress</button></div>`;$("#rs").onclick=()=>{if(confirm("Delete all saved progress?")){localStorage.removeItem("gdp");route()}}}};
function route(){const h=(location.hash||"#/").slice(1);(R[h]||R["/"])();document.querySelectorAll("nav a").forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+h));app.focus()}
addEventListener("hashchange",route);route();
