import type {Entry} from './model';
export type TestArea='Cognición y estadificación'|'Funcionalidad'|'Estado afectivo'|'Valoración mixta';
export type TestInfo={instrument:string;label:string;area:TestArea;aliases:string[];mode:'existing'|'items'|'external'|'pending';version?:string;maximum?:number;minimum?:number;direction?:'higher'|'lower';source:string;note:string};
export const geriatricTests:TestInfo[]=[
 {instrument:'MMSE',label:'MMSE / MEC de Lobo',area:'Cognición y estadificación',aliases:['Mini-Mental','Minimental','MEC','Lobo'],mode:'existing',source:'https://www.hipocampo.org/lobo.asp',note:'Se utiliza el formulario MMSE/MEC ya existente; conserva las versiones y sus puntuaciones por separado.'},
 {instrument:'Pfeiffer',label:'Pfeiffer (SPMSQ)',area:'Cognición y estadificación',aliases:['SPMSQ'],mode:'existing',source:'https://www.hipocampo.org/pfeiffer.asp',note:'Formulario existente.'},
 {instrument:'GDS de Reisberg',label:'GDS de Reisberg',area:'Cognición y estadificación',aliases:['GSD Reisberg','Reisberg'],mode:'existing',source:'https://www.hipocampo.org/reisberg.asp',note:'Estadificación clínica global; no confundir con la escala de depresión geriátrica.'},
 {instrument:'Test del reloj',label:'Test del reloj',area:'Cognición y estadificación',aliases:['Reloj'],mode:'existing',source:'https://www.hipocampo.org/reloj.asp',note:'Formulario existente con modalidad y sistema de puntuación.'},
 {instrument:'Fluencia verbal',label:'Fluencia verbal / Set-Test de Isaacs',area:'Cognición y estadificación',aliases:['Isaacs','Set-Test','Fluidez verbal'],mode:'existing',source:'https://www.hipocampo.org/isaacs.asp',note:'Isaacs se integra en el registro de fluencia ya existente.'},
 {instrument:'Índice de Katz',label:'Índice de Katz',area:'Funcionalidad',aliases:['Katz'],mode:'items',version:'Katz · categorías A-H · registro digital v1',source:'https://www.hipocampo.org/katz.asp',note:'ABVD. Resultado categorial A-H; no se convierte en una escala numérica para la gráfica.'},
 {instrument:'Índice de Barthel',label:'Índice de Barthel',area:'Funcionalidad',aliases:['Barthel'],mode:'items',version:'Barthel · 10 actividades · 0-100 · registro digital v1',maximum:100,direction:'higher',source:'https://www.hipocampo.org/Barthel.asp',note:'ABVD. Se conserva el techo nominal de 100 para esta versión, también en usuarios de silla de ruedas; se documenta el contexto.'},
 {instrument:'Lawton y Brody',label:'Índice de Lawton y Brody',area:'Funcionalidad',aliases:['Lawton','Lawton-Brody','Lawton Brody'],mode:'items',version:'Lawton-Brody · 8 áreas · 0-8 · registro digital v1',maximum:8,direction:'higher',source:'https://www.hipocampo.org/lawton-brody.asp',note:'AIVD. Se evalúan las ocho áreas sin exclusiones por sexo. Si no hay oportunidad de observar una actividad en residencia, registra no evaluable y explica la limitación.'},
 {instrument:'Cruz Roja física',label:'Cruz Roja · incapacidad física',area:'Funcionalidad',aliases:['CRF','Cruz Roja funcional'],mode:'items',version:'Cruz Roja física · grados 0-5 · registro digital v1',maximum:5,direction:'lower',source:'https://www.hipocampo.org/CruzRoja.asp',note:'Graduación funcional física. Se registra separadamente de la dimensión mental.'},
 {instrument:'Cruz Roja mental',label:'Cruz Roja · incapacidad mental',area:'Cognición y estadificación',aliases:['CRM','Incapacidad psíquica de la Cruz Roja'],mode:'items',version:'Cruz Roja mental · grados 0-5 · registro digital v1',maximum:5,direction:'lower',source:'https://www.hipocampo.org/CruzRoja.asp',note:'Graduación clínica histórica; la puntuación no establece un diagnóstico etiológico.'},
 {instrument:'Blessed',label:'Escala de demencia de Blessed',area:'Valoración mixta',aliases:['Blessed Dementia Rating Scale','BDRS'],mode:'items',version:'Blessed · 22 ítems · tres áreas · registro digital v1',source:'https://www.hipocampo.org/blessed.asp',note:'Registra por separado actividades (0-8), hábitos (0-9) y personalidad/conducta (0-11). No equivale al Blessed Information-Memory-Concentration Test.'},
 {instrument:'Yesavage',label:'Yesavage (depresión geriátrica)',area:'Estado afectivo',aliases:['GDS depresión','Depresión geriátrica'],mode:'existing',source:'https://www.hipocampo.org/yesavage.asp',note:'Se conserva el formulario de 30 ítems existente.'},
 {instrument:'Hamilton',label:'Hamilton · depresión (HAM-D-17)',area:'Estado afectivo',aliases:['HAM-D','HDRS','HAMD'],mode:'items',version:'HAM-D-17 · hoja de puntuación AHRQ · registro digital v1',maximum:52,direction:'lower',source:'https://integrationacademy.ahrq.gov/sites/default/files/2020-07/HDRS.pdf',note:'Hoja de puntuación profesional de 17 ítems. Usa entrevista y anclajes del protocolo; los rótulos digitales son abreviados. No es HAM-A.'},
 {instrument:'Cornell',label:'Cornell (CSDD)',area:'Estado afectivo',aliases:['CSDD'],mode:'external',version:'CSDD · 19 ítems · resultado externo',maximum:38,direction:'lower',source:'https://eprovide.mapi-trust.org/instruments/cornell-scale-for-depression-in-dementia',note:'Registro de resultado obtenido con el protocolo autorizado. Reproducción de ítems y traducciones sujeta a las condiciones del titular; no se incluyen aquí.'},
 {instrument:'Beck',label:'Inventario de depresión de Beck (BDI-II)',area:'Estado afectivo',aliases:['BDI','BDI-II','Inventario Depresión Beck'],mode:'external',version:'BDI-II · 21 ítems · adaptación española 2011 · resultado externo',maximum:63,direction:'lower',source:'https://www.cop.es/uploads/PDF/2013/BDI-II.pdf',note:'Registro del resultado del BDI-II administrado con material autorizado de Pearson. No se reproducen los ítems. No usar este registro para BDI-I o BDI-FS.'},
 {instrument:'Goldberg',label:'Goldberg · ansiedad y depresión (EADG)',area:'Estado afectivo',aliases:['Golberg','EADG'],mode:'external',source:'https://www.sspa.juntadeandalucia.es/servicioandaluzdesalud/sites/default/files/sincfiles/wsas-media-mediafile_sasdocumento/2020/ansiedad.pdf',note:'Registro externo por subescala EADG-A o EADG-D (0-9), sin sumar ansiedad y depresión. No confundir con GHQ. El protocolo encontrado tiene licencia CC BY-NC-ND; no se adapta su cuestionario aquí.'},
 {instrument:'Zung',label:'Zung · depresión (SDS)',area:'Estado afectivo',aliases:['SDS','Zung depresión'],mode:'external',version:'Zung SDS · 20 ítems · puntuación directa · resultado externo',minimum:20,maximum:80,direction:'lower',source:'https://doi.org/10.1001/archpsyc.1965.01720310065008',note:'Registro de puntuación directa SDS (20-80), no índice (25-100). No confundir con Zung SAS de ansiedad. Ítems pendientes de verificar permisos y traducción.'},
 {instrument:'Geronte',label:'Geronte (Leroux)',area:'Valoración mixta',aliases:['Géronte','Leroux'],mode:'external',source:'https://documentation.ch-montfavet.fr/index.php?id=104074&lvl=notice_display',note:'Registro cualitativo de un protocolo externo: especifica edición, idioma y referencia. No se ha verificado una adaptación española completa reproducible; no se calcula un total ni se recrea la silueta.'},
 {instrument:'RAPID',label:'RAPID · identificación pendiente',area:'Valoración mixta',aliases:['Rapid'],mode:'pending',source:'https://on-enfermeria.com/escalas-de-valoracion-geriatrica/',note:'El listado no especifica autor ni versión. RDRS-2 (Rapid Disability Rating Scale-2) es una posible referencia, sin confirmar. No se activa un test ni una puntuación bajo un nombre ambiguo.'},
];
export const testAreas:TestArea[]=['Cognición y estadificación','Funcionalidad','Estado afectivo','Valoración mixta'];
const fold=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
export function canonicalTest(name:string){const value=fold(name);return geriatricTests.find(t=>[t.instrument,t.label,...t.aliases].some(alias=>fold(alias)===value))?.instrument||name;}
export function testInfo(name:string){return geriatricTests.find(t=>t.instrument===canonicalTest(name));}
export function findTests(query:string){const q=fold(query);return geriatricTests.filter(t=>!q||[t.instrument,t.label,t.area,...t.aliases].some(v=>fold(v).includes(q)));}
export function isGeriatricWebTest(entry:Entry){return entry.geriatricFormat==='items-v1'&&testInfo(entry.instrument)?.mode==='items';}
export function newGeriatricTest(base:Entry,instrument:string):Entry{const t=testInfo(instrument);if(!t||!['items','external'].includes(t.mode))return {...base,instrument};return {...base,instrument:t.instrument,geriatricFormat:t.mode==='items'?'items-v1':'external-v1',version:t.version||'',maximum:t.maximum===undefined?'':String(t.maximum),language:'Español',validity:'Incompleto',sourceUrl:t.source,...(t.direction?{direction:t.direction==='higher'?'Más alto es más favorable':'Más bajo es más favorable'}:{})};}
export type ScoreOption={value:string;points:number;label:string};
export type GeriatricItem={key:string;label:string;options:ScoreOption[];area?:string};
const choices=(values:[number,string][]):ScoreOption[]=>values.map(([points,label],i)=>({value:String(i),points,label}));
const item=(key:string,label:string,values:[number,string][],area?:string):GeriatricItem=>({key,label,options:choices(values),area});
const yesNo: [number,string][]=[[0,'Ausente'],[1,'Presente']];
export function geriatricItems(instrument:string):GeriatricItem[]{
 switch(instrument){
 case 'Índice de Barthel':return [
 item('eat','Comer',[[0,'Dependiente'],[5,'Ayuda para cortar o preparar'],[10,'Independiente']]),
 item('wash','Lavarse',[[0,'Dependiente'],[5,'Baño independiente']]),
 item('dress','Vestirse',[[0,'Dependiente'],[5,'Necesita ayuda'],[10,'Independiente']]),
 item('groom','Arreglarse',[[0,'Dependiente'],[5,'Aseo personal independiente']]),
 item('bowel','Deposiciones (semana previa)',[[0,'Incontinencia'],[5,'Episodios ocasionales / ayuda con medidas evacuatorias'],[10,'Continencia']]),
 item('bladder','Micción (semana previa)',[[0,'Incontinencia'],[5,'Hasta un episodio diario / ayuda con sonda'],[10,'Continencia / maneja su sonda']]),
 item('toilet','Uso del retrete',[[0,'Dependiente'],[5,'Ayuda; higiene propia'],[10,'Independiente']]),
 item('transfer','Traslado cama-sillón',[[0,'Dependiente'],[5,'Gran ayuda; mantiene sedestación'],[10,'Ayuda mínima o supervisión'],[15,'Independiente']]),
 item('walk','Deambulación',[[0,'Dependiente'],[5,'Silla de ruedas independiente'],[10,'Camina 50 m con ayuda o supervisión'],[15,'Camina 50 m independiente']]),
 item('stairs','Escaleras',[[0,'Dependiente'],[5,'Ayuda o supervisión'],[10,'Independiente']])];
 case 'Índice de Katz':return [
 ['bath','Baño','Se lava sin ayuda o solo precisa ayuda en una parte del cuerpo.'],['dress','Vestido','Se viste solo; se excluye atarse los zapatos.'],['toilet','Retrete','Acceso, limpieza y ropa sin ayuda personal.'],['transfer','Movilidad','Entra/sale de cama y silla sin ayuda personal.'],['continence','Continencia','Control completo urinario y fecal.'],['eat','Alimentación','Del plato a la boca sin ayuda; excluye cortar o untar.'],
 ].map(([key,label,help])=>item(key,label,[[1,'Independiente: '+help],[0,'Dependiente: precisa ayuda, supervisión o no realiza la función.']]));
 case 'Lawton y Brody':return [
 item('phone','Teléfono',[[1,'Iniciativa propia'],[1,'Marca números familiares'],[1,'Contesta, no marca'],[0,'No lo utiliza']]),
 item('shopping','Compras',[[1,'Todas, independientemente'],[0,'Solo pequeñas compras'],[0,'Necesita compañía'],[0,'Incapaz']]),
 item('cooking','Comida',[[1,'Organiza, prepara y sirve adecuadamente'],[0,'Solo con ingredientes preparados'],[0,'Preparación insuficiente'],[0,'Se la preparan']]),
 item('house','Casa',[[1,'Solo / ayuda ocasional'],[1,'Tareas ligeras'],[1,'Limpieza insuficiente'],[1,'Ayuda en todas las labores'],[0,'No participa']]),
 item('laundry','Ropa',[[1,'Lava toda'],[1,'Lava pequeñas prendas'],[0,'Otros lavan todo']]),
 item('transport','Transporte',[[1,'Público solo / conduce'],[1,'Taxi solo'],[1,'Público acompañado'],[0,'Taxi/coche con ayuda'],[0,'No viaja']]),
 item('meds','Medicación',[[1,'Hora y dosis correctas'],[0,'Dosis preparadas por otro'],[0,'No se administra']]),
 item('money','Economía',[[1,'Gestión independiente'],[1,'Compras cotidianas; ayuda en gestiones mayores'],[0,'Incapaz']])];
 case 'Cruz Roja física':return [item('grade','Grado de incapacidad física',[
 [0,'Autonomía y marcha normal'],[1,'AVD suficientes; marcha dificultosa; continente'],[2,'Ayuda en AVD; bastón/apoyo; continencia o incontinencia rara'],[3,'Dificultad grave en AVD; marcha con una persona; incontinencia ocasional'],[4,'Ayuda en casi todas las AVD; marcha con dos personas; incontinencia habitual'],[5,'Cama/sillón; cuidados continuos; incontinencia total']])];
 case 'Cruz Roja mental':return [item('grade','Grado de incapacidad mental',[
 [0,'Sin alteraciones según el protocolo'],[1,'Alteración de memoria; conversación normal'],[2,'Memoria/orientación alteradas; conversación imperfecta; dificultades de autocuidado'],[3,'Alteración grave; conversación incoherente; conducta y autocuidado afectados'],[4,'Desorientación completa; deterioro establecido; incontinencia habitual'],[5,'Deterioro avanzado; dependencia extrema; incontinencia total']])];
 case 'Blessed':return [
 ...['Tareas domésticas','Pequeñas cantidades de dinero','Listas breves','Orientación en casa','Calles familiares','Valoración del entorno','Hechos recientes','Rememoración del pasado'].map((label,i)=>item('daily'+i,label,[[0,'Sin cambio / incapacidad ausente'],[0.5,'Parcial'],[1,'Total']],'Actividades')),
 item('habit0','Comer',[[0,'Cubiertos adecuados'],[1,'Desaliñado; solo cuchara'],[2,'Solo sólidos simples'],[3,'Necesita ser alimentado']],'Hábitos'),
 item('habit1','Vestirse',[[0,'Sin ayuda'],[1,'Fallos ocasionales'],[2,'Errores frecuentes de secuencia'],[3,'Incapaz']],'Hábitos'),
 item('habit2','Esfínteres',[[0,'Control normal'],[1,'Incontinencia urinaria ocasional'],[2,'Urinaria frecuente'],[3,'Doble incontinencia']],'Hábitos'),
 ...['Retraimiento','Egocentrismo','Desinterés por sentimientos ajenos','Embotamiento afectivo','Descontrol emocional','Hilaridad inapropiada','Menor respuesta emocional','Desinhibición sexual reciente','Desinterés por aficiones','Apatía progresiva','Hiperactividad no justificada'].map((label,i)=>item('behavior'+i,label,yesNo,'Personalidad y conducta'))];
 case 'Hamilton':return ['Ánimo deprimido','Culpabilidad','Ideación / conducta suicida','Insomnio inicial','Insomnio intermedio','Insomnio tardío','Trabajo y actividades','Inhibición psicomotora','Agitación','Ansiedad psíquica','Ansiedad somática','Síntomas gastrointestinales','Síntomas somáticos generales','Síntomas genitales','Hipocondría','Pérdida de peso','Conciencia de enfermedad'].map((label,i)=>item('hamd'+i,label,Array.from({length:[3,4,5,11,12,13,15,16].includes(i)?3:5},(_,n)=>[n,String(n)+' puntos según protocolo'] as [number,string])));
 default:return [];
 }
}
export const itemField=(key:string)=>'geri_'+key;
export function scoreGeriatricTest(entry:Entry):Entry{
 if(!isGeriatricWebTest(entry))return entry;
 const definitions=geriatricItems(entry.instrument),info=testInfo(entry.instrument)!;
 const results=definitions.map(i=>i.options.find(o=>o.value===entry[itemField(i.key)]));
 const complete=definitions.length>0&&results.every(Boolean),notEvaluable=definitions.some(i=>entry[itemField(i.key)]==='NA');
 const result:Entry={...entry,score:'',maximum:info.maximum===undefined?'':String(info.maximum),validity:complete?'Aplicado':notEvaluable?'No evaluable':'Incompleto',resultSummary:'',subscores:'',geriCategory:''};
 result.answers=JSON.stringify(definitions.map((i,n)=>({item:i.label,response:results[n]?.label||(entry[itemField(i.key)]==='NA'?'No evaluable':'Sin responder'),points:results[n]?.points??null})));
 if(!complete)return result;
 const sum=(from:number,to:number)=>results.slice(from,to).reduce((total,o)=>total+o!.points,0);
 if(entry.instrument==='Índice de Katz'){
  const dependent=results.map((o,i)=>o!.points===0?i:-1).filter(i=>i>=0),count=dependent.length;
  const required=[[],[],[0],[0,1],[0,1,2],[0,1,2,3]];
  const category=count===0?'A':count===1?'B':count===6?'G':required[count]?.every(i=>dependent.includes(i))?'ABCDEFG'[count]:'H';
  result.geriCategory=category;result.resultSummary='Índice de Katz: '+category+' · '+(6-count)+'/6 funciones independientes. Categoría histórica A-H.';
 }else if(entry.instrument==='Blessed'){
  result.subscores=JSON.stringify({Actividades:sum(0,8),'Hábitos':sum(8,11),'Personalidad y conducta':sum(11,22)});
  result.resultSummary='Blessed: '+sum(0,8)+' / 8 · '+sum(8,11)+' / 9 · '+sum(11,22)+' / 11. Áreas separadas; no se asigna un total único.';
 }else {result.score=String(sum(0,results.length));result.resultSummary=result.score+' / '+result.maximum;}
 return result;
}
export function geriatricTestError(entry:Entry){
 const info=testInfo(entry.instrument);if(!info||!entry.geriatricFormat)return '';
 if(isGeriatricWebTest(entry)){
  if(entry.version!==info.version)return 'La versión no corresponde a este formulario digital. Conserva el registro anterior y revisa su protocolo.';
  for(const item of geriatricItems(entry.instrument)){const value=entry[itemField(item.key)];if(value!==undefined&&value!==''&&value!=='NA'&&!item.options.some(o=>o.value===value))return 'Revisa la puntuación del apartado: '+item.label+'.';}
 }
 if(info.mode==='pending')return 'Este instrumento está pendiente de identificación.';
 if(entry.geriatricFormat==='external-v1'&&entry.validity==='Aplicado'){
  if(!entry.version?.trim())return info.instrument==='Goldberg'?'Selecciona la subescala de Goldberg que has administrado.':'Documenta la versión del protocolo externo.';
  if(info.version&&entry.version!==info.version)return 'La versión no corresponde al rango de este registro externo. Usa el protocolo indicado.';
  if(info.instrument==='Geronte')return entry.resultSummary?.trim()?'':'Registra el perfil cualitativo obtenido en el protocolo Geronte.';
  const min=info.minimum??0,max=info.instrument==='Goldberg'?9:info.maximum;
  if(entry.score===undefined||entry.score.trim()===''||!Number.isInteger(Number(entry.score))||Number(entry.score)<min||max===undefined||Number(entry.score)>max)return 'Revisa la puntuación externa y su rango: '+min+'–'+max+'.';
  if(info.instrument==='Goldberg'&&!['EADG-A · ansiedad · 9 ítems · resultado externo','EADG-D · depresión · 9 ítems · resultado externo'].includes(entry.version))return 'Selecciona la subescala de Goldberg que has administrado.';
 }
 return '';
}
