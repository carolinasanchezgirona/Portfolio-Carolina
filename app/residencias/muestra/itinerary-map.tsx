const vertical = [100, 260, 420, 580];
const horizontal = [80, 210, 340];

const places = [
  {x:100,y:210,label:"Biblioteca",dx:-61,dy:-54,w:119,fill:"#e8f3f4"},
  {x:260,y:80,label:"Plaza",dx:-39,dy:15,w:78,fill:"#f0f3e6"},
  {x:580,y:80,label:"Mercado",dx:-51,dy:15,w:102,fill:"#f5e9e5"},
  {x:420,y:210,label:"Centro de día",dx:-80,dy:-54,w:160,fill:"#d9f0ef"},
  {x:260,y:340,label:"Farmacia",dx:-52,dy:17,w:104,fill:"#e9eef9"},
  {x:420,y:340,label:"Cafetería",dx:-53,dy:17,w:106,fill:"#f8efe0"},
  {x:580,y:340,label:"Centro cívico",dx:-74,dy:17,w:148,fill:"#f4eaf6"},
];

export default function ItineraryMap(){
  return <div className="res-map-wrap">
    <svg className="res-map" viewBox="0 0 720 440" role="img" aria-labelledby="res-map-title res-map-desc" xmlns="http://www.w3.org/2000/svg">
      <title id="res-map-title">Plano esquemático del barrio para preparar una salida</title>
      <desc id="res-map-desc">Calles en cuadrícula con cuatro calles verticales y tres horizontales. La conexión horizontal de la calle central entre el centro de día y la intersección de la plaza está cortada por obras. La farmacia se sitúa en la calle inferior, bajo la plaza; la biblioteca a la izquierda en la calle central.</desc>
      <rect x="0" y="0" width="720" height="440" fill="#f5f9f8" rx="13"/>
      <rect x="27" y="25" width="666" height="387" fill="#e8f1ef" stroke="#b4c9cb" strokeWidth="2" rx="9"/>
      <g stroke="#fff" strokeWidth="31" strokeLinecap="square">
        {vertical.map(x=><line key={"vb"+x} x1={x} x2={x} y1="80" y2="340"/>)}
        {horizontal.map(y=><line key={"hb"+y} x1="100" x2="580" y1={y} y2={y}/>)}
      </g>
      <g stroke="#a0babf" strokeWidth="2" strokeDasharray="7 9" strokeLinecap="round">
        {vertical.map(x=><line key={"vl"+x} x1={x} x2={x} y1="80" y2="340"/>)}
        {horizontal.map(y=><line key={"hl"+y} x1="100" x2="580" y1={y} y2={y}/>)}
      </g>
      <path d="M 277 210 H 402" fill="none" stroke="#ad483b" strokeWidth="18" strokeLinecap="round"/>
      <path d="M 279 210 H 402" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="12 13"/>
      <rect x="301" y="174" width="81" height="25" rx="6" fill="#fff2eb" stroke="#ad483b"/>
      <text x="341.5" y="191.5" fill="#8b3028" fontSize="15" fontWeight="800" textAnchor="middle">OBRAS</text>
      <g>
        {places.map(p=><g key={p.label}>
          <circle cx={p.x} cy={p.y} r="9" fill="#0b7980" stroke="#fff" strokeWidth="3"/>
          <rect x={p.x+p.dx} y={p.y+p.dy} width={p.w} height="30" rx="7" fill={p.fill} stroke="#739ca3" strokeWidth="1.4"/>
          <text x={p.x+p.dx+p.w/2} y={p.y+p.dy+19.5} textAnchor="middle" fill="#163f4e" fontWeight="700" fontSize="15">{p.label}</text>
        </g>)}
      </g>
      <g transform="translate(648 80)">
        <path d="M0 16 L12 -15 L24 16 L12 9 Z" fill="#166f79"/>
        <text x="12" y="-23" fill="#244851" fontSize="17" textAnchor="middle" fontWeight="700">N</text>
      </g>
      <rect x="37" y="375" width="520" height="29" fill="#fff" rx="5"/>
      <circle cx="58" cy="389" r="7" fill="#0b7980"/>
      <text x="74" y="394" fill="#32545d" fontSize="15">Punto de interés</text>
      <line x1="249" y1="389" x2="293" y2="389" stroke="#ad483b" strokeWidth="9"/>
      <text x="306" y="394" fill="#32545d" fontSize="15">Tramo cerrado: no atravesar</text>
    </svg>
    <p className="res-map-caption">Plano ficticio, sin escala. Los tramos blancos representan vías disponibles; el tramo rojo está cerrado. Es un recurso de razonamiento, no un plano real de accesibilidad.</p>
  </div>;
}
