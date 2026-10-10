"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Progress = {
  id: string; patient_id: string; assignment_id: string | null;
  observed_on: string; week_number: number; domain: string; task_name: string;
  protocol_key: string | null; conditions_description: string; comparable_conditions: boolean;
  opportunities: number | null; independent_successes: number | null;
  cue_intensity: string; cue_types: string[]; error_types: string[];
  fatigue: number | null; participation: string; functional_transfer: string;
  clinician_notes: string; ocr_transcript: string; transcript_reviewed: boolean;
  photo_paths: string[]; supersedes_id: string | null; created_at: string;
};
type Assignment = {id:string; title:string; patient_document?:{clinical_area?:string;neuro_profile?:{week_number?:number;domain?:string}}};
type Domain = { value:string; label:string };
const BASE="https://grgyvdxkjdstdyumdfyg.supabase.co";
const APIKEY="sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
const BUCKET="clinical-neuro-handwriting";
const domains:Domain[]=[
  {value:"orientacion_temporal",label:"Orientación temporal"},
  {value:"orientacion_espacial",label:"Orientación espacial"},
  {value:"orientacion_personal",label:"Orientación personal"},
  {value:"atencion",label:"Atención"},
  {value:"memoria",label:"Memoria"},
  {value:"funciones_ejecutivas",label:"Funciones ejecutivas"},
  {value:"lenguaje",label:"Lenguaje"},
  {value:"visuoespacial",label:"Visuoespacial"},
  {value:"praxias_gnosias",label:"Praxias y gnosias"},
  {value:"cognicion_funcional",label:"Cognición funcional"}
];
const cues=[["visual","Visual"],["verbal","Verbal"],["semantic","Semántica"],["phonological","Fonológica"],["modeling","Modelado"],["repetition","Repetición"],["choice","Elección"],["external_aid","Ayuda externa"],["other","Otra"]];
const errors=[["omission","Omisión"],["intrusion","Intrusión"],["perseveration","Perseveración"],["substitution","Sustitución"],["spatial","Espacial"],["sequencing","Secuenciación"],["comprehension","Comprensión"],["other","Otro"]];
const cueLabels:Record<string,string>={none:"Sin ayudas",light:"Pistas leves",moderate:"Ayudas moderadas",intensive:"Ayudas intensivas",not_recorded:"Sin registrar"};
const transferLabels:Record<string,string>={not_assessed:"No valorada",not_observed:"No observada",with_support:"Con ayuda",independent:"Autónoma"};
const today=()=>{const p=new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Madrid",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());const v=Object.fromEntries(p.map(x=>[x.type,x.value]));return v.year+"-"+v.month+"-"+v.day;};
const clean=(v:string)=>v.trim();
const validUuid=(v:string)=>/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(v);
function sessionToken():string {
  let auth:unknown=null;
  try{auth=JSON.parse(sessionStorage.getItem("dememoria_admin_session")||"null");}catch{}
  if(!auth || typeof auth!=="object")throw new Error("Inicia sesión profesional para acceder al seguimiento.");
  const token=(auth as {access_token?:string}).access_token;
  if(!token)throw new Error("Falta una sesión profesional válida.");
  return token;
}
function headers(contentType=true){
  const h:Record<string,string>={apikey:APIKEY,Authorization:"Bearer "+sessionToken()};
  if(contentType)h["Content-Type"]="application/json";
  return h;
}
async function responseJson(r:Response) {
  const body=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(typeof body?.message==="string"?body.message:typeof body?.error==="string"?body.error:"No se pudo completar la operación.");
  return body;
}
async function listProgress(patientId:string):Promise<Progress[]> {
  const q=new URLSearchParams({select:"*",patient_id:"eq."+patientId,order:"observed_on.asc,created_at.asc",limit:"250"});
  const response=await fetch(BASE+"/rest/v1/clinical_neuro_progress?"+q,{headers:headers(),cache:"no-store"});
  return await responseJson(response) as Progress[];
}
async function listAssignments(patientId:string):Promise<Assignment[]> {
  const q=new URLSearchParams({select:"id,title,patient_document",patient_id:"eq."+patientId,order:"created_at.desc",limit:"100"});
  const response=await fetch(BASE+"/rest/v1/clinical_exercise_assignments?"+q,{headers:headers(),cache:"no-store"});
  return (await responseJson(response) as Assignment[]).filter(x=>x.patient_document?.clinical_area==="neuropsychology");
}
function dateDisplay(value:string){try{return new Intl.DateTimeFormat("es-ES",{day:"2-digit",month:"short",year:"numeric",timeZone:"UTC"}).format(new Date(value.slice(0,10)+"T12:00:00Z"));}catch{return value;}}
const defaults=()=>({
  observed_on:today(),week_number:"1",domain:"memoria",task_name:"",
  protocol_key:"",conditions_description:"",comparable_conditions:false,
  opportunities:"",independent_successes:"",cue_intensity:"not_recorded",
  cue_types:[] as string[],error_types:[] as string[],fatigue:"",
  participation:"not_recorded",functional_transfer:"not_assessed",clinician_notes:"",
  ocr_transcript:"",transcript_reviewed:false,assignment_id:"",supersedes_id:""
});
type FormData=ReturnType<typeof defaults>;
function toggle(values:string[],name:string){return values.includes(name)?values.filter(x=>x!==name):[...values,name];}

export default function NeuroFollowup(){
  const [patientId,setPatientId]=useState("");
  const [entries,setEntries]=useState<Progress[]>([]);
  const [assignments,setAssignments]=useState<Assignment[]>([]);
  const [draft,setDraft]=useState<FormData>(defaults);
  const [photos,setPhotos]=useState<File[]>([]);
  const [status,setStatus]=useState("");
  const [saving,setSaving]=useState(false);
  const [ocrBusy,setOcrBusy]=useState(false);
  const [photoBusy,setPhotoBusy]=useState(false);
  const [expanded,setExpanded]=useState(false);
  const [series,setSeries]=useState("");
  const operation=useRef(0);
  const uploadInput=useRef<HTMLInputElement>(null);
  const setField=<K extends keyof FormData>(key:K,value:FormData[K])=>setDraft(p=>({...p,[key]:value}));

  useEffect(()=>{
    const opened=(e:Event)=>{
      const id=(e as CustomEvent<{patientId?:string}>).detail?.patientId||"";
      if(!validUuid(id))return;
      const seq=++operation.current;
      setPatientId(id);setEntries([]);setAssignments([]);setStatus("");setDraft(defaults());setPhotos([]);setExpanded(false);
      Promise.all([listProgress(id),listAssignments(id)]).then(([a,b])=>{
        if(operation.current===seq){setEntries(a);setAssignments(b);}
      }).catch(err=>{if(operation.current===seq)setStatus(err instanceof Error?err.message:"Error de acceso al registro.");});
    };
    window.addEventListener("clinical:patient-opened",opened);
    return ()=>{window.removeEventListener("clinical:patient-opened",opened);operation.current+=1;};
  },[]);

  const visible=useMemo(()=>{
    const overridden=new Set(entries.filter(e=>e.supersedes_id).map(e=>e.supersedes_id));
    return entries.filter(e=>!overridden.has(e.id));
  },[entries]);
  const seriesOptions=useMemo(()=>{
    const keys=new Set(visible.filter(x=>x.comparable_conditions&&x.protocol_key&&x.opportunities&&x.independent_successes!==null).map(x=>x.protocol_key+"||"+x.conditions_description.trim().toLowerCase()));
    return Array.from(keys);
  },[visible]);
  const chosenSeries=seriesOptions.includes(series)?series:seriesOptions[0]||"";
  const points=useMemo(()=>{
    return visible.filter(x=>x.comparable_conditions&&x.protocol_key&&x.opportunities&&x.independent_successes!==null&&x.protocol_key+"||"+x.conditions_description.trim().toLowerCase()===chosenSeries)
      .sort((a,b)=>a.observed_on.localeCompare(b.observed_on)||a.created_at.localeCompare(b.created_at));
  },[visible,chosenSeries]);

  async function reload(){
    if(!patientId)return;
    const fresh=await listProgress(patientId);
    setEntries(fresh);
  }
  function assign(value:string){
    const a=assignments.find(x=>x.id===value);
    setDraft(d=>({...d,assignment_id:value,week_number:String(a?.patient_document?.neuro_profile?.week_number||d.week_number),domain:a?.patient_document?.neuro_profile?.domain||d.domain,task_name:d.task_name||a?.title||""}));
  }
  async function localOcr(){
    if(photos.length===0){setStatus("Selecciona antes una foto de la actividad.");return;}
    setOcrBusy(true);setStatus("Reconocimiento local en el dispositivo. El texto manuscrito puede necesitar corrección importante.");
    let worker:Awaited<ReturnType<(typeof import("tesseract.js"))["createWorker"]>>|null=null;
    try{
      const {createWorker}=await import("tesseract.js");
      worker=await createWorker("spa");
      const texts:string[]=[];
      for(const [i,file] of photos.entries()){
        const result=await worker.recognize(file);
        texts.push("Fotografía "+(i+1)+":\n"+(result.data.text||"").trim());
      }
      setDraft(prev=>({...prev,ocr_transcript:texts.join("\n\n").slice(0,6000),transcript_reviewed:false}));
      setStatus("Texto extraído. Corrige manualmente la transcripción y confirma su revisión antes de guardarla. No se ha puntuado ni interpretado ninguna respuesta.");
    }catch(error){
      setStatus("El OCR local no está disponible o no pudo interpretar la imagen. Puedes transcribir manualmente y conservar la fotografía original. "+(error instanceof Error?error.message:""));
    }finally{
      await worker?.terminate().catch(()=>{});
      setOcrBusy(false);
    }
  }
  async function sanitizeImage(file:File,index:number):Promise<File>{
    const imageType=file.type.toLowerCase();
    if(!["image/jpeg","image/png","image/webp","image/heic","image/heif",""].includes(imageType)){
      throw new Error("Formato de fotografía no reconocido.");
    }
    if(file.size===0||file.size>20*1024*1024)throw new Error("La fotografía supera el límite de 20 MB de entrada.");
    let bitmap:ImageBitmap|null=null;
    let fallback:HTMLImageElement|null=null;
    try{bitmap=await createImageBitmap(file);}
    catch{
      const url=URL.createObjectURL(file);
      try{
        const image=new Image();
        await new Promise<void>((resolve,reject)=>{
          image.onload=()=>resolve();
          image.onerror=()=>reject(new Error("Este formato de fotografía no se puede leer en tu navegador. Convierte HEIC a JPEG o PNG antes de continuar."));
          image.src=url;
        });
        fallback=image;
      }finally{URL.revokeObjectURL(url);}
    }
    const width=bitmap?.width||fallback?.naturalWidth||0;
    const height=bitmap?.height||fallback?.naturalHeight||0;
    if(width<50||height<50||width*height>90000000)throw new Error("Resolución de fotografía no válida.");
    const scale=Math.min(1,3200/Math.max(width,height));
    const canvas=document.createElement("canvas");
    canvas.width=Math.round(width*scale);canvas.height=Math.round(height*scale);
    const ctx=canvas.getContext("2d",{alpha:false});
    if(!ctx)throw new Error("No es posible preparar la imagen en este dispositivo.");
    ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);
    if(bitmap){ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();}
    else if(fallback)ctx.drawImage(fallback,0,0,canvas.width,canvas.height);
    for(const quality of [0.91,0.8,0.68]){
      const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/jpeg",quality));
      if(blob&&blob.size<=8388608)return new File([blob],"ficha-manuscrita-"+(index+1)+".jpg",{type:"image/jpeg"});
    }
    throw new Error("La fotografía sigue siendo demasiado grande. Reduce su resolución.");
  }
  async function selectPhotos(files:FileList|null){
    if(!files)return;
    const selected=Array.from(files);
    if(selected.length>4){setStatus("Puedes adjuntar hasta cuatro fotografías por observación.");return;}
    setPhotoBusy(true);setStatus("Preparando fotos y eliminando metadatos de cámara y ubicación…");
    try{
      const cleaned:File[]=[];
      for(const [i,file] of selected.entries())cleaned.push(await sanitizeImage(file,i));
      setPhotos(cleaned);
      setDraft(p=>({...p,ocr_transcript:"",transcript_reviewed:false}));
      setStatus("Fotografías listas para revisar: convertidas a JPEG y sin metadatos EXIF/GPS. Comprueba que el texto sea legible.");
    }catch(error){
      setPhotos([]);if(uploadInput.current)uploadInput.current.value="";
      setStatus(error instanceof Error?error.message:"No se pudo preparar la fotografía.");
    }finally{setPhotoBusy(false);}
  }
  async function save(){
    if(!patientId||saving||ocrBusy||photoBusy)return;
    const task=clean(draft.task_name);
    const week=Number(draft.week_number);
    const n=draft.opportunities===""?null:Number(draft.opportunities);
    const correct=draft.independent_successes===""?null:Number(draft.independent_successes);
    if(task.length<3||task.length>180){setStatus("Describe la tarea (entre 3 y 180 caracteres).");return;}
    if(!Number.isInteger(week)||week<1||week>52){setStatus("La semana debe estar entre 1 y 52.");return;}
    if((n===null)!==(correct===null)||n!==null&&(!Number.isInteger(n)||n<1||n>100||!Number.isInteger(correct)||correct===null||correct<0||correct>n)){
      setStatus("Indica tanto oportunidades como respuestas autónomas, de 0 a las oportunidades totales, o deja ambas vacías.");return;
    }
    if(draft.comparable_conditions&&(clean(draft.protocol_key).length<3||clean(draft.conditions_description).length<10)){
      setStatus("Para comparar semanas introduce identificador del mismo protocolo y condiciones precisas: estímulos, ayudas, consigna y modalidad.");return;
    }
    if(clean(draft.ocr_transcript).length>0&&!draft.transcript_reviewed){
      setStatus("La transcripción necesita revisión y confirmación profesional. Si no es legible, bórrala y guarda únicamente las fotos.");return;
    }
    if(photos.length===0&&draft.ocr_transcript.length===0&&draft.clinician_notes.length===0&&n===null&&draft.cue_intensity==="not_recorded"){
      setStatus("Añade al menos una observación clínica, una fotografía o un registro de ejecución.");return;
    }
    if(draft.clinician_notes.length>3500||draft.ocr_transcript.length>6000||draft.conditions_description.length>1000){
      setStatus("Revisa la extensión de los campos de texto.");return;
    }
    setSaving(true);setStatus("Guardando observación privada…");
    const uploaded:string[]=[];
    const newId=crypto.randomUUID();
    try{
      for(const [i,file] of photos.entries()){
        const extension=file.type==="image/jpeg"?"jpg":file.type==="image/png"?"png":"webp";
        const path=patientId+"/"+newId+"/"+crypto.randomUUID()+"-"+(i+1)+"."+extension;
        const res=await fetch(BASE+"/storage/v1/object/"+BUCKET+"/"+path,{
          method:"POST",headers:{...headers(false),"Content-Type":file.type,"x-upsert":"false"},body:file
        });
        if(!res.ok){const body=await res.json().catch(()=>({}));throw new Error(body?.message||body?.error||"Error al subir foto al almacenamiento privado.");}
        uploaded.push(path);
      }
      const record={
        id:newId,patient_id:patientId,assignment_id:draft.assignment_id||null,
        observed_on:draft.observed_on,week_number:week,domain:draft.domain,task_name:task,
        protocol_key:clean(draft.protocol_key)||null,conditions_description:clean(draft.conditions_description),
        comparable_conditions:draft.comparable_conditions,opportunities:n,independent_successes:correct,
        cue_intensity:draft.cue_intensity,cue_types:draft.cue_types,error_types:draft.error_types,
        fatigue:draft.fatigue===""?null:Number(draft.fatigue),participation:draft.participation,
        functional_transfer:draft.functional_transfer,clinician_notes:clean(draft.clinician_notes),
        ocr_transcript:clean(draft.ocr_transcript),transcript_reviewed:draft.transcript_reviewed,
        photo_paths:uploaded,supersedes_id:draft.supersedes_id||null
      };
      const res=await fetch(BASE+"/rest/v1/clinical_neuro_progress",{
        method:"POST",headers:{...headers(),Prefer:"return=representation"},body:JSON.stringify(record)
      });
      await responseJson(res);
      await reload();setDraft(defaults());setPhotos([]);
      if(uploadInput.current)uploadInput.current.value="";
      setExpanded(false);setStatus("Observación guardada en la ficha clínica. No se ha compartido con el paciente.");
    }catch(error){
      for(const path of uploaded)await fetch(BASE+"/storage/v1/object/"+BUCKET+"/"+path,{method:"DELETE",headers:headers(false)}).catch(()=>null);
      setStatus(error instanceof Error?error.message:"No se ha podido guardar el seguimiento.");
    }finally{setSaving(false);}
  }
  async function openPhoto(path:string){
    const popup=window.open("about:blank","_blank");
    if(!popup){setStatus("El navegador ha bloqueado la fotografía. Permite abrir una pestaña nueva.");return;}
    try{
      const res=await fetch(BASE+"/storage/v1/object/authenticated/"+BUCKET+"/"+path,{headers:headers(false),cache:"no-store"});
      if(!res.ok)throw new Error("No se pudo abrir el original privado.");
      const url=URL.createObjectURL(await res.blob());
      popup.location.href=url;window.setTimeout(()=>URL.revokeObjectURL(url),120000);
    }catch(error){popup.close();setStatus(error instanceof Error?error.message:"No se pudo recuperar la fotografía.");}
  }
  function supersede(row:Progress){
    setDraft({...defaults(),observed_on:today(),week_number:String(row.week_number),domain:row.domain,task_name:row.task_name,
      protocol_key:row.protocol_key||"",conditions_description:row.conditions_description,
      comparable_conditions:row.comparable_conditions,opportunities:row.opportunities===null?"":String(row.opportunities),
      independent_successes:row.independent_successes===null?"":String(row.independent_successes),
      cue_intensity:row.cue_intensity,cue_types:row.cue_types,error_types:row.error_types,
      fatigue:row.fatigue===null?"":String(row.fatigue),participation:row.participation,
      functional_transfer:row.functional_transfer,clinician_notes:row.clinician_notes,
      ocr_transcript:row.ocr_transcript,transcript_reviewed:row.transcript_reviewed,
      assignment_id:row.assignment_id||"",supersedes_id:row.id});
    setPhotos([]);setExpanded(true);setStatus("Corrección: se conservará el registro original y crearás otro que lo sustituye. Las fotos originales permanecen en su registro histórico.");
  }
  return (
    <section className="neuro-followup" aria-label="Seguimiento neuropsicológico profesional">
      <div className="neuro-followup-heading">
        <div><p className="clinic-eyebrow">Solo profesional · Neuropsicología</p><h3>Seguimiento de actividades</h3>
          <p>Registros descriptivos por semana, ayudas y errores cualitativos. No son baremos ni pruebas diagnósticas.</p></div>
        <button className="clinic-secondary" type="button" onClick={()=>setExpanded(v=>!v)}>{expanded?"Ocultar editor":"Registrar observación"}</button>
      </div>
      {status&&<p className="clinic-message" role="status">{status}</p>}
      {expanded&&<div className="neuro-followup-editor" onKeyDown={event=>{if(event.key==="Enter"&&event.target instanceof HTMLInputElement&&event.target.type!=="checkbox"&&event.target.type!=="file")event.preventDefault();}}>
        <div className="neuro-followup-grid">
          <label>Fecha de observación<input type="date" value={draft.observed_on} max={today()} onChange={e=>setField("observed_on",e.target.value)} /></label>
          <label>Semana<input type="number" min="1" max="52" value={draft.week_number} onChange={e=>setField("week_number",e.target.value)}/></label>
          <label>Dominio cognitivo<select value={draft.domain} onChange={e=>setField("domain",e.target.value)}>{domains.map(d=><option value={d.value} key={d.value}>{d.label}</option>)}</select></label>
          <label>Material asociado (opcional)<select value={draft.assignment_id} onChange={e=>assign(e.target.value)}><option value="">Registro sin ficha asociada</option>{assignments.map(a=><option key={a.id} value={a.id}>{a.title}</option>)}</select></label>
          <label className="neuro-wide">Actividad concreta<input maxLength={180} value={draft.task_name} onChange={e=>setField("task_name",e.target.value)} placeholder="Ej. búsqueda de letras con 20 estímulos"/></label>
          <label>Oportunidades observadas (opcional)<input type="number" min="1" max="100" value={draft.opportunities} onChange={e=>setField("opportunities",e.target.value)}/></label>
          <label>Respuestas autónomas (opcional)<input type="number" min="0" max="100" value={draft.independent_successes} onChange={e=>setField("independent_successes",e.target.value)}/></label>
          <label>Intensidad de ayuda<select value={draft.cue_intensity} onChange={e=>setField("cue_intensity",e.target.value)}>
            {Object.entries(cueLabels).map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label>
          <label>Fatiga observada<select value={draft.fatigue} onChange={e=>setField("fatigue",e.target.value)}>
            <option value="">No valorada</option><option value="0">0 · Ausente</option><option value="1">1 · Leve</option><option value="2">2 · Moderada</option><option value="3">3 · Intensa</option></select></label>
          <label>Participación<select value={draft.participation} onChange={e=>setField("participation",e.target.value)}>
            <option value="not_recorded">No registrada</option><option value="good">Adecuada</option><option value="variable">Variable</option><option value="limited">Limitada</option><option value="declined">Prefirió no realizarla</option></select></label>
          <label>Transferencia funcional<select value={draft.functional_transfer} onChange={e=>setField("functional_transfer",e.target.value)}>
            {Object.entries(transferLabels).map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label>
        </div>
        <div className="neuro-followup-chips">
          <fieldset><legend>Ayudas utilizadas</legend>{cues.map(([key,label])=><label key={key}><input type="checkbox" checked={draft.cue_types.includes(key)} onChange={()=>setField("cue_types",toggle(draft.cue_types,key))}/>{label}</label>)}</fieldset>
          <fieldset><legend>Errores observados</legend>{errors.map(([key,label])=><label key={key}><input type="checkbox" checked={draft.error_types.includes(key)} onChange={()=>setField("error_types",toggle(draft.error_types,key))}/>{label}</label>)}</fieldset>
        </div>
        <label className="neuro-block">Notas cualitativas profesionales<textarea rows={3} maxLength={3500} value={draft.clinician_notes} onChange={e=>setField("clinician_notes",e.target.value)} placeholder="Estrategias, errores, fluctuaciones, observaciones sensoriales o motoras…"/></label>
        <fieldset className="neuro-comparability">
          <legend>Comparabilidad longitudinal</legend>
          <label className="neuro-check"><input type="checkbox" checked={draft.comparable_conditions} onChange={e=>setField("comparable_conditions",e.target.checked)}/>He comprobado que este protocolo y sus condiciones pueden compararse con anteriores registros.</label>
          <div className="neuro-followup-grid">
            <label>Identificador de protocolo<input value={draft.protocol_key} maxLength={120} onChange={e=>setField("protocol_key",e.target.value)} placeholder="Ej. AT01-v1"/></label>
            <label>Condiciones específicas<input value={draft.conditions_description} maxLength={1000} onChange={e=>setField("conditions_description",e.target.value)} placeholder="N.º de estímulos, consigna, ayudas, modalidad de respuesta…"/></label>
          </div>
          <p>Solo se representan juntas las observaciones con igual identificador y descripción de condiciones, y con comparabilidad confirmada. No se infieren cambios clínicos.</p>
        </fieldset>
        <fieldset className="neuro-photos">
          <legend>Actividades manuscritas y fotografías</legend>
          <p>Adjunta hasta cuatro fotos realizadas por el paciente (JPG, PNG, WebP o HEIC si el navegador puede leerlo). Eliminamos metadatos de cámara/ubicación y almacenamos una copia JPEG privada. El OCR se procesa en este navegador, sin enviar las fotos a un servicio de IA. La escritura manuscrita puede no reconocerse correctamente.</p>
          <input ref={uploadInput} type="file" accept="image/*,.heic,.heif" multiple onChange={e=>{void selectPhotos(e.target.files);}} aria-label="Adjuntar fotografías de los ejercicios"/>
          {photos.length>0&&<p>{photos.map(f=>f.name).join(" · ")}</p>}
          <button className="clinic-secondary" type="button" disabled={ocrBusy||photoBusy||!photos.length} onClick={localOcr}>{ocrBusy?"Reconociendo texto…":"Extraer texto orientativo (OCR)"}</button>
          <label className="neuro-block">Transcripción corregida por la profesional
            <textarea rows={5} maxLength={6000} value={draft.ocr_transcript} onChange={e=>{setField("ocr_transcript",e.target.value);setField("transcript_reviewed",false);}} placeholder="Corrige las respuestas extraídas o transcríbelas manualmente. No introduzcas puntuaciones automáticas."/>
          </label>
          <label className="neuro-check"><input type="checkbox" checked={draft.transcript_reviewed} onChange={e=>setField("transcript_reviewed",e.target.checked)}/>He contrastado personalmente la transcripción con la fotografía original y he corregido errores de lectura.</label>
        </fieldset>
        <div className="neuro-followup-actions"><button type="button" className="clinic-primary" disabled={saving||ocrBusy||photoBusy||!patientId} onClick={save}>{saving?"Guardando…":draft.supersedes_id?"Guardar corrección como nuevo registro":"Guardar registro y fotos"}</button></div>
      </div>}
      <div className="neuro-followup-results">
        <div className="neuro-followup-heading"><h4>Historial descriptivo</h4><span>{visible.length} observaciones</span></div>
        {visible.length===0?<p className="clinic-note">Todavía no hay observaciones. Los registros se crearán solo cuando los revises y guardes.</p>:(
          <>
            <label className="neuro-chart-select">Serie comparable
              <select value={chosenSeries} onChange={e=>setSeries(e.target.value)}>
                {seriesOptions.length===0?<option value="">Sin observaciones comparables</option>:seriesOptions.map(key=><option value={key} key={key}>{key.split("||")[0]} · {key.split("||")[1].slice(0,48)}</option>)}
              </select>
            </label>
            {points.length>=2?<div className="neuro-chart">
              <p>Porcentaje descriptivo de respuestas autónomas. Comparación limitada a condiciones declaradas equivalentes.</p>
              <svg viewBox="0 0 640 240" role="img" aria-label="Proporción de respuestas independientes registradas por observación comparable">
                {[0,25,50,75,100].map(v=><g key={v}><line x1="50" x2="615" y1={190-v*1.55} y2={190-v*1.55} stroke="#d7e5ee"/><text x="8" y={195-v*1.55} fontSize="12" fill="#173a5e">{v}%</text></g>)}
                <polyline fill="none" stroke="#08a6a0" strokeWidth="3" points={points.map((p,i)=>((50+(565*i)/(points.length-1)))+","+(190-1.55*(100*(p.independent_successes||0)/(p.opportunities||1)))).join(" ")}/>
                {points.map((p,i)=><g key={p.id}><circle cx={50+565*i/(points.length-1)} cy={190-1.55*100*(p.independent_successes||0)/(p.opportunities||1)} r="5" fill="#173a5e"/><text x={50+565*i/(points.length-1)} y="217" textAnchor="middle" fontSize="11" fill="#173a5e">{p.observed_on.slice(5)}</text></g>)}
              </svg>
              <p>No equivale a progreso terapéutico ni a cambio psicométrico. Considerar fatiga, contexto, ayudas y práctica.</p>
            </div>:<p className="clinic-note">Para mostrar el gráfico hacen falta dos observaciones con el mismo protocolo y condiciones comparables, además de oportunidades y respuestas autónomas registradas.</p>}
            <div className="neuro-timeline">{[...visible].reverse().map(row=><article key={row.id}>
              <div className="neuro-entry-top"><strong>{row.task_name}</strong><span>{dateDisplay(row.observed_on)} · Semana {row.week_number}</span></div>
              <p>{domains.find(d=>d.value===row.domain)?.label||row.domain} · {cueLabels[row.cue_intensity]||row.cue_intensity} · Transferencia: {transferLabels[row.functional_transfer]||row.functional_transfer}</p>
              {row.opportunities!==null&&<p>Respuestas autónomas: {row.independent_successes}/{row.opportunities} (descriptivo, sin baremos).</p>}
              {row.error_types.length>0&&<p>Tipos de error: {row.error_types.join(", ")}</p>}
              {row.clinician_notes&&<p className="neuro-entry-notes">{row.clinician_notes}</p>}
              {row.ocr_transcript&&<details><summary>Transcripción OCR revisada</summary><pre>{row.ocr_transcript}</pre></details>}
              {row.photo_paths.length>0&&<div className="neuro-photo-links">{row.photo_paths.map((path,i)=><button type="button" className="clinic-secondary" key={path} onClick={()=>openPhoto(path)}>Ver foto privada {i+1}</button>)}</div>}
              <button type="button" className="clinic-text" onClick={()=>supersede(row)}>Registrar corrección</button>
            </article>)}</div>
          </>
        )}
      </div>
    </section>
  );
}
