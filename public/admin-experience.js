(() => {
 "use strict";
 if(!location.pathname.startsWith('/admin/'))return;
 document.body.classList.add('admin-ux-active');
 const main=document.querySelector('main'),skip=document.querySelector('.admin-skip-link');
 if(main){if(!main.id)main.id='admin-main-content';main.tabIndex=-1;if(skip)skip.href='#'+main.id;}
 skip?.addEventListener('click',()=>main?.focus({preventScroll:true}));
 const menuSelector='.admin-workspace-more,.clinic-more-menu,.workspace-context-menu,.admin-agenda-tools';
 const menus=()=>[...document.querySelectorAll(menuSelector)];
 document.addEventListener('click',event=>{for(const menu of menus())if(menu.open&&(!menu.contains(event.target)||(event.target.closest?.('a,button')&&menu.contains(event.target))))menu.open=false;});
 document.addEventListener('toggle',event=>{if(event.target.matches?.(menuSelector)&&event.target.open)for(const menu of menus())if(menu!==event.target)menu.open=false;},true);
 document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;const opened=menus().filter(menu=>menu.open);if(!opened.length)return;event.preventDefault();for(const menu of opened)menu.open=false;opened.at(-1).querySelector('summary')?.focus();});

 // React clinical/residence editors already manage their own drafts. These are
 // the legacy editors that otherwise lose unsaved input on a page change.
 const selectors='#article-form,#resource-form,#econ-invoice-form,#econ-expense-form,#econ-issuer-form,#econ-external-income-form,#ext-form,#appointment-form,#block-form';
 const states=new Map();
 const formOf=value=>typeof value==='string'?document.getElementById(value):value;
 function snapshot(form){return JSON.stringify([...form.querySelectorAll('input:not([type=hidden]),select,textarea,[contenteditable=true]')].map(e=>[e.id||e.name,e.isContentEditable?e.innerHTML:e.type==='checkbox'||e.type==='radio'?e.checked:e.type==='file'?[...e.files].map(f=>[f.name,f.size,f.lastModified]):e.value]));}
 function state(form){let s=states.get(form);if(!s){s={baseline:null,dirty:false,hint:null};states.set(form,s);}return s;}
 function show(form,s){if(!s.hint){s.hint=document.createElement('p');s.hint.className='admin-form-state';s.hint.setAttribute('role','status');s.hint.setAttribute('aria-live','polite');form.prepend(s.hint);}s.hint.textContent=s.dirty?'Cambios sin guardar':'';}
 function saved(value){const form=formOf(value);if(!form)return;const s=state(form);s.baseline=snapshot(form);s.dirty=false;if(s.hint)s.hint.textContent='';window.dispatchEvent(new CustomEvent('admin:form-saved',{detail:{id:form.id}}));}
 function dirty(value){const form=formOf(value),s=form&&states.get(form);return !!(s?.dirty&&form.isConnected);}
 function canDiscard(value){const form=formOf(value);if(!form||!dirty(form))return true;if(!window.confirm('Hay cambios sin guardar. ¿Quieres descartarlos?'))return false;saved(form);return true;}
 window.adminUX={saved,canDiscard,isDirty:dirty};
 const closers={'dialog-close':'appointment-form','appointment-close':'appointment-form','block-close':'block-form','block-cancel':'block-form','ext-cancel':'ext-form','econ-invoice-cancel':'econ-invoice-form'};
 document.addEventListener('click',event=>{const control=event.target.closest?.('button'),form=control&&closers[control.id];if(form&&!canDiscard(form)){event.preventDefault();event.stopImmediatePropagation();}},true);
 document.addEventListener('cancel',event=>{const form=event.target.querySelector?.('form');if(form?.matches(selectors)&&!canDiscard(form))event.preventDefault();},true);
 document.addEventListener('focusin',event=>{const form=event.target.closest?.('form');if(form?.matches(selectors)&&!dirty(form))state(form).baseline=snapshot(form);});
 const changed=event=>{const form=event.target.closest?.('form');if(!form?.matches(selectors))return;const s=state(form);s.dirty=s.baseline===null||snapshot(form)!==s.baseline;show(form,s);};
 document.addEventListener('input',changed,true);document.addEventListener('change',changed,true);
 document.addEventListener('reset',event=>{if(event.target.matches?.(selectors))queueMicrotask(()=>saved(event.target));},true);
 const pending=()=>[...states].some(([form,s])=>form.isConnected&&s.dirty);
 window.addEventListener('beforeunload',event=>{if(pending()){event.preventDefault();event.returnValue='';}});
 document.addEventListener('click',event=>{const a=event.target.closest?.('a[href]');if(!a||event.defaultPrevented||a.target==='_blank'||a.hasAttribute('download')||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;const url=new URL(a.href,location.href);if(url.origin===location.origin&&url.pathname===location.pathname&&url.search===location.search)return;if(!pending())return;if(!window.confirm('Hay cambios sin guardar. ¿Salir y descartarlos?')){event.preventDefault();event.stopImmediatePropagation();return;}for(const [form] of states)saved(form);},true);
})();
