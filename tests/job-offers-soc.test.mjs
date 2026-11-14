import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSocOffers } from '../scripts/job-offers-soc.mjs';

function offer({id='FA92333333',title='PSICÒLEG/A CLÍNIC/A',city='MATARÓ',date='13/11/2026',
  contract='Contracte laboral indefinit',status='PUBLISHED',
  company='Centre de salut',content='Treball amb adults',requirements='Grau en Psicologia'}={}){
  return '<ad><id>'+id+'</id><url>https://feinaactiva.gencat.cat/search/offers/detail/'+id+
    '</url><title>'+title+'</title><city>'+city+'</city><date>'+date+
    '</date><contract>'+contract+'</contract><status>'+status+
    '</status><company>'+company+'</company><content>'+content+
    '</content><requirements>'+requirements+
    '</requirements><workingHours>Jornada parcial matí</workingHours>'+
    '<salaryMin>1700</salaryMin><salaryMax>1900</salaryMax></ad>';
}
test('SOC: admite puesto asalariado reciente en Maresme, sin inventar URL',()=>{
  const jobs=parseSocOffers('<ofertes><feinaactiva>'+offer()+'</feinaactiva></ofertes>','2026-11-14');
  assert.equal(jobs.length,1);
  assert.equal(jobs[0].municipality,'MATARÓ');
  assert.equal(jobs[0].posted,'2026-11-13');
  assert.match(jobs[0].url,/FA92333333$/);
  assert.match(jobs[0].hours,/parcial/);
});
test('SOC: descarta mercantil, fuera de ámbito, fechas antiguas y PIR obligatorio',()=>{
  const xml='<ofertes><feinaactiva>'+[
    offer({id:'FA92333331',contract:'Contracte mercantil'}),
    offer({id:'FA92333332',city:'GIRONA'}),
    offer({id:'FA92333333',date:'01/10/2026'}),
    offer({id:'FA92333334',requirements:'Imprescindible PIR'}),
    offer({id:'FA92333335',title:'ADMINISTRATIU/VA'}),
    offer({id:'FA92333336',city:'BARCELONA',title:'NEUROPSICÒLEG/ÒLOGA'})
  ].join('')+'</feinaactiva></ofertes>';
  const jobs=parseSocOffers(xml,'2026-11-14');
  assert.equal(jobs.length,1);
  assert.match(jobs[0].url,/FA92333336$/);
});
test('SOC: rechaza XML sin registros',()=>{
  assert.throws(()=>parseSocOffers('<html>error</html>','2026-11-14'),/sin registros/);
});
