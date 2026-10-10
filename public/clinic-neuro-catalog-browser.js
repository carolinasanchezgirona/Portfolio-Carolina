/* Catálogo profesional original para EntreSesiones. Sin contenidos licenciados de terceros. */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const LEVELS = {apoyo_alto:"Inicial",apoyo_moderado:"Intermedio",autonomo:"Avanzado"};
  const FORMATS = {visual:"Visual",verbal:"Verbal",funcional:"Funcional",logico:"Razonamiento"};
  const normalize = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/_/g," ").trim();
  const key = item => [item.domain,item.level,item.title].join("::");
  const filter = (items,filters={}) => items.filter(item =>
    (!filters.domain || item.domain===filters.domain) &&
    (!filters.level || item.level===filters.level) &&
    (!filters.format || item.format===filters.format) &&
    (!filters.query || normalize([item.title,item.task,item.domain,item.stimuli].join(" ")).includes(normalize(filters.query)))
  );
  const el = (tag,text,className) => {
    const node=document.createElement(tag);
    if(text!==undefined)node.textContent=text;
    if(className)node.className=className;
    return node;
  };
  let shown=8;
  function init() {
    const browser=$("clinic-neuro-catalog");
    const composer=window.NeuroWeeklyComposer;
    if(!browser || !composer || typeof composer.catalog!=="function")return false;
    const items=composer.catalog();
    const domains=composer.GROUPS;
    const domain=$("clinic-neuro-catalog-domain"),level=$("clinic-neuro-catalog-level");
    const format=$("clinic-neuro-catalog-format"),query=$("clinic-neuro-catalog-search");
    const list=$("clinic-neuro-catalog-results"),count=$("clinic-neuro-catalog-count");
    const more=$("clinic-neuro-catalog-more");
    if(!domain || !level || !format || !query || !list || !count || !more)return false;
    for(const [value,name] of domains) {
      const option=el("option",name);
      option.value=value;
      domain.appendChild(option);
    }
    const titleByDomain = Object.fromEntries(domains);
    function prepare(item){
      // Una elección del catálogo genera la actividad exacta, sin sustituirla por una aleatoria.
      const mode=$("clinic-neuro-mode"),chosenDomain=$("clinic-neuro-domain");
      const chosenLevel=$("clinic-neuro-level"),chosenFormat=$("clinic-neuro-format");
      if(!mode || !chosenDomain || !chosenLevel || !chosenFormat)return;
      mode.value="individual";
      chosenDomain.value=item.domain;
      const focus=$("clinic-neuro-focus");
      if(focus)focus.value=item.domain;
      chosenLevel.value=item.level;
      chosenFormat.value=item.format;
      const activityType=$("clinic-neuro-activity-type");
      if(activityType)activityType.value="ficha";
      mode.dispatchEvent(new Event("change",{bubbles:true}));
      window.NeuroSelectedRecipe={domain:item.domain,level:item.level,title:item.title};
      try {
        $("clinic-neuro-generate")?.click();
      } finally {
        // Nunca deja una selección oculta que altere posteriores generaciones.
        window.NeuroSelectedRecipe=null;
      }
    }
    function redraw(){
      const matches=filter(items,{
        query:query.value,domain:domain.value,level:level.value,format:format.value
      });
      count.textContent=matches.length+" actividades originales encontradas. Selecciona una para preparar su ficha individual.";
      list.replaceChildren();
      for(const item of matches.slice(0,shown)){
        const article=el("article",undefined,"clinic-neuro-catalog-card");
        const top=el("div",undefined,"clinic-neuro-catalog-card-top");
        top.append(el("span",LEVELS[item.level]||item.level,"clinic-neuro-catalog-level"));
        top.append(el("span",FORMATS[item.format]||item.format,"clinic-neuro-catalog-format"));
        article.append(top,el("h4",item.title),el("p",titleByDomain[item.domain]||item.domain,"clinic-neuro-catalog-domain-name"));
        article.append(el("p",item.task,"clinic-neuro-catalog-task"));
        const details=el("details");
        details.append(el("summary","Ver estímulos y criterios de corrección (solo profesional)"));
        const material=el("div",undefined,"clinic-neuro-catalog-answer");
        material.append(el("strong","Estímulos de la actividad"));
        material.append(el("pre",item.stimuli));
        material.append(el("strong","Solución orientativa o criterio de revisión"));
        material.append(el("p",item.solution));
        details.append(material);
        const button=el("button","Preparar esta ficha","clinic-secondary");
        button.type="button";
        button.setAttribute("aria-label","Preparar ficha: "+item.title);
        button.addEventListener("click",()=>prepare(item));
        article.append(details,button);
        list.append(article);
      }
      more.hidden=matches.length<=shown;
      if(!matches.length)list.append(el("p","No hay coincidencias. Cambia los filtros para explorar el catálogo.","clinic-material-helper"));
    }
    for(const control of [query,domain,level,format]){
      control.addEventListener(control===query?"input":"change",()=>{shown=8;redraw();});
    }
    more.addEventListener("click",()=>{shown+=8;redraw();});
    redraw();
    return true;
  }
  window.NeuroCatalogBrowser={filter,key,init};
  const start=()=>{if(init())return;let attempts=0;const timer=setInterval(()=>{if(init()||++attempts>24)clearInterval(timer);},100);};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
})();