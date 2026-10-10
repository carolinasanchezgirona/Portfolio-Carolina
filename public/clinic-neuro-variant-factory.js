/* Variantes paramétricas verificables. No son pruebas clínicas ni baremos. */
(() => {
"use strict";
const days=["lunes","martes","miércoles","jueves","viernes","sábado","domingo"];
const key=["A","B","C","D","E","F"];
const pick=(xs,n)=>xs[((n%xs.length)+xs.length)%xs.length];
const codes=["○","△","□","◇","★","●"];
const levelIndex={apoyo_alto:0,apoyo_moderado:1,autonomo:2};
const asTable=(rows)=>rows.map(row=>row.join("|")).join("\n");
const normalize=n=>Math.abs(Math.trunc(Number(n)||0));
const seeded=seed=>{let state=(normalize(seed)^0x9e3779b9)>>>0;return ()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state;};};
function create(domain,level,variation) {
  const s=normalize(variation),depth=levelIndex[level]??1;
  const titleSuffix="";
  let title="",task="",stimuli="",solution="",format="visual",visualTitle="",visualType="table";
  switch(domain){
    case "orientacion_temporal": {
      const start=s%7,delay=depth===0?1:depth===1?2+s%2:3+s%2;
      const hour=9+s%7;const end=days[(start+delay)%7];
      const scenario=pick(["lectura","visita al museo","cita cultural","paseo","reunión de club","actividad de biblioteca","taller de música","clase de dibujo"],s);
      title="Cambiar un compromiso en la agenda";
      task=depth===0?"Un compromiso se traslada al día siguiente. Indica el nuevo día.":
        depth===1?"El compromiso se traslada el número de días indicado. Indica el día de llegada.":
        "El compromiso se traslada varios días y se adelanta una hora. Indica el día y la hora definitiva.";
      stimuli=asTable([["Referencia","Dato"],["Compromiso ficticio",scenario],["Día inicial",days[start]],["Hora inicial",hour+":00"],["Aplazamiento",delay+" día(s)"],...(depth===2?[["Cambio horario","Una hora antes"]]:[])]);
      solution="Día de llegada: "+end+(depth===2?", a las "+(hour-1)+":00":"")+". Se trata de una agenda ficticia.";
      format="funcional";visualTitle="Agenda y cambios";break;
    }
    case "orientacion_espacial": {
      const n=depth+2;
      const destination=s%2===0?"Mercado":"Biblioteca";
      const rows=[["Fila/col",...key.slice(0,n)]];
      const district=pick(["Norte","Sur","Este","Oeste","Central","Mar","Bosque","Río","Puerto","Parque","Sol","Luna","Tren"],s);
      const landmark=pick(["Plaza","Jardín","Quiosco","Centro cultural","Farmacia","Panadería","Taller","Fuente","Mercado antiguo","Galería","Estación"],Math.floor(s/13));
      for(let y=0;y<n;y++){
        const row=[String(y+1)];
        for(let x=0;x<n;x++)row.push(x===0&&y===0?"Salida":x===n-1&&y===n-1?destination:
          x===1&&y===1?"Obras":x===0&&y===n-1?landmark:x===0&&y===1?"Calle "+district:"Calle");
        rows.push(row);
      }
      let path=["A1"];
      for(let x=1;x<n;x++)path.push(key[x]+"1");
      for(let y=1;y<n;y++)path.push(key[n-1]+(y+1));
      title="Ruta urbana con un desvío";
      task="En este plano ficticio el norte está arriba. Parte de A1 y llega a "+destination+(n>2?" evitando las obras":"")+". Puedes desplazarte solo a casillas contiguas horizontal o verticalmente.";
      stimuli=asTable(rows);
      solution="Una ruta válida: "+path.join(" → ")+(n>2?"; no atraviesa la casilla B2.":".");
      format="visual";visualTitle="Mapa con obstáculos";break;
    }
    case "orientacion_personal": {
      const prefs=["escuchar música","hacer un dibujo","regar plantas","mirar un libro","descansar","escuchar un relato","ordenar fotografías no personales","salir al jardín","cuidar una maceta","realizar estiramientos suaves"];
      const n=depth+2,selected=Array.from({length:n},(_,i)=>pick(prefs,s+i*3));
      title="Elección personal de actividades";
      const time=pick([5,10,15,20,25,30,40],s),energy=pick(["baja","moderada","alta"],Math.floor(s/7));
      task=depth===0?"Señala la actividad que preferirías hoy o ninguna.":
        depth===1?"Elige una actividad y una alternativa si aparece cansancio.":
        "Elige dos actividades por orden de preferencia y explica cómo adaptarías una de ellas si disminuye tu energía.";
      stimuli=asTable([["Opción","Actividad"],...selected.map((v,i)=>[String(i+1),v]),["Tiempo disponible",time+" minutos"],["Energía percibida",energy]]);
      solution="No hay solución única: registrar las decisiones actuales y las adaptaciones propuestas, sin atribuir recuerdos no corroborados.";
      format="funcional";visualTitle="Tarjetas de preferencias";break;
    }
    case "atencion": {
      const rowsN=depth+2,colsN=depth+4,target=pick(["★","△","○"],s);
      const alphabet=[target,...codes.filter(x=>x!==target)];
      const rows=[["Fila/col",...key.slice(0,colsN)]],found=[];
      for(let y=0;y<rowsN;y++){
        const row=[String(y+1)];
        for(let x=0;x<colsN;x++){
          const z=(s*7+x*11+y*13+x*y*3)%17;
          const symbol=z%4===0?target:alphabet[1+(z%5)];
          row.push(symbol);if(symbol===target)found.push(key[x]+(y+1));
        }
        rows.push(row);
      }
      if(found.length===0){rows[1][1]=target;found.push("A1");}
      title="Rastreo de un símbolo diana";
      task="Localiza y rodea únicamente el símbolo "+target+". Recorre todas las filas y revisa al terminar. No es obligatorio cronometrar.";
      stimuli=asTable(rows);
      solution="Diana: "+target+". Posiciones: "+found.join(", ")+".";
      format="visual";visualTitle="Matriz de búsqueda";break;
    }
    case "memoria": {
      const words=["pera","libro","llave","nube","taza","árbol","moneda","plato","coche","flor","bolsa","reloj","manzana","puente","silla","barco","mesa","puerta","hoja","zapato"];
      const count=depth===0?3:depth===1?5:7;
      const offset=s%words.length;
      const study=Array.from({length:count},(_,i)=>words[(offset+i*3)%words.length]);
      const distractors=words.filter(w=>!study.includes(w)).slice(0,depth+2);
      const alternatives=[...study,...distractors];
      for(let i=alternatives.length-1;i>0;i--){const j=(s+i*7)% (i+1);[alternatives[i],alternatives[j]]=[alternatives[j],alternatives[i]];}
      title="Reconocimiento diferido de palabras";
      task="Lee solo la fila de estudio, tápala con una hoja, espera una breve pausa y después marca las palabras que reconoces en la fila de alternativas. No vuelvas a mirar el estudio hasta terminar.";
      stimuli=asTable([["Momento","Estímulos"],["1 · ESTUDIAR Y TAPAR",study.join(", ")],["2 · RESPONDER",alternatives.join(", ")]]);
      solution="Objetivos: "+study.join(", ")+". Distractores: "+distractors.join(", ")+".";
      format="verbal";visualTitle="Estudio y alternativas separadas";break;
    }
    case "funciones_ejecutivas": {
      const durations=[10+s%11*5,10+s%7*5,10+s%9*5];
      const start=9+s%3;
      const choices=[["Clasificar documentos","Preparar una lista","Revisar el calendario"],["Ordenar tarjetas","Comprobar un horario","Anotar un recordatorio"],["Separar fotografías genéricas","Escoger materiales","Guardar la actividad"],["Revisar un inventario","Preparar un listado","Verificar que está completo"]];
      const events=pick(choices,Math.floor(s/3));
      const count=depth===0?2:3;
      const todo=events.slice(0,count);
      title="Planificar tareas con tiempos";
      task=depth===0?"Ordena las dos tareas según el orden indicado y estima a qué hora terminarán.":"Planifica las tareas en el orden indicado sin solapamientos"+(depth===2?", incorpora un descanso de 10 minutos después de la segunda tarea":"")+". Escribe el horario de inicio y final.";
      const sequence=todo.map((e,i)=>[e,durations[i]+" min"]);
      if(s%2===0)sequence.reverse();
      stimuli=asTable([["Actividad","Duración"],...sequence,["Inicio",start+":00"],["Condición",count===2?events[0]+" antes de "+events[1]:events[0]+" antes de "+events[1]+"; "+events[1]+" antes de "+events[2]]]);
      const total=durations.slice(0,count).reduce((a,b)=>a+b,0)+(depth===2?10:0);
      const finishing=new Date(Date.UTC(2020,0,1,start,0)+total*60000).toISOString().slice(11,16);
      solution="Orden: "+todo.join(" → ")+(depth===2?" con 10 minutos de descanso tras la segunda actividad":"")+". Fin: "+finishing+".";
      format="logico";visualTitle="Agenda de tareas";break;
    }
    case "lenguaje": {
      const categories=[
        [["Frutas",["pera","fresa","manzana","uva","naranja","kiwi","ciruela","plátano","melón"]],["Muebles",["silla","mesa","armario","sofá","taburete","estantería","cama","escritorio","banco"]]],
        [["Animales",["gato","perro","caballo","oveja","conejo","pato","ballena","tortuga","zorro"]],["Transportes",["tren","autobús","barco","avión","bicicleta","tranvía","coche","metro","camión"]]],
        [["Prendas",["abrigo","camisa","pantalón","calcetín","guante","bufanda","sombrero","falda","jersey"]],["Herramientas",["martillo","sierra","destornillador","alicates","llave","regla","pala","lima","taladro"]]],
        [["Flores",["rosa","tulipán","margarita","lirio","clavel","azucena","orquídea","violeta","amapola"]],["Alimentos",["pan","queso","arroz","lentejas","tomate","yogur","pasta","almendras","patata"]]],
        [["Instrumentos",["flauta","piano","violín","trompeta","guitarra","tambor","arpa","saxofón","clarinete"]],["Deportes",["tenis","baloncesto","fútbol","natación","atletismo","esquí","ciclismo","remo","bádminton"]]],
        [["Profesiones",["médica","carpintera","docente","bombera","panadera","ingeniera","jardinera","piloto","cocinera"]],["Edificios",["escuela","hospital","biblioteca","museo","teatro","ayuntamiento","estación","hotel","mercado"]]],
        [["Bebidas",["agua","infusión","zumo","leche","té","limonada","café","batido","caldo"]],["Materiales",["madera","metal","vidrio","papel","cartón","algodón","lana","cerámica","piedra"]]]
      ];
      const pair=pick(categories,s),forbiddenIndex=Math.floor(s/7)%9;
      const count=depth===0?2:depth===1?4:6;
      title="Evocación por alternancia de categorías";
      task=depth===0?"Di o señala una palabra de cada categoría, sin repetir las excluidas.":
        "Completa la secuencia alternando categorías sin repetir palabras"+(depth===2?" y explica qué regla has mantenido":"")+".";
      const slots=Array.from({length:count},(_,i)=>[String(i+1),pair[i%2][0]]);
      stimuli=asTable([["Posición","Categoría"],...slots,["No utilizar",pair[0][1][forbiddenIndex]+" / "+pair[1][1][forbiddenIndex]]]);
      solution="Un ejemplo válido: "+slots.map((x,i)=>pair[i%2][1][(forbiddenIndex+1+Math.floor(i/2))%9]).join(", ")+". Otras palabras pertinentes son válidas.";
      format="verbal";visualTitle="Alternancia de campos semánticos";break;
    }
    case "visuoespacial": {
      const size=depth+2;
      const board=[["Fila/col",...key.slice(0,size)]];
      const next=seeded(s);
      for(let y=0;y<size;y++){
        const row=[String(y+1)];
        for(let x=0;x<size;x++)row.push(codes[next()%codes.length]);
        board.push(row);
      }
      const dy=depth===2?2:1,dx=depth===2?2:1;
      title="Desplazamientos sobre una cuadrícula";
      task="Partiendo de A1, avanza "+dx+" casilla(s) a la derecha y "+dy+" hacia abajo. ¿En qué coordenada terminas y qué símbolo encuentras?";
      stimuli=asTable(board);
      solution="Posición "+key[dx]+(dy+1)+", símbolo "+board[dy+1][dx+1]+".";
      format="visual";visualTitle="Cuadrícula y desplazamientos";break;
    }
    case "praxias_gnosias": {
      const sequences=[
        ["Extender una servilleta","Doblarla por la mitad","Doblar otra vez","Colocarla en su sitio"],
        ["Abrir una carpeta","Introducir una hoja","Ordenar las hojas","Cerrar la carpeta"],
        ["Sacar una bolsa reutilizable","Guardar dos objetos ligeros","Comprobar que están dentro","Cerrar la bolsa"],
        ["Elegir una postal","Escribir un mensaje ficticio","Introducirla en un sobre","Cerrar el sobre"],
        ["Poner un mantel","Colocar un plato","Situar una servilleta","Recoger tras la actividad"],
        ["Seleccionar un libro","Abrirlo por una página","Colocar un marcador","Cerrar el libro"]
      ];
      const steps=pick(sequences,s).slice(0,depth+2);
      const question=pick(["Señala el primer paso","Identifica el último paso","Explica por qué se necesita un orden","Distingue acción y resultado","Señala el segundo paso","Explica qué tarjeta pondrías antes","Elige qué paso revisarías al terminar"],Math.floor(s/6));
      const shuffled=steps.slice().reverse();
      title="Ordenar una actividad instrumental";
      task="Estas tarjetas representan una actividad cotidiana ficticia. Ordénalas para que la secuencia resulte coherente; describe cómo usarías los objetos, sin necesidad de ejecutar el gesto.";
      stimuli=asTable([["Tarjeta","Acción"],...shuffled.map((e,i)=>[String(i+1),e]),["Pregunta adicional",question]]);
      solution="Secuencia orientativa: "+steps.join(" → ")+". Aceptar alternativas seguras y funcionales.";
      format="funcional";visualTitle="Tarjetas de acciones";break;
    }
    case "calculo": {
      title="Cálculo con precios ficticios";
      if(depth===0){
        const a=1+s%9,b=2+(s*3)%8;
        task="Suma el precio de los dos artículos. Puedes usar monedas de juguete.";
        stimuli=asTable([["Artículo","Precio"],["Pan",a+" €"],["Fruta",b+" €"]]);
        solution="Total: "+(a+b)+" €.";
      }else if(depth===1){
        const a=4+s%11,b=2+s%6,c=3+s%8;
        task="Calcula el coste total de los tres productos y comprueba la suma.";
        stimuli=asTable([["Artículo","Precio"],["Libro",a+" €"],["Carpeta",b+" €"],["Lápices",c+" €"]]);
        solution="Total: "+(a+b+c)+" €.";
      }else{
        const price=40+20*(s%12),disc=pick([10,15,20,25,30],s);
        const savings=price*disc/100,final=price-savings,payment=price+10;
        task="Calcula el descuento, el precio final y el cambio si pagas con el importe indicado.";
        stimuli=asTable([["Dato","Importe"],["Precio inicial",price+" €"],["Descuento",disc+" %"],["Pago",payment+" €"]]);
        solution="Descuento: "+savings+" €. Precio final: "+final+" €. Cambio: "+(payment-final)+" €.";
      }
      format="logico";visualTitle="Importes para calcular";break;
    }
    case "cognicion_social": {
      const scenes=[
        ["Alguien no contesta un mensaje","Motivo desconocido"],
        ["Una persona cancela un plan","No explica la razón"],
        ["Un compañero llega tarde","No se conoce el motivo"],
        ["Una vecina está más callada","No hay más información"],
        ["Una persona pide cambiar la hora","Explica que tiene otra tarea"],
        ["Un conocido mira el reloj","Está en una sala compartida"],
        ["Alguien solicita un descanso","Lo expresa directamente"],
        ["Una persona no saluda al entrar","Está hablando por teléfono"]
      ];
      const scene=pick(scenes,s);
      title="Interpretar una situación sin dar nada por supuesto";
      task=depth===0?"Distingue el hecho observable de una posible interpretación.":
        depth===1?"Propón dos explicaciones distintas de la situación sin dar ninguna por segura.":
        "Propón tres hipótesis y una pregunta respetuosa para aclarar lo ocurrido, sin atribuir intenciones como hechos.";
      stimuli=asTable([["Elemento","Información"],["Hecho",scene[0]],["Contexto",scene[1]],["Motivo verificado","No confirmado"],["Foco de reflexión",pick(["Identificar información ausente","Separar hechos e hipótesis","Preguntar antes de concluir","Explorar perspectivas alternativas","No atribuir intención sin datos","Considerar el contexto observable","Diferenciar conjetura de comprobación"],Math.floor(s/8))]]);
      solution="La conducta observada es un hecho; cualquier motivo es una hipótesis. Evitar inferencias sobre intenciones sin datos.";
      format="verbal";visualTitle="Hechos y suposiciones";break;
    }
    case "velocidad_procesamiento": {
      const letters=["A","B","C","D"],count=depth===0?6:depth===1?10:14;
      const next=seeded(s);
      const sequence=Array.from({length:count},()=>letters[next()%4]);
      title="Correspondencias símbolo-código";
      task="Usando la clave visible, sustituye las letras por los números correspondientes en el mismo orden. Registra pausas sin comparar el tiempo con normas clínicas.";
      const group=[];
      for(let i=0;i<sequence.length;i+=4)group.push([String(i/4+1),...sequence.slice(i,i+4),...Array.from({length:Math.max(0,4-sequence.slice(i,i+4).length)},()=>"-")]);
      stimuli=asTable([["Fila","1","2","3","4"],["Clave","A→1","B→2","C→3","D→4"],...group]);
      solution="Solución por orden: "+sequence.map(e=>letters.indexOf(e)+1).join(" ")+".";
      format="visual";visualTitle="Clave de sustitución";break;
    }
    case "cognicion_funcional": {
      const examples=[
        ["Paseo con lluvia",["paraguas","llaves"],["patines","revista"]],
        ["Visitar biblioteca",["carné","lista de libros"],["pelota","maceta"]],
        ["Ir a una cita ficticia",["hora anotada","dirección comprobada"],["juguete","manta"]],
        ["Comprar dos alimentos",["lista de compra","bolsa reutilizable"],["destornillador","almohada"]],
        ["Salida breve al parque",["agua","calzado adecuado"],["plancha","marco de fotos"]],
        ["Preparar una lectura",["libro","luz suficiente"],["paraguas cerrado","cepillo de dientes"]],
        ["Visitar un museo",["horario comprobado","entrada si es necesaria"],["sartén","regadera"]],
        ["Organizar un paseo",["ruta sencilla","opción de descanso"],["cuadro","calendario pasado"]]
      ];
      const [scene,useful,distractors]=pick(examples,s);
      const options=[useful[0],distractors[0],useful[1],distractors[1]];
      title="Elegir apoyos para una tarea cotidiana";
      task=depth===0?"Señala dos elementos útiles para la situación propuesta.":
        depth===1?"Elige dos elementos prioritarios y explica para qué sirve cada uno.":
        "Elige dos elementos, anticipa un imprevisto plausible y propone una ayuda compensatoria segura.";
      stimuli=asTable([["Situación",scene],["Opción A",options[0]],["Opción B",options[1]],["Opción C",options[2]],["Opción D",options[3]],["Tarea complementaria",pick(["Identifica un distractor","Explica por qué elegirías cada apoyo","Explica cómo comprobarías lo preparado","Propón un plan alternativo si falta un objeto","Indica cuál opción descartarías primero","Elige un recordatorio externo","Revisa si los objetos cumplen el objetivo"],Math.floor(s/8))]]);
      solution="Ejemplo de elección: "+useful.join(" y ")+". Ajustar a características de la situación y preferencias personales.";
      format="funcional";visualTitle="Tarjetas de planificación";break;
    }
    default: return null;
  }
  return {domain,level,title:title+titleSuffix,task,stimuli,solution,format,visualType,visualTitle,generated:true};
}
window.NeuroVariantFactory={create};
})();