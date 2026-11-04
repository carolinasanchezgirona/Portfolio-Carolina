(() => {
 "use strict";
 const API="https://grgyvdxkjdstdyumdfyg.supabase.co/functions/v1/adhd-clinical-forms";
 const PUB="sb_publishable_b2MRfP0bPti87V2FXCzHGw_Y9vvcbii";
 const config={
  anamnesis:{title:"Anamnesis clínica y evolutiva",fields:[
   ["motivo","¿Cuál es el motivo principal de tu consulta? ¿Qué te gustaría aclarar?"],
   ["inicio_actual","¿Desde cuándo notas las dificultades actuales? ¿Han cambiado con el tiempo?"],
   ["infancia","¿Qué recuerdas de tu infancia, de tu comportamiento y de tu desarrollo?"],
   ["escuela","¿Cómo fue la etapa escolar en primaria, tanto en aprendizaje como en organización?"],
   ["adolescencia","¿Cómo fueron la adolescencia, las relaciones y la autonomía?"],
   ["universidad","¿Cómo han sido los estudios posteriores o la formación profesional?"],
   ["trabajo","¿Cómo ha sido tu trayectoria laboral y qué dificultades o fortalezas identificas?"],
   ["organizacion","¿Cómo te organizas con horarios, tareas, obligaciones y tiempo?"],
   ["relaciones","¿Cómo influyen estas dificultades en tus relaciones y convivencia?"],
   ["estrategias","¿Qué estrategias utilizas para compensarlas? ¿Cuánto esfuerzo te suponen?"],
   ["sueno","¿Cómo duermes normalmente? Describe horarios, descanso y fatiga."],
   ["salud","¿Hay aspectos médicos o neurológicos relevantes que quieras comentar?"],
   ["medicacion","¿Tomas medicación o has recibido tratamientos que puedan ser relevantes?"],
   ["consumos","¿Hay consumos de sustancias que puedan influir en la atención o el estado de ánimo?"],
   ["antecedentes","¿Existen antecedentes familiares o personales de problemas de salud mental o neurodesarrollo?"],
   ["informantes","¿Dispones de informes escolares o familiares que puedan aportar recuerdos de tu infancia?"],
   ["otros","¿Hay algún aspecto más que consideres importante para la evaluación?"]
  ]},
  funcionamiento:{title:"Funcionamiento cotidiano",fields:[
   ["trabajo_estudio","Describe dificultades concretas en trabajo o estudios y sus consecuencias."],
   ["hogar","¿Cómo gestionas el hogar, el autocuidado y tus responsabilidades?"],
   ["economia","¿Tienes dificultades para organizar gastos, pagos o documentación económica?"],
   ["tiempo","¿Cómo gestionas citas, plazos, puntualidad y prioridades?"],
   ["relaciones","¿Qué impacto observas en amistades, pareja o comunicación?"],
   ["familia","¿Cómo afecta a la convivencia o a las responsabilidades familiares?"],
   ["ocio","¿Cómo organizas el descanso, el ocio o las aficiones?"],
   ["autoconcepto","¿Cómo han influido estas dificultades en tu autoestima o frustración?"],
   ["compensaciones","¿Qué apoyos y estrategias compensatorias utilizas?"],
   ["interferencia","¿Qué ámbitos se ven más afectados y con qué intensidad?"],
   ["ejemplos","Describe ejemplos concretos recientes y su frecuencia."]
  ]}
 };
 let invitation="",session="",currentType="",stage="intro",saving=false;
 const $=id=>document.getElementById(id);
 const intro=$("adhd-patient-intro"),check=$("adhd-patient-check-code"),form=$("adhd-patient-form");
 const feedback=$("adhd-patient-state"),fields=$("adhd-patient-fields");
 const request=$("adhd-request-code"),again=$("adhd-again"),verify=$("adhd-verify-code"),save=$("adhd-save-draft"),submit=$("adhd-submit");
 const fragments=new URLSearchParams(window.location.hash.replace(/^#/,""));
 invitation=(fragments.get("invitacion")||"").trim();
 history.replaceState(null,"",location.pathname+location.search);
 function message(t,error=false){feedback.textContent=t;feedback.classList.toggle("error",Boolean(error))}
 function show(which){stage=which;intro.hidden=which!=="intro";check.hidden=which!=="code";form.hidden=which!=="form"}
 async function api(action,data={}){
  const r=await fetch(API,{
   method:"POST",cache:"no-store",credentials:"omit",
   headers:{"Content-Type":"application/json",apikey:PUB},
   body:JSON.stringify({action,...data})
  });
  const payload=await r.json().catch(()=>({}));
  if(!r.ok)throw Error(payload.error||"No se pudo completar la operación.");
  return payload;
 }
 async function requestCode(){
  if(!/^[a-f0-9]{64}$/.test(invitation)){message("Este enlace no es válido. Solicita una nueva invitación a la consulta.",true);return}
  try{
   request.disabled=true;again.disabled=true;message("Solicitando código…");
   const res=await api("request_code",{invite_token:invitation});
   show("code");message(res.message||"Revisa tu correo electrónico para acceder.");
  }catch(e){message(e.message,true)}finally{request.disabled=false;again.disabled=false}
 }
 function renderFields(data){
  const definition=config[currentType];if(!definition){throw Error("Formulario no disponible.")}
  $("adhd-form-title").textContent=definition.title;
  fields.replaceChildren();
  definition.fields.forEach(([key,title])=>{
    const label=document.createElement("label");label.textContent=title;
    const input=document.createElement("textarea");input.rows=3;input.maxLength=4000;input.dataset.field=key;
    input.value=typeof data[key]==="string"?data[key]:"";
    input.placeholder="Escribe aquí tu respuesta…";
    label.append(input);fields.append(label);
  });
 }
 function answerData(){const result={};fields.querySelectorAll("textarea[data-field]").forEach(x=>result[x.dataset.field]=x.value.trim());return result}
 async function load(){
  const res=await api("open",{session_token:session});
  currentType=res.form_key;
  renderFields(res.answers||{});show("form");message("Formulario abierto. Puedes guardar y continuar más adelante.");
 }
 async function verifyCode(){
  const value=($("adhd-code").value||"").trim();
  if(!/^\d{6}$/.test(value)){message("Introduce los seis dígitos del código.",true);return}
  try{
   verify.disabled=true;message("Verificando…");
   const res=await api("verify_code",{invite_token:invitation,code:value});
   session=res.session_token;invitation="";
   $("adhd-code").value="";
   await load();
  }catch(e){message(e.message||"No se pudo verificar el código.",true)}finally{verify.disabled=false}
 }
 async function saveAnswers(final){
  if(!session||saving)return;
  if(final&&!window.confirm("¿Confirmas que deseas enviar estas respuestas definitivamente? Después no podrás modificarlas desde este enlace."))return;
  saving=true;save.disabled=true;submit.disabled=true;message(final?"Enviando respuestas…":"Guardando borrador…");
  try{
   await api(final?"submit":"save",{session_token:session,answers:answerData()});
   if(final){
    session="";fields.replaceChildren();show("intro");request.disabled=true;
    intro.replaceChildren();const h=document.createElement("h2");h.textContent="Respuestas enviadas";
    const p=document.createElement("p");p.textContent="Tus respuestas se han recibido correctamente. La profesional las revisará antes de extraer conclusiones clínicas. Puedes cerrar esta ventana.";
    intro.append(h,p);message("Envío completado.");
   }else message("Borrador guardado. Puedes volver con tu invitación y solicitar un nuevo código si cierras la página.");
  }catch(e){message(e.message||"No se pudieron guardar las respuestas.",true)}
  finally{saving=false;save.disabled=false;submit.disabled=false}
 }
 request.addEventListener("click",requestCode);
 again.addEventListener("click",requestCode);
 verify.addEventListener("click",verifyCode);
 save.addEventListener("click",()=>saveAnswers(false));
 submit.addEventListener("click",()=>saveAnswers(true));
 if(!/^[a-f0-9]{64}$/.test(invitation)){request.disabled=true;message("No hay una invitación válida en este enlace. Solicita al profesional que vuelva a enviártela.",true)}
})();