(()=>{
function autoTitle91(date,time,location){
 const a=String(date||'').split('-').map(Number);
 if(a.length!==3||!a[1]||!a[2])return '운동';
 const place=String(location||'').trim();
 return `${a[1]}월 ${a[2]}일 ${time||''}${place?' '+place:''} 운동`;
}
function enforceEndOptions91(){
 const start=$('pollTime72'),end=$('pollEndTime90');if(!start||!end)return;
 const s=String(start.value||'');
 let first='';
 [...end.options].forEach(o=>{
  const disabled=String(o.value)<=s;
  o.disabled=disabled;
  if(!disabled&&!first)first=o.value;
 });
 if(!end.value||String(end.value)<=s){end.value=first||''}
}
function normalizeAutoTitle91(force=false){
 const title=$('pollTitle72');if(!title)return;
 const date=$('pollDate72')?.value||'',time=$('pollTime72')?.value||'',location=$('pollLocation73')?.value.trim()||'';
 const cur=String(title.value||'');
 const looksAuto=/참석투표\s*$/.test(cur)||/운동\s*$/.test(cur)||title.dataset.manual!=='1';
 if(force||looksAuto){title.value=autoTitle91(date,time,location);title.dataset.manual='0'}
}
function bindPoll91(){
 const start=$('pollTime72'),end=$('pollEndTime90'),date=$('pollDate72'),loc=$('pollLocation73'),title=$('pollTitle72');
 if(!start||!end)return;
 const lastStart=[...start.options].find(o=>o.value==='23:30');if(lastStart)lastStart.disabled=true;
 enforceEndOptions91();normalizeAutoTitle91(true);
 start.addEventListener('change',()=>{enforceEndOptions91();normalizeAutoTitle91()});
 date?.addEventListener('change',()=>normalizeAutoTitle91());
 loc?.addEventListener('input',()=>normalizeAutoTitle91());
 title?.addEventListener('input',()=>{title.dataset.manual='1'});
}
const openCreate90=openPollCreate72;
openPollCreate72=function(){openCreate90();setTimeout(bindPoll91,0)};
const openEdit90=openPollEdit90;
openPollEdit90=function(id){openEdit90(id);setTimeout(bindPoll91,0)};
const create90=createPoll72;
createPoll72=async function(){const title=$('pollTitle72');if(title&&!title.value.trim())title.value=autoTitle91($('pollDate72')?.value||'',$('pollTime72')?.value||'',$('pollLocation73')?.value.trim()||'');return create90()};
const saveEdit90=savePollEdit90;
savePollEdit90=async function(id){const title=$('pollTitle72');if(title&&!title.value.trim())title.value=autoTitle91($('pollDate72')?.value||'',$('pollTime72')?.value||'',$('pollLocation73')?.value.trim()||'');return saveEdit90(id)};

const renderSettings90=renderSettings;
renderSettings=function(){
 renderSettings90();const box=$('settings');if(!box)return;
 const partner=box.querySelector('.partnerCard66');
 if(partner){const b=partner.querySelector('b');if(b&&(b.textContent||'').trim()==='오늘 파트너')b.textContent='오늘 내 파트너'}
 [...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v90'))el.textContent='콕매치 v91 · 전 화면 가독성 확대 · 투표 시간제한/자동제목 개선'});
};
if(location.pathname.startsWith('/launch/v91'))history.replaceState(null,'','/?loaded=91');
if(me)renderAll();
})();
