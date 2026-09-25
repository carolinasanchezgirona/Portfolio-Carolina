
/* Carolina Instagram render/export: exact 1080x1350 slides; text within centered square crop. */
(function () {
  "use strict";
  const W = 1080, H = 1350;
  const NAVY = "#173A5E", PALE = "#EAF6FB", WHITE = "#FFFFFF";
  const photoCache = new Map();
  const encoder = new TextEncoder();

  function accent(post) { return post.accent === "coral" ? "#F2766B" : "#08A6A0"; }
  function rect(ctx,x,y,w,h,color,radius) {
    ctx.beginPath(); ctx.roundRect(x,y,w,h,radius || 0); ctx.fillStyle=color; ctx.fill();
  }
  function type(ctx,text,fontSize,weight,face,color) {
    ctx.font = String(weight) + " " + fontSize + "px " + face;
    ctx.fillStyle = color || NAVY; ctx.textBaseline="top";
  }
  function getLines(ctx,value,maxWidth) {
    const paragraphs = String(value || "").split(/\n/);
    const lines = [];
    paragraphs.forEach(function(paragraph) {
      const words = paragraph.trim().split(/\s+/).filter(Boolean);
      if (!words.length) { lines.push(""); return; }
      let line = "";
      words.forEach(function(word) {
        const next = line ? line + " " + word : word;
        if (ctx.measureText(next).width <= maxWidth) { line=next; return; }
        if (line) { lines.push(line); line=word; }
        else {
          let fragment="";
          Array.from(word).forEach(function(ch) {
            if (ctx.measureText(fragment+ch).width>maxWidth && fragment) { lines.push(fragment);fragment=ch; }
            else fragment+=ch;
          });
          line=fragment;
        }
      });
      if (line) lines.push(line);
    });
    return lines;
  }
  function put(ctx,value,x,y,width,opts) {
    const face=opts.face || '"DM Sans", sans-serif', weight=opts.weight || 500;
    let size=opts.size || 40;
    let lines;
    do {
      type(ctx,value,size,weight,face,opts.color || NAVY);
      lines=getLines(ctx,value,width);
      if(lines.length <= (opts.maxLines || 6)) break;
      size-=2;
    } while(size >= (opts.minSize || 28));
    const lineHeight=size*(opts.leading || 1.2);
    const maxLines=Math.max(1,Math.min(opts.maxLines || 6,opts.maxBottom ? Math.floor((opts.maxBottom-y)/lineHeight) : (opts.maxLines || 6)));
    const shown=lines.slice(0,maxLines);
    if(lines.length > maxLines && shown.length) {
      let last=shown[shown.length-1];
      while(last.length>1 && ctx.measureText(last+"…").width>width) last=last.slice(0,-1);
      shown[shown.length-1]=last+"…";
    }
    const lh=lineHeight;
    shown.forEach(function(line,i){ctx.fillText(line,x,y+i*lh);});
    return y+shown.length*lh;
  }
  function footer(ctx,post,index,total) {
    rect(ctx,80,1110,920,2,"#dce7ec",1);
    type(ctx,"CAROLINA SÁNCHEZ · PSICÓLOGA",24,700,'"DM Sans", sans-serif',NAVY);
    ctx.fillText("CAROLINA SÁNCHEZ · PSICÓLOGA",84,1142);
    type(ctx,String(index+1).padStart(2,"0")+" / "+String(total).padStart(2,"0"),25,700,'"DM Sans", sans-serif',accent(post));
    ctx.textAlign="right";ctx.fillText(String(index+1).padStart(2,"0")+" / "+String(total).padStart(2,"0"),992,1142);ctx.textAlign="left";
  }
  async function imageFor(url) {
    if (!url) return null;
    if(!photoCache.has(url)) {
      const image = new Image();
      image.crossOrigin="anonymous";
      const promise = new Promise(function(resolve,reject){
        image.onload=function(){resolve(image);};image.onerror=function(){reject(new Error("No se ha podido cargar una fotografía. Comprueba su URL."));};
        image.src=url;
      });
      photoCache.set(url,promise);
    }
    return photoCache.get(url);
  }
  async function photo(ctx,url,x,y,w,h) {
    if(!url) {
      rect(ctx,x,y,w,h,"#cce6ed",22);
      type(ctx,"Fotografía pendiente",32,700,'"DM Sans",sans-serif',NAVY);
      ctx.fillText("Fotografía pendiente",x+34,y+Math.min(h/2,300));
      return false;
    }
    const img=await imageFor(url);
    const scale=Math.max(w/img.naturalWidth,h/img.naturalHeight);
    const sw=w/scale,sh=h/scale,sx=(img.naturalWidth-sw)/2,sy=(img.naturalHeight-sh)/2;
    ctx.save();ctx.beginPath();ctx.roundRect(x,y,w,h,22);ctx.clip();
    ctx.drawImage(img,sx,sy,sw,sh,x,y,w,h);ctx.restore();
    return true;
  }
  function eyebrow(ctx,post,label,x,y) {
    rect(ctx,x,y,11,37,accent(post),5);
    type(ctx,label.toUpperCase(),23,800,'"DM Sans",sans-serif',NAVY);
    ctx.fillText(label.toUpperCase(),x+28,y+5);
  }
  function role(post) {
    return post.family === "pregunta" ? "PREGUNTA FRECUENTE · EJEMPLO" :
      post.family === "profesional" ? "PERSPECTIVA PROFESIONAL" : "PSICOEDUCACIÓN";
  }
  async function draw(post,index) {
    await Promise.all([
      document.fonts.load('700 100px "Fraunces"'),
      document.fonts.load('500 40px "DM Sans"')
    ]);
    const canvas=document.createElement("canvas");canvas.width=W;canvas.height=H;
    const ctx=canvas.getContext("2d");
    if(!ctx) throw new Error("El navegador no admite el lienzo de imágenes.");
    const slides=post.content.diapositivas || [], slide=slides[index];
    if(!slide) throw new Error("La diapositiva no existe.");
    const isCover=index===0;
    const tone=accent(post),layout=slide.composicion || "tipografica";
    rect(ctx,0,0,W,H,index%3===1 ? WHITE : PALE,0);
    const headline=slide.titulo || (isCover ? post.content.titulo : "Nueva diapositiva");
    const body=slide.texto || (isCover ? post.content.subtitulo : "");
    const label=role(post);
    if(layout==="fotografica" && slide.photo_url) {
      await photo(ctx,slide.photo_url,420,155,590,925);
      rect(ctx,65,365,565,600,WHITE,22);
      eyebrow(ctx,post,label,104,400);
      const end=put(ctx,headline,104,485,480,{face:'"Fraunces",Georgia,serif',weight:700,size:76,minSize:55,maxLines:5,leading:1.09});
      put(ctx,body,108,Math.min(end+27,855),468,{size:35,minSize:29,maxLines:4,leading:1.25,maxBottom:1080});
      rect(ctx,60,60,290,12,tone,6);
    } else if(layout==="dividida" && slide.photo_url) {
      await photo(ctx,slide.photo_url,75,145,930,360);
      rect(ctx,75,520,930,570,WHITE,20);
      eyebrow(ctx,post,label,107,557);
      const end=put(ctx,headline,107,624,860,{face:'"Fraunces",Georgia,serif',weight:700,size:70,minSize:52,maxLines:3,leading:1.06});
      put(ctx,body,110,end+19,847,{size:34,minSize:28,maxLines:5,leading:1.17,maxBottom:1080});
    } else if(layout==="pregunta" || post.family==="pregunta" && isCover) {
      rect(ctx,72,160,936,865,WHITE,26);
      rect(ctx,98,185,560,62,PALE,31);
      eyebrow(ctx,post,"PREGUNTA FRECUENTE · EJEMPLO",125,196);
      rect(ctx,107,297,12,540,tone,6);
      const end=put(ctx,headline,154,322,760,{face:'"Fraunces",Georgia,serif',weight:700,size:88,minSize:61,maxLines:5,leading:1.1});
      put(ctx,body,158,Math.min(end+38,790),755,{size:39,minSize:32,maxLines:6,leading:1.28,maxBottom:1080});
    } else if(layout==="profesional" && slide.photo_url) {
      await photo(ctx,slide.photo_url,600,165,406,866);
      rect(ctx,70,245,655,720,WHITE,22);
      eyebrow(ctx,post,"PERSPECTIVA PROFESIONAL",111,285);
      const end=put(ctx,headline,111,363,568,{face:'"Fraunces",Georgia,serif',weight:700,size:84,minSize:58,maxLines:5,leading:1.11});
      put(ctx,body,113,Math.min(end+28,822),570,{size:35,minSize:28,maxLines:5,leading:1.25,maxBottom:1080});
    } else {
      const offset=index%2===0 ? 0 : 28;
      rect(ctx,74,165+offset,19,145,tone,9);
      eyebrow(ctx,post,label,122,191+offset);
      const end=put(ctx,headline,98,337+offset,880,{face:'"Fraunces",Georgia,serif',weight:700,size:isCover?104:88,minSize:62,maxLines:5,leading:1.1});
      rect(ctx,99,Math.min(end+28,850),130,9,tone,4);
      put(ctx,body,100,Math.min(end+72,877),865,{size:isCover?39:41,minSize:32,maxLines:6,leading:1.27,maxBottom:1080});
      rect(ctx,876,825,120,120,tone,60);
      rect(ctx,925,871,35,35,PALE,17);
    }
    footer(ctx,post,index,slides.length);
    return canvas;
  }
  function crc32(bytes) {
    let crc=0xFFFFFFFF;
    for(const byte of bytes) {
      crc^=byte;
      for(let bit=0;bit<8;bit++)crc=(crc>>>1)^(-(crc&1)&0xEDB88320);
    }
    return (crc^0xFFFFFFFF)>>>0;
  }
  function writeName(header,offset,name) {header.set(encoder.encode(name),offset);}
  function zip(files) {
    const parts=[],central=[];let offset=0;
    files.forEach(function(file){
      const filename=encoder.encode(file.name),data=file.data;
      const checksum=crc32(data);
      const local=new Uint8Array(30+filename.length),h=new DataView(local.buffer);
      h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(8,0,true);
      h.setUint32(14,checksum,true);h.setUint32(18,data.length,true);h.setUint32(22,data.length,true);h.setUint16(26,filename.length,true);
      writeName(local,30,file.name);parts.push(local,data);
      const c=new Uint8Array(46+filename.length),v=new DataView(c.buffer);
      v.setUint32(0,0x02014b50,true);v.setUint16(4,20,true);v.setUint16(6,20,true);
      v.setUint32(16,checksum,true);v.setUint32(20,data.length,true);v.setUint32(24,data.length,true);
      v.setUint16(28,filename.length,true);v.setUint32(42,offset,true);writeName(c,46,file.name);
      central.push(c);offset+=local.length+data.length;
    });
    const centralSize=central.reduce(function(sum,item){return sum+item.length;},0);
    const end=new Uint8Array(22),v=new DataView(end.buffer);
    v.setUint32(0,0x06054b50,true);v.setUint16(8,files.length,true);v.setUint16(10,files.length,true);
    v.setUint32(12,centralSize,true);v.setUint32(16,offset,true);
    return new Blob(parts.concat(central,[end]),{type:"application/zip"});
  }
  function asBlob(canvas,type) {
    return new Promise(function(resolve,reject){
      canvas.toBlob(function(blob){if(blob)resolve(blob);else reject(new Error("No se pudo exportar la imagen."));},type || "image/png");
    });
  }
  function save(blob,name) {
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
    setTimeout(function(){URL.revokeObjectURL(url);},10000);
  }
  async function exportPack(post,caption,onProgress) {
    const slides=post.content.diapositivas||[],files=[];
    for(let i=0;i<slides.length;i++) {
      if(onProgress) onProgress(i+1,slides.length);
      const canvas=await draw(post,i),blob=await asBlob(canvas,"image/png");
      files.push({name:String(i+1).padStart(2,"0")+"-instagram.png",data:new Uint8Array(await blob.arrayBuffer())});
    }
    const notes=[
      "CAROLINA SÁNCHEZ | INSTAGRAM", "Tema: "+post.topic,"Familia: "+post.family,
      "Identidad visual: Fraunces + DM Sans. #173A5E y acento "+accent(post)+".",
      "TEXTO DE LA PUBLICACIÓN","",caption,"","TEXTOS ALTERNATIVOS",""
    ];
    slides.forEach(function(s,i){notes.push("Imagen "+(i+1)+": "+(s.alt||"Pendiente de descripción."));});
    notes.push("","REFERENCIAS REVISADAS",...(post.content.referencias||[]),"","Control clínico: revisión humana imprescindible.");
    files.push({name:"texto-publicacion-y-alt.txt",data:encoder.encode(notes.join("\n"))});
    const slug=String(post.topic||"instagram").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").slice(0,45);
    save(zip(files),"carolina-instagram-"+slug+".zip");
  }
  window.CarolinaInstagramRenderer={draw:draw,exportPack:exportPack,asBlob:asBlob,save:save};
})();
