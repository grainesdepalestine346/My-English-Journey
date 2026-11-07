window.setLv=l=>{const p=P();p.level=l;save(p);route()};
const DESC={A1:["Beginner","Introduce yourself and use simple everyday phrases."],A2:["Elementary","Describe your routine and talk about the past in simple terms."],B1:["Intermediate","Explain opinions and deal with most everyday situations."],B2:["Upper intermediate","Discuss complex ideas and write structured texts."]};
const topics=()=>MONTHS.flatMap((m,i)=>m[1].split("|").map((t,j)=>({n:i*4+j+1,t,m:i+1,w:j+1})));
function prompts(t,l){if(t.n===1)return LESSON.levels[l].speak;const x=t.t;return{A1:[`Say three short sentences about this topic: ${x}.`,`Say one word you know about "${x}", then use it in a sentence.`],A2:[`Talk about "${x}" for 30 seconds. Say what you do, when and why.`,`Tell us about a time connected to "${x}".`],B1:[`Explain your opinion on "${x}" and give two reasons.`,`Describe your experience of "${x}" and say what you learnt.`],B2:[`Present a balanced view of "${x}": an argument, a counter-argument and your conclusion.`,`To what extent is "${x}" important for your future studies? Justify your answer.`]}[l]}
const FRAME={A1:"Use: I like… / I have… / It is… Aim for about 12 words.",A2:"Use: First… Then… because… Aim for about 30 words.",B1:"Use: In my opinion… because… For example… Aim for about 55 words.",B2:"Use: Although… However… On balance… Aim for about 85 words."};
const TARGET={A1:12,A2:30,B1:55,B2:85};
const IRR={go:"goes",study:"studies",have:"has"},BASE={went:"go",saw:"see",ate:"eat",had:"have",came:"come",did:"do"};
const RULES=[[/\bI am agree\b/i,"I agree","'Agree' is a verb, so we do not use 'am' before it."],
[/\b(he|she) (live|work|play|study|like|want|need|go|come|have)\b/i,(m,a,b)=>`${a} ${IRR[b]||b+"s"}`,"In the present simple, he/she/it takes an -s ending on the verb."],
[/\bI have (\d+) years?( old)?\b/i,"I am $1 years old","In English we use 'am' for age, not 'have'."],
[/\bmore (better|good)\b/i,"better","'Better' already means 'more good'."],
[/\b(didn't|did not) (went|saw|ate|had|came|did)\b/i,(m,a,b)=>`${a} ${BASE[b]}`,"After 'didn't' use the base form of the verb."],
[/\bpeoples\b/i,"people","'People' is already plural."],[/\b(informations|advices)\b/i,(m)=>m.slice(0,-1),"This noun is uncountable: we do not add -s."],
[/\bI very like\b/i,"I really like","Use 'really' before the verb, or 'very much' after it."],
[/\bdepend of\b/i,"depend on","We say 'depend on'."],[/\bI am interesting in\b/i,"I am interested in","Use -ed for how you feel."],
[/\bsince (\d+|two|three|four|five|six|ten) years\b/i,"for $1 years","Use 'for' with a length of time and 'since' with a starting point."],
[/\bexplain me\b/i,"explain to me","'Explain' needs 'to' before the person."]];
const STRESS={student:"STU-dent",family:"FAM-i-ly",university:"u-ni-VER-si-ty",biology:"bi-OL-o-gy",nervous:"NER-vous",introduce:"in-tro-DUCE",neighbourhood:"NEIGH-bour-hood",important:"im-POR-tant",different:"DIF-frent",interested:"IN-trest-ed"};
function corr(raw,l,conf){const t=(raw||"").trim();if(!t)return'<p class="bad">There is nothing to check yet. Type what you said in the transcript box, or record again in a browser that supports transcripts.</p>';
let fx=t,hl=esc(t);const is=[];
RULES.forEach(([re,fn,why])=>{const m=t.match(re);if(m){is.push([m[0],m[0].replace(re,fn),why]);const g=new RegExp(re.source,"gi");hl=hl.replace(g,x=>`<mark>${x}</mark>`);fx=fx.replace(g,fn)}});
Object.keys(UKUS).forEach(k=>{const g=new RegExp("\\b"+k+"\\b","gi");if(g.test(fx)){const b=UKUS[k].split(" / ")[0];is.push([k,b,"More natural in British English."]);hl=hl.replace(g,x=>`<mark>${x}</mark>`);fx=fx.replace(g,b)}});
const w=t.split(/\s+/).length,tg=TARGET[l],lk=/\b(because|so|but|although|however|therefore|whereas|for example|on the other hand)\b/i.test(t),adv=/\b(however|although|whereas|therefore|on the other hand)\b/i.test(t);
const tips=[`Well done for speaking: you said about ${w} words.`];
if(w<tg)tips.push(`Next time, try to say a little more. A good target at ${l} is about ${tg} words.`);
if(l!=="A1"&&!lk)tips.push("Try to link your ideas with words such as 'because', 'so' or 'but'.");
if((l==="B2"||l==="B1")&&!adv)tips.push("To sound more advanced, add a contrast or conclusion: 'however', 'although', 'therefore'.");
if(!is.length)tips.push("My short checklist found no common mistakes. That does not mean there are none: please ask your teacher to check too.");
const st=Object.keys(STRESS).filter(k=>new RegExp("\\b"+k+"\\b","i").test(t)).slice(0,4);
return`<div class="card"><h3>Your answer, with possible mistakes highlighted</h3><p>${hl}</p>
${is.length?`<table><tr><th>You said</th><th>Better</th><th>Why</th></tr>${is.map(i=>`<tr><td>${esc(i[0])}</td><td><b>${esc(i[1])}</b></td><td>${esc(i[2])}</td></tr>`).join("")}</table>`:""}
<h3>More natural British English version</h3><p><b>${esc(fx)}</b></p>
<h3>Model answer (${l})</h3><p>${l&&LESSON.levels[l]?esc(LESSON.levels[l].model):""}</p><p><small>${FRAME[l]}</small></p>
<h3>Feedback and next steps</h3><ul>${tips.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
<h3>Pronunciation</h3><p>I cannot judge your pronunciation from a recording. What I can offer: ${conf<0.75?"parts of your speech were hard for the speech recogniser to recognise, so try again slowly and clearly. ":"the speech recogniser understood you well, which is a good sign. "}Your accent is welcome: aim for clear speech.</p>${st.length?`<p>Word stress to practise (capitals = stressed syllable): ${st.map(k=>`<b>${k}</b> (${STRESS[k]})`).join(", ")}.</p>`:""}
<p><small>This is an automatic checklist of common patterns, not a full correction. Your teacher gives the complete feedback.</small></p></div>`}
// Database for recordings
const db=()=>new Promise((r,j)=>{const q=indexedDB.open("gdp",1);q.onupgradeneeded=()=>q.result.createObjectStore("rec",{keyPath:"id"});q.onsuccess=()=>r(q.result);q.onerror=j});
const rall=async()=>{const d=await db();return new Promise(r=>{const q=d.transaction("rec").objectStore("rec").getAll();q.onsuccess=()=>r(q.result)})};
const rput=async o=>{const d=await db();d.transaction("rec","readwrite").objectStore("rec").put(o)};
const rdel=async id=>{const d=await db();d.transaction("rec","readwrite").objectStore("rec").delete(id)};
Object.assign(R,{
"/"(){const p=P(),l=p.level,n=p.q.m1w1!=null?1:0;app.innerHTML=`<section class="hero2"><div><h1>Learn English. Speak with confidence.</h1><p class="lead">A teacher-led eight-month programme from A1 to B2, with one lesson a week. Use this platform to revise, practise speaking and prepare for university in the English-speaking world.</p><a class="btn big" href="#/lesson">Continue Lesson 1</a><a class="btn alt big" href="#/placement">Take the placement test</a></div>
<aside class="dash"><h2>Your progress</h2><p>Level <b>${l}</b>: ${DESC[l][0]}</p><div class="bar"><i style="width:${n*100/32}%"></i></div><p>${n} of 32 lessons completed</p><dl><div><dt>Quiz score</dt><dd>${p.q.m1w1!=null?p.q.m1w1+"%":"–"}</dd></div><div><dt>Speaking answers</dt><dd>${p.sub||0}</dd></div><div><dt>Month</dt><dd>1 of 8</dd></div></dl></aside></section>
<section><h2>Choose your level</h2><div class="levels">${Object.keys(DESC).map(k=>`<button class="lvb ${k===l?"on":""}" onclick="setLv('${k}')"><b>${k}</b><span>${DESC[k][0]}</span><small>${DESC[k][1]}</small></button>`).join("")}</div></section>
<section><h2>Start learning</h2><div class="tiles"><a href="#/lesson"><b>Lessons</b>Reading, listening scripts, quizzes and writing.</a><a href="#/vocabulary"><b>Vocabulary</b>Words with Arabic translations for A1 and A2.</a><a href="#/grammar"><b>Grammar</b>Clear explanations and common mistakes.</a><a href="#/speaking"><b>Speaking Practice</b>Record yourself and get feedback.</a></div></section>
<section><h2>Your eight months</h2><ol class="months">${MONTHS.map((m,i)=>`<li><a href="#/calendar"><small>Month ${i+1}${i===0?" (current)":""}</small>${m[0]}</a></li>`).join("")}</ol></section>`},
"/grammar"(){app.innerHTML=`<h1>Grammar</h1><p>Grammar focus for Lesson 1 at each level. More points are added with each lesson.</p>${["A1","A2","B1","B2"].map(l=>`<div class="card"><span class="tag">${l}</span>${esc(LESSON.grammar[l])}</div>`).join("")}`},
"/vocabulary"(){const p=P();let lv=isA(p.level)?p.level:"A1",tp=-1;const draw=()=>{const v=VOCAB.filter(x=>x[0]===lv&&(tp<0||x[1]===tp));const cats=[...new Set(v.map(x=>x[2]))];
$("#vl").innerHTML=cats.map(c=>`<div class="card"><h2>${c}</h2><div class="vg">${v.filter(x=>x[2]===c).map(x=>`<div class="vc"><b>${esc(x[3])}</b> <span class="ar" tabindex="0" lang="ar">${x[4]}</span><p>${esc(x[5])}</p><p class="ar" tabindex="0" lang="ar">${x[6]}</p></div>`).join("")}</div></div>`).join("")||"<p>No words for this selection.</p>";$("#vl").className=$("#rv").checked?"hide":""};
app.innerHTML=`<h1>Vocabulary</h1><p>A1 and A2 words by lesson topic, with Arabic translations (العربية).</p><div class="card"><div class="tabs">${["A1","A2"].map(l=>`<button class="btn ${l===lv?"":"alt"}" data-l="${l}">${l}</button>`).join("")}</div><label>Lesson topic<select id="tp"><option value="-1">All topics so far</option>${VTOPICS.map((t,i)=>`<option value="${i}">Month 1, Week ${i+1}: ${t}</option>`).join("")}</select></label><label><input type="checkbox" id="rv"> Revision mode: hide the Arabic until you hover, tap or focus</label></div><div id="vl"></div>`;
document.querySelectorAll("[data-l]").forEach(b=>b.onclick=()=>{lv=b.dataset.l;document.querySelectorAll("[data-l]").forEach(x=>x.className="btn"+(x.dataset.l===lv?"":" alt"));draw()});$("#tp").onchange=e=>{tp=+e.target.value;draw()};$("#rv").onchange=draw;draw()},
"/speaking"(){const p=P(),l=p.level,T=topics(),ASR=window.SpeechRecognition||window.webkitSpeechRecognition,can=navigator.mediaDevices&&window.MediaRecorder;
app.innerHTML=`<h1>Speaking Practice</h1>${lvSel()}
<div class="card"><label>Lesson topic<select id="tp">${T.map(t=>`<option value="${t.n}" ${t.n===(p.stn||1)?"selected":""}>Month ${t.m}, Week ${t.w}: ${esc(t.t)}</option>`).join("")}</select></label><label>Speaking prompt<select id="pr"></select></label><p><small>${FRAME[l]}</small></p>
<button class="btn" id="rec" ${can?"":"disabled"}>● Record</button><button class="btn alt" id="stop" disabled>Stop</button> <span id="st" class="rec" aria-live="polite"></span>${can?"":'<p class="bad">Recording is not supported in this browser. Try a recent Chrome, Edge, Firefox or Safari, on HTTPS.</p>'}
<div id="pv"></div><div id="fb"></div></div>
<div class="card"><h2>How the correction works</h2><p><b>Works in your browser:</b> recording, listening back, saving on this device${ASR?", a British English transcript (en-GB) from your browser's speech tool (it may send audio to the browser provider)":""}, and an automatic checklist for common grammar errors, American words, length, linking words and word stress.</p><p><b>Needs an external service (not included):</b> full AI correction of grammar, vocabulary and pronunciation needs a speech-to-text API and an AI language model API. API keys cannot be kept safely on GitHub Pages, so a small secure server or cloud function would be needed. Until then, use this checklist and your teacher's feedback. Recordings are not uploaded: use Download to send one to your teacher.</p></div>
<div class="card"><h2>My recordings</h2><div id="list"></div></div>
<div class="card"><h2>Self-assessment (${l})</h2>${CHECKLIST[l].map((c,i)=>`<label><input type="checkbox" data-c="${l}${i}" ${p.chk[l+i]?"checked":""}> ${esc(c)}</label>`).join("")}</div>
<div class="card"><h2>Notes and teacher feedback</h2><label>My improvement notes<textarea id="nt" rows="3">${esc(p.notes)}</textarea></label><label>Feedback I received<textarea id="fbk" rows="3">${esc(p.fb)}</textarea></label></div>
<div class="card"><h2>Monthly challenge (Month 1)</h2><p>Record a 30-second introduction every week and compare your first and last recordings.</p></div>`;wireLv();
const sp=()=>{const t=T[+$("#tp").value-1],q=P();q.stn=t.n;save(q);$("#pr").innerHTML=prompts(t,l).concat(t.n===1?["Role-play: "+LESSON.levels[l].role]:[]).map(s=>`<option>${esc(s)}</option>`).join("")};$("#tp").onchange=sp;sp();
document.querySelectorAll("[data-c]").forEach(c=>c.onchange=()=>{const q=P();q.chk[c.dataset.c]=c.checked;save(q)});
$("#nt").oninput=e=>{const q=P();q.notes=e.target.value;save(q)};$("#fbk").oninput=e=>{const q=P();q.fb=e.target.value;save(q)};
async function draw(){let rs;try{rs=await rall()}catch(e){$("#list").innerHTML="<p>Saving recordings is not available in this browser.</p>";return}
$("#list").innerHTML=rs.length?"":"<p>No submitted recordings yet.</p>";rs.sort((a,b)=>b.id-a.id).forEach(r=>{const u=URL.createObjectURL(r.blob),d=document.createElement("div");d.innerHTML=`<p><b>${esc(r.prompt)}</b> <span class="tag">${r.lv}</span><br>${new Date(r.id).toLocaleString("en-GB")}</p><audio controls src="${u}"></audio><div><button class="btn alt" data-a="f">Get feedback</button><a class="btn alt" download="speaking-${r.id}.${r.blob.type.includes("mp4")?"m4a":"webm"}" href="${u}">Download</a><button class="btn red" data-a="d">Delete</button></div><div class="fx"></div>`;
d.querySelector('[data-a=f]').onclick=()=>d.querySelector(".fx").innerHTML=corr(r.tx,r.lv,r.cf);d.querySelector('[data-a=d]').onclick=async()=>{await rdel(r.id);draw()};$("#list").append(d)})}
draw();let mr,ch=[],sr,txt="",cf=1,blob=null;
$("#rec").onclick=async()=>{try{const s=await navigator.mediaDevices.getUserMedia({audio:true});mr=new MediaRecorder(s);ch=[];txt="";cf=1;$("#pv").innerHTML="";$("#fb").innerHTML="";mr.ondataavailable=e=>ch.push(e.data);
mr.onstop=()=>{s.getTracks().forEach(t=>t.stop());if(sr)try{sr.stop()}catch(e){}blob=new Blob(ch,{type:mr.mimeType});$("#pv").innerHTML=`<h3>Listen before you submit</h3><audio controls src="${URL.createObjectURL(blob)}"></audio><label>Transcript (edit it if it is wrong, or type what you said)<textarea id="tx" rows="3">${esc(txt)}</textarea></label><button class="btn" id="sub">Submit and get feedback</button><button class="btn alt" id="rd">Record again</button>`;
$("#rd").onclick=()=>{blob=null;$("#pv").innerHTML="";$("#fb").innerHTML="";$("#st").textContent=""};
$("#sub").onclick=async()=>{const tx=$("#tx").value;try{await rput({id:Date.now(),prompt:$("#pr").value,lv:l,blob,tx,cf})}catch(e){}const q=P();q.sub=(q.sub||0)+1;save(q);$("#fb").innerHTML=corr(tx,l,cf);$("#pv").innerHTML='<p class="ok">Submitted and saved on this device.</p>';draw()}};
mr.start();if(ASR){sr=new ASR();sr.lang="en-GB";sr.continuous=true;sr.onresult=e=>{const r=[...e.results];txt=r.map(x=>x[0].transcript).join(" ");cf=Math.min(...r.map(x=>x[0].confidence||1))};try{sr.start()}catch(e){}}
$("#rec").disabled=true;$("#stop").disabled=false;$("#st").textContent="Recording…"}catch(e){$("#st").textContent="Microphone blocked. Allow microphone access in your browser settings and try again."}};
$("#stop").onclick=()=>{mr.stop();$("#rec").disabled=false;$("#stop").disabled=true;$("#st").textContent="Recording finished."}}});
route();
