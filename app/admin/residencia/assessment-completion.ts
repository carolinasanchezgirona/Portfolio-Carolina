import type {Resident} from './model';
import type {AssessmentCampaign} from './campaign-model';
import {campaignPath} from './campaign-model';
type Api=(path:string,init?:RequestInit)=>Promise<unknown>;
// Run only after the clinical record has been durably saved. A failed planner
// update must never undo that record or invite a second clinical submission.
export async function completeAssessmentAppointments(before:Resident,after:Resident,api:Api,now:string){
 const dates=new Set(after.data.assessments.filter(e=>e.date<=now&&e.conclusion?.trim()&&JSON.stringify(before.data.assessments.find(old=>old.id===e.id))!==JSON.stringify(e)).map(e=>e.date));
 if(!dates.size)return 0;
 let campaigns:AssessmentCampaign[]=[];
 for(let offset=0;;offset+=100){const page=await api(campaignPath+offset);if(!Array.isArray(page))throw Error('Agenda no disponible.');campaigns=campaigns.concat(page);if(page.length<100)break;}
 let completed=0;
 for(const c of campaigns){const matches=c.data.slots.filter(s=>s.resident_id===after.id&&dates.has(s.date)&&s.status==='planned');if(!matches.length)continue;
  const ids=new Set(matches.map(s=>s.id));const payload={...c,revision:c.revision+1,data:{...c.data,slots:c.data.slots.map(s=>ids.has(s.id)?{...s,status:'done'}:s)}};
  const result=await api('/rest/v1/residence_assessment_campaigns?id=eq.'+c.id+'&revision=eq.'+c.revision,{method:'PATCH',body:JSON.stringify(payload)});
  if(!Array.isArray(result)||!result[0])throw Error('La campaña ha cambiado en otra ventana.');completed+=matches.length;
 }
 return completed;
}
