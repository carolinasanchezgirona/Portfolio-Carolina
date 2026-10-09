(() => {
  'use strict';
  const card=document.getElementById('space-appointment-card');
  if(!card)return;
  const panel=document.createElement('div');panel.hidden=true;
  const text=document.createElement('p'),button=document.createElement('button');
  button.type='button';button.className='space-primary';button.textContent='Entrar en la videoconsulta';
  panel.append(text,button);card.append(panel);
  let ready=false,loading=false;
  async function getVideo(){const response=await fetch('/api/patient-portal/video',{credentials:'same-origin',cache:'no-store'});if(!response.ok)return null;return (await response.json()).video;}
  async function update(){
    if(loading)return;loading=true;
    try{
      const video=await getVideo();ready=!!video?.available;panel.hidden=!video;button.disabled=!ready;
      text.textContent=ready?'Tu videoconsulta está disponible. Se abrirá en Google Meet, en otra pestaña.':'El acceso a Google Meet estará disponible 15 minutos antes de tu cita.';
    }catch{ready=false;panel.hidden=true;}finally{loading=false;}
  }
  button.addEventListener('click',async()=>{
    if(!ready)return;
    // Open on the user gesture, then recheck authorization and revocation server-side.
    const tab=window.open('about:blank','_blank');if(tab)tab.opener=null;
    button.disabled=true;
    try{
      const video=await getVideo();const url=new URL(video?.url || 'about:blank');
      if(!video?.available || url.origin!=='https://meet.google.com' || !/^\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/.test(url.pathname))throw new Error('El acceso ya no está disponible.');
      if(tab){tab.document.write('<meta name="referrer" content="no-referrer">');tab.location.replace(url.href);}
      else{const link=document.createElement('a');link.href=url.href;link.target='_blank';link.rel='noopener noreferrer';link.referrerPolicy='no-referrer';link.textContent='Abrir Google Meet';text.replaceChildren(document.createTextNode('Tu navegador ha bloqueado la nueva pestaña. '),link);}
    }catch(error){if(tab)tab.close();text.textContent=error.message || 'No se ha podido abrir la videoconsulta.';}
    finally{button.disabled=false;}
  });
  document.getElementById('space-logout')?.addEventListener('click',()=>{ready=false;panel.hidden=true;});
  window.addEventListener('focus',update);document.addEventListener('visibilitychange',()=>{if(!document.hidden)update();});
  setInterval(()=>{if(!document.hidden)update();},30000);update();
})();
