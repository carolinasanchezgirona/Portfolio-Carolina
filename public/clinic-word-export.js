/* Clinical Word draft: generated entirely in-browser, never uploaded for export. */
(() => {
"use strict";
const xmlEscape = x => String(x ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
const xmlText = x => xmlEscape(x).replace(/\r\n?/g,"\n").split("\n").map(v=>'<w:t xml:space="preserve">'+v+"</w:t>").join("<w:br/>");
const para = (value, style="Normal", editable=false, id=0) => {
 const text=String(value||"").trim() || "[Completar durante la revisión profesional]";
 const content='<w:p><w:pPr><w:pStyle w:val="'+style+'"/></w:pPr><w:r><w:t xml:space="preserve">'+xmlEscape(text).replace(/\r\n?/g,"\n").replace(/\n/g,"</w:t><w:br/><w:t xml:space=\"preserve\">")+"</w:t></w:r></w:p>";
 return editable ? '<w:permStart w:id="'+id+'" w:edGrp="everyone"/>'+content+'<w:permEnd w:id="'+id+'"/>' : content;
};
const table = rows => '<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:bottom w:val="single" w:color="C9E4E3"/></w:tblBorders></w:tblPr><w:tblGrid><w:gridCol w:w="2800"/><w:gridCol w:w="6600"/></w:tblGrid>'+rows.map(([a,b],i)=>'<w:tr><w:tc><w:tcPr><w:shd w:fill="'+(i%2?'FFFFFF':'EAF6F5')+'"/></w:tcPr>'+para(a,"TableLabel")+'</w:tc><w:tc><w:tcPr><w:shd w:fill="'+(i%2?'FFFFFF':'EAF6F5')+'"/></w:tcPr>'+para(b||"No consta","Normal")+"</w:tc></w:tr>").join("")+"</w:tbl>";
function crc32(bytes){let c=-1;for(const v of bytes){c^=v;for(let j=0;j<8;j++)c=(c>>>1)^(0xEDB88320&-(c&1));}return (c^-1)>>>0;}
function zip(files){
 const te=new TextEncoder(),out=[],central=[];let offset=0;
 const u16=n=>[n&255,(n>>>8)&255],u32=n=>[n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255];
 for(const [name,contents] of Object.entries(files)){
  const n=te.encode(name),b=te.encode(contents),crc=crc32(b),size=b.length;
  const local=Uint8Array.from([...u32(0x04034b50),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(size),...u32(size),...u16(n.length),...u16(0),...n,...b]);
  out.push(local);
  central.push(Uint8Array.from([...u32(0x02014b50),...u16(20),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(size),...u32(size),...u16(n.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset),...n]));
  offset+=local.length;
 }
 const count=central.length,centralSize=central.reduce((s,v)=>s+v.length,0),end=Uint8Array.from([...u32(0x06054b50),...u16(0),...u16(0),...u16(count),...u16(count),...u32(centralSize),...u32(offset),...u16(0)]);
 return new Blob([...out,...central,end],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
}
function download(payload){
 const data=payload||{}, sections=data.sections||{}, identity=data.identity||{}, now=new Date();
 const date=now.toLocaleDateString("es-ES");
 const order=[
  ["Motivo del informe y pregunta clínica","context"],
  ["Fuentes de información y procedimiento","sources"],
  ["Antecedentes clínicos relevantes","background"],
  ["Observación conductual y estado mental","observation"],
  ["Resultados y evolución clínica","results"],
  ["Integración e impresión clínica","integration"],
  ["Intervención terapéutica y evolución","interventions"],
  ["Conclusiones","conclusions"],
  ["Recomendaciones y plan de seguimiento","plan"],
  ["Limitaciones y vigencia","limitations"]
 ];
 let n=1,body=para("INFORME CLÍNICO DE EVOLUCIÓN Y SEGUIMIENTO","Title");
 body+=para("BORRADOR · PENDIENTE DE REVISIÓN Y FIRMA","State");
 body+=para("1. Datos de identificación","Heading1");
 body+=table([["Paciente",identity.name],["Código de historia",identity.code],["Fecha de nacimiento",identity.birth],["Periodo de seguimiento",data.period],["Destinatario",data.recipient||"Profesional sanitario"],["Finalidad",data.purpose],["Fecha de emisión",date],["Profesional",data.professional||"Carolina Sánchez Girona · Psicóloga General Sanitaria y Neuropsicóloga"],["N.º de colegiación",data.license||"Pendiente de completar"]]);
 n=2;
 for(const [label,key] of order){
  const v=sections[key];if(!v && ["observation","results","background"].includes(key))continue;
  body+=para(n+". "+label,"Heading1");
  body+=para(v||"", "Normal",true,n+30);
  n++;
 }
 body+=para(n+". Cierre, firma y confidencialidad","Heading1");
 body+=para(data.professional||"Carolina Sánchez Girona · Psicóloga General Sanitaria y Neuropsicóloga");
 body+=para("Documento clínico confidencial, destinado exclusivamente a la finalidad asistencial indicada. Borrador no firmado.");
 const styles='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:rPr><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos"/><w:sz w:val="21"/><w:color w:val="173A5E"/></w:rPr><w:pPr><w:spacing w:after="160" w:line="300" w:lineRule="auto"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:rPr><w:b/><w:sz w:val="36"/><w:color w:val="173A5E"/></w:rPr><w:pPr><w:spacing w:after="220"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:rPr><w:b/><w:sz w:val="25"/><w:color w:val="19747A"/></w:rPr><w:pPr><w:spacing w:before="250" w:after="130"/><w:keepNext/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="State"><w:name w:val="State"/><w:rPr><w:b/><w:color w:val="B64A2B"/><w:sz w:val="18"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="TableLabel"><w:name w:val="Table Label"/><w:rPr><w:b/><w:color w:val="173A5E"/></w:rPr></w:style></w:styles>';
 const docXml='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+body+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1300" w:right="1300" w:bottom="1300" w:left="1300"/></w:sectPr></w:body></w:document>';
 // Word editable-range permissions: narrative can be edited; identification and headings remain protected.
 const settings='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:documentProtection w:edit="readOnly" w:enforcement="1"/></w:settings>';
 const ct='<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/></Types>';
 const rels='<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
 const docRels='<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/></Relationships>';
 const blob=zip({"[Content_Types].xml":ct,"_rels/.rels":rels,"word/document.xml":docXml,"word/styles.xml":styles,"word/settings.xml":settings,"word/_rels/document.xml.rels":docRels});
 const a=document.createElement("a"),url=URL.createObjectURL(blob);
 const safe=(identity.code||"paciente").replace(/[^a-z0-9_-]/gi,"_").slice(0,48);
 a.href=url;a.download="Informe_evolucion_"+safe+"_"+now.toISOString().slice(0,10)+".docx";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 return true;
}
window.ClinicWordExport={download};
})();