function recorder(u,i){const w=E('div','ex'),st=E('p','fb'),au=E('audio');au.controls=true;au.hidden=true;st.setAttribute('aria-live','polite');
 const rec=E('button','btn','● Record'),stop=E('button','btn alt','■ Stop'),sub=E('button','btn alt','Submit for correction');stop.disabled=sub.disabled=true;
 let mr,ch=[],blob;
 rec.onclick=async()=>{if(!navigator.mediaDevices||!window.MediaRecorder)return st.textContent='Recording is not supported in this browser. Try a recent Chrome, Edge, Firefox or Safari.';
  try{const s=await navigator.mediaDevices.getUserMedia({audio:true});ch=[];mr=new MediaRecorder(s);mr.ondataavailable=e=>ch.push(e.data);
   mr.onstop=()=>{blob=new Blob(ch,{type:mr.mimeType});au.src=URL.createObjectURL(blob);au.hidden=false;s.getTracks().forEach(t=>t.stop());sub.disabled=false;st.textContent='Recording ready. Listen to it, record again, or submit.'};
   mr.start();rec.disabled=true;stop.disabled=false;st.textContent='Recording…'}catch(e){st.textContent='Microphone access was blocked. Allow the microphone in your browser settings and try again.'}};
 stop.onclick=()=>{mr&&mr.state==='recording'&&mr.stop();rec.disabled=false;stop.disabled=true};
 sub.onclick=async()=>{const ep=(window.GDP_CONFIG||{}).API_ENDPOINT;
  if(!ep)return st.textContent='Automatic correction is not configured yet. Your recording stays on this device. See docs/API-SETUP.md.';
  st.textContent='Sending…';try{const fd=new FormData();fd.append('audio',blob);fd.append('unit',u);fd.append('prompt',i);const r=await fetch(ep,{method:'POST',body:fd});if(!r.ok)throw 0;const j=await r.json();
   st.textContent='';const p=E('pre');p.textContent=JSON.stringify(j,null,2);w.append(p)}catch(e){st.textContent='The correction service did not respond. Please try again later.'}};
 w.append(rec,' ',stop,' ',sub,au,st);return w}
