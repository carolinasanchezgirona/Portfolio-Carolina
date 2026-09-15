(() => {
  "use strict";

  const SUPABASE_URL = "https://grgyvdxkjdstdyumdfyg.supabase.co";
  const REST_URL = `${SUPABASE_URL}/rest/v1`;
  const KEY = "sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
  const SESSION_KEY = "dememoria_admin_session";

  const patientDialog = document.querySelector("#clinic-patient-dialog");
  const patientIdField = document.querySelector("#clinic-patient-id");
  const scalesHost = document.querySelector("#clinic-patient-scales");
  if (!patientDialog || !patientIdField || !scalesHost) return;

  const section = document.createElement("section");
  section.className = "clinic-scale-trends";
  section.innerHTML = `
    <div class="clinic-scale-trends-heading">
      <div><p class="clinic-eyebrow">Evolución longitudinal</p><h3>Gráfico de escalas</h3></div>
      <select id="clinic-scale-trend-select" aria-label="Seleccionar escala"></select>
    </div>
    <p id="clinic-scale-trend-status" class="clinic-message" role="status"></p>
    <div id="clinic-scale-trend-summary" class="clinic-scale-trend-summary"></div>
    <div id="clinic-scale-trend-chart" class="clinic-scale-trend-chart" role="img" aria-label="Gráfico longitudinal de puntuaciones"></div>
    <div id="clinic-scale-trend-points" class="clinic-scale-trend-points"></div>`;
  scalesHost.parentElement?.append(section);

  const style = document.createElement("style");
  style.textContent = `
    .clinic-scale-trends{margin-top:16px;padding:17px;border:1px solid #CFE9EE;border-radius:15px;background:#F7FCFD}
    .clinic-scale-trends-heading{display:flex;align-items:center;justify-content:space-between;gap:12px}.clinic-scale-trends-heading h3{margin:0;font-family:Newsreader,Georgia,serif;font-size:1.35rem;font-weight:500}.clinic-scale-trends select{min-width:180px;min-height:40px;padding:8px 10px;border:1px solid #9EDCE7;border-radius:10px;background:#fff;color:#24343d;font:inherit}
    .clinic-scale-trend-summary{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.clinic-scale-trend-summary span{padding:6px 9px;border-radius:999px;background:#EAF6F8;color:#075A68;font-size:.74rem;font-weight:700}
    .clinic-scale-trend-chart{min-height:220px;padding:8px;border:1px solid #DDECEF;border-radius:12px;background:#fff;overflow:hidden}.clinic-scale-trend-chart svg{display:block;width:100%;height:220px}.clinic-scale-trend-chart text{font:11px Inter,system-ui,sans-serif;fill:#667983}.clinic-scale-trend-chart .axis{stroke:#CFE0E4;stroke-width:1}.clinic-scale-trend-chart .line{fill:none;stroke:#11A6C2;stroke-width:3;stroke-linejoin:round;stroke-linecap:round}.clinic-scale-trend-chart .dot{fill:#fff;stroke:#075A68;stroke-width:2}.clinic-scale-trend-chart .grid{stroke:#EDF3F5;stroke-width:1}
    .clinic-scale-trend-points{display:grid;gap:6px;margin-top:10px}.clinic-scale-trend-points article{display:grid;grid-template-columns:110px 90px minmax(0,1fr);gap:10px;padding:8px 10px;border-radius:9px;background:#fff;font-size:.76rem}.clinic-scale-trend-points strong{color:#075A68}.clinic-scale-trend-empty{padding:24px;color:#667983;text-align:center}
    @media(max-width:620px){.clinic-scale-trends-heading{align-items:stretch;flex-direction:column}.clinic-scale-trends select{width:100%}.clinic-scale-trend-points article{grid-template-columns:1fr 1fr}.clinic-scale-trend-points article span:last-child{grid-column:1/-1}}
  `;
  document.head.append(style);

  const select = section.querySelector("#clinic-scale-trend-select");
  const status = section.querySelector("#clinic-scale-trend-status");
  const summary = section.querySelector("#clinic-scale-trend-summary");
  const chart = section.querySelector("#clinic-scale-trend-chart");
  const pointsHost = section.querySelector("#clinic-scale-trend-points");
  let rows = [];

  function session(){try{return JSON.parse(sessionStorage.getItem(SESSION_KEY)||"null");}catch{return null;}}
  function headers(){return {apikey:KEY,Authorization:`Bearer ${session()?.access_token||""}`,"Content-Type":"application/json"};}
  function fmtDate(value){
    const [y,m,d]=String(value).slice(0,10).split("-").map(Number);
    return new Intl.DateTimeFormat("es-ES",{day:"2-digit",month:"short",year:"2-digit",timeZone:"UTC"}).format(new Date(Date.UTC(y,m-1,d,12)));
  }
  function instruments(){return [...new Set(rows.map(r=>r.instrument).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"es"));}
  function numericRows(instrument){return rows.filter(r=>r.instrument===instrument&&r.total_score!==null&&r.total_score!==undefined&&!Number.isNaN(Number(r.total_score))).sort((a,b)=>String(a.measured_at).localeCompare(String(b.measured_at)));}

  function populateSelect(){
    const current=select.value;
    select.replaceChildren();
    instruments().forEach(name=>{const o=document.createElement("option");o.value=name;o.textContent=name;select.append(o);});
    if(current&&instruments().includes(current)) select.value=current;
  }

  function render(){
    const instrument=select.value;
    const data=numericRows(instrument);
    summary.replaceChildren(); chart.replaceChildren(); pointsHost.replaceChildren();
    if(!instrument||!data.length){
      const empty=document.createElement("div");empty.className="clinic-scale-trend-empty";empty.textContent="No hay puntuaciones numéricas suficientes para mostrar una evolución.";chart.append(empty);return;
    }
    const scores=data.map(x=>Number(x.total_score));
    const first=scores[0], last=scores[scores.length-1], min=Math.min(...scores), max=Math.max(...scores);
    [["Mediciones",data.length],["Inicial",first],["Última",last],["Mínima",min],["Máxima",max]].forEach(([label,val])=>{const s=document.createElement("span");s.textContent=`${label}: ${val}`;summary.append(s);});
    if(data.length>1){const delta=last-first;const s=document.createElement("span");s.textContent=`Cambio: ${delta>0?"+":""}${delta}`;summary.append(s);}

    const W=720,H=220,padL=42,padR=18,padT=16,padB=36;
    const range=(max-min)||1;
    const yMin=min-range*.15,yMax=max+range*.15;
    const x=i=>data.length===1?(W-padL-padR)/2+padL:padL+i*((W-padL-padR)/(data.length-1));
    const y=v=>padT+(yMax-v)*(H-padT-padB)/(yMax-yMin||1);
    const ns="http://www.w3.org/2000/svg";
    const svg=document.createElementNS(ns,"svg");svg.setAttribute("viewBox",`0 0 ${W} ${H}`);svg.setAttribute("preserveAspectRatio","none");
    for(let i=0;i<4;i++){const gy=padT+i*((H-padT-padB)/3);const l=document.createElementNS(ns,"line");l.setAttribute("x1",padL);l.setAttribute("x2",W-padR);l.setAttribute("y1",gy);l.setAttribute("y2",gy);l.setAttribute("class","grid");svg.append(l);}
    const axisX=document.createElementNS(ns,"line");axisX.setAttribute("x1",padL);axisX.setAttribute("x2",W-padR);axisX.setAttribute("y1",H-padB);axisX.setAttribute("y2",H-padB);axisX.setAttribute("class","axis");svg.append(axisX);
    const poly=document.createElementNS(ns,"polyline");poly.setAttribute("points",data.map((r,i)=>`${x(i)},${y(Number(r.total_score))}`).join(" "));poly.setAttribute("class","line");svg.append(poly);
    data.forEach((r,i)=>{
      const c=document.createElementNS(ns,"circle");c.setAttribute("cx",x(i));c.setAttribute("cy",y(Number(r.total_score)));c.setAttribute("r",4.5);c.setAttribute("class","dot");svg.append(c);
      const t=document.createElementNS(ns,"text");t.setAttribute("x",x(i));t.setAttribute("y",H-13);t.setAttribute("text-anchor","middle");t.textContent=fmtDate(r.measured_at);svg.append(t);
      const v=document.createElementNS(ns,"text");v.setAttribute("x",x(i));v.setAttribute("y",Math.max(12,y(Number(r.total_score))-9));v.setAttribute("text-anchor","middle");v.textContent=String(r.total_score);svg.append(v);
    });
    chart.append(svg);

    [...data].reverse().forEach(r=>{
      const a=document.createElement("article");
      const d=document.createElement("span");d.textContent=fmtDate(r.measured_at);
      const v=document.createElement("strong");v.textContent=String(r.total_score);
      const note=document.createElement("span");note.textContent=r.interpretation||r.notes||"";
      a.append(d,v,note);pointsHost.append(a);
    });
  }

  async function load(){
    const patientId=patientIdField.value;
    if(!patientId||!patientDialog.open)return;
    status.textContent="Cargando evolución…";
    try{
      const res=await fetch(`${REST_URL}/clinical_scale_measurements?select=id,instrument,measured_at,total_score,interpretation,notes&patient_id=eq.${encodeURIComponent(patientId)}&order=measured_at.asc`,{headers:headers(),cache:"no-store"});
      const body=await res.json().catch(()=>[]);if(!res.ok)throw new Error(body?.message||"No se han podido cargar las escalas.");
      rows=body||[];populateSelect();render();status.textContent="";
    }catch(error){status.textContent=error instanceof Error?error.message:"No se han podido cargar las escalas.";}
  }

  select.addEventListener("change",render);
  const observer=new MutationObserver(()=>{if(patientDialog.open&&patientIdField.value)setTimeout(load,100);});
  observer.observe(patientDialog,{attributes:true,attributeFilter:["open"]});
  document.querySelector("#clinic-add-scale")?.addEventListener("click",()=>setTimeout(load,500));
})();