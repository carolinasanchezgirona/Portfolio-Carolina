/* Importación profesional de actividades. Borradores locales por navegador. */
(() => {
  "use strict";
  const STORAGE = "entresesiones-actividades-propias-v1";
  const $ = id => document.getElementById(id);
  const node = (tag, text) => { const e=document.createElement(tag); if(text!==undefined)e.textContent=text; return e; };
  const read = () => {try{const data=JSON.parse(localStorage.getItem(STORAGE)||"[]");return Array.isArray(data)?data:[]}catch{return []}};
  const save = items => localStorage.setItem(STORAGE,JSON.stringify(items));
  function start(){
    const host=$("clinic-neuro-catalog");
    const composer=window.NeuroWeeklyComposer;
    if(!host || !composer || !Array.isArray(composer.GROUPS)) return false;
    if($("clinic-import-activity"))return true;
    const container=node("section");
    container.id="clinic-import-activity";
    container.className="clinic-neuro-catalog";
    const heading=node("h3","Importar actividad");
    const help=node("p","Incorpora una actividad propia y clasifícala con las categorías del catálogo. El código es opcional. Por ahora se guarda únicamente en este navegador y dispositivo; no se envía ni asigna automáticamente a pacientes.");
    help.className="clinic-material-helper";
    const form=node("form");
    form.style.cssText="display:grid;gap:12px;margin:16px 0;";
    const field=(label,control)=>{const wrap=node("label");wrap.textContent=label;wrap.style.cssText="display:grid;gap:5px;";wrap.append(control);form.append(wrap);return control;};
    const name=field("Nombre de la actividad",node("input"));name.required=true;name.maxLength=140;name.placeholder="Ej. Atención selectiva con interferencias";
    const category=field("Categoría del catálogo",node("select"));category.required=true;
    category.append(new Option("Selecciona una categoría",""));
    composer.GROUPS.forEach(([value,title])=>category.append(new Option(title,value)));
    const level=field("Nivel",node("select"));
    [["apoyo_alto","Inicial"],["apoyo_moderado","Intermedio"],["autonomo","Avanzado"]].forEach(([v,t])=>level.append(new Option(t,v)));
    const format=field("Modalidad",node("select"));
    [["visual","Visual"],["verbal","Verbal"],["funcional","Funcional"],["logico","Razonamiento"]].forEach(([v,t])=>format.append(new Option(t,v)));
    const content=field("Código HTML, CSS o JavaScript (opcional)",node("textarea"));
    content.required=false;content.rows=8;content.placeholder="<!doctype html>...";content.spellcheck=false;
    const buttons=node("div");buttons.style.cssText="display:flex;gap:10px;flex-wrap:wrap;";
    const preview=node("button","Vista previa");preview.type="button";preview.className="clinic-secondary";
    const submit=node("button","Guardar actividad");submit.type="submit";submit.className="clinic-secondary";
    buttons.append(preview,submit);form.append(buttons);
    const status=node("p");status.setAttribute("role","status");status.className="clinic-material-helper";
    const frame=node("iframe");frame.title="Vista previa aislada de la actividad";frame.setAttribute("sandbox","allow-scripts");frame.setAttribute("referrerpolicy","no-referrer");frame.style.cssText="width:100%;height:350px;border:1px solid #b8cbd3;border-radius:8px;background:white;display:none;";
    const listTitle=node("h4","Mis actividades importadas (este navegador)");
    const list=node("div");list.className="clinic-neuro-catalog-results";
    const render=()=>{
      list.replaceChildren();
      const items=read();
      if(!items.length){list.append(node("p","No hay actividades importadas todavía."));return;}
      items.forEach(item=>{
        const card=node("article");card.className="clinic-neuro-catalog-card";
        card.append(node("h4",item.title),node("p",(composer.GROUPS.find(x=>x[0]===item.domain)||[])[1]||item.domain));
        const view=node("button","Previsualizar");view.type="button";view.className="clinic-secondary";
        view.disabled=!item.code;view.addEventListener("click",()=>{if(!item.code)return;frame.srcdoc=item.code;frame.style.display="block";frame.scrollIntoView({behavior:"smooth",block:"nearest"});});
        const edit=node("button","Editar");edit.type="button";edit.className="clinic-secondary";
        edit.addEventListener("click",()=>{name.value=item.title;category.value=item.domain;level.value=item.level;format.value=item.format;content.value=item.code;form.dataset.editId=item.id;form.scrollIntoView({behavior:"smooth"});});
        const remove=node("button","Eliminar");remove.type="button";remove.className="clinic-secondary";
        remove.addEventListener("click",()=>{if(!confirm("¿Eliminar esta actividad importada del navegador?"))return;save(read().filter(x=>x.id!==item.id));render();});
        card.append(view,edit,remove);list.append(card);
      });
    };
    preview.addEventListener("click",()=>{if(!content.value.trim()){status.textContent="Esta actividad no tiene código para previsualizar.";return;}frame.srcdoc=content.value;frame.style.display="block";});
    form.addEventListener("submit",event=>{
      event.preventDefault();
      const title=name.value.trim(),code=content.value.trim();
      if(!title || !category.value){status.textContent="Completa el nombre y la categoría.";return;}
      if(code.length>500000){status.textContent="El código supera el tamaño permitido (500 KB).";return;}
      try{
        const items=read(),id=form.dataset.editId||("custom-"+Date.now()+"-"+Math.random().toString(36).slice(2));
        const entry={id,title,domain:category.value,level:level.value,format:format.value,code,source:"own",updatedAt:new Date().toISOString()};
        const index=items.findIndex(x=>x.id===id);
        if(index<0)items.push(entry);else items[index]=entry;
        save(items);delete form.dataset.editId;form.reset();frame.style.display="none";
        status.textContent="Actividad guardada en este navegador. Aún no está sincronizada con la biblioteca central ni disponible para pacientes.";
        render();
      }catch{status.textContent="No se pudo guardar la actividad. Comprueba el espacio de almacenamiento del navegador.";}
    });
    container.append(heading,help,form,status,frame,listTitle,list);
    host.append(container);
    render();return true;
  }
  if(!start()){
    let count=0;
    const timer=setInterval(()=>{if(start()||++count>40)clearInterval(timer);},200);
  }
})();
