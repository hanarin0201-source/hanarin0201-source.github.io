(()=>{
function isDeveloper100(){
 if(!me)return false;
 if(me.globalAdmin===true)return true;
 const mid=String(me.memberId||'');
 const mine=mid?M(mid):S?.members?.find?.(m=>String(m?.name||'').trim()===String(me?.displayName||'').trim());
 return !!mine && roleOf(mine)==='admin';
}
function restoreDeveloper100(){
 if(!me)return false;
 if(isDeveloper100()){
  me.globalAdmin=true;
  return true;
 }
 return false;
}
const baseCanGame100=canGame;
canGame=function(){return restoreDeveloper100()||baseCanGame100()};
const baseCanManageMembers100=canManageMembers;
canManageMembers=function(){return restoreDeveloper100()||baseCanManageMembers100()};
const baseCanSetRoles100=canSetRoles;
canSetRoles=function(){return restoreDeveloper100()||baseCanSetRoles100()};
const baseCanReset100=canReset;
canReset=function(){return restoreDeveloper100()||baseCanReset100()};
const baseCanManageGroups100=canManageGroups;
canManageGroups=function(){return restoreDeveloper100()||baseCanManageGroups100()};
const oldRenderAll100=renderAll;
renderAll=function(){restoreDeveloper100();oldRenderAll100();};
const oldGoView100=goView;
goView=function(id){restoreDeveloper100();oldGoView100(id);setTimeout(()=>{restoreDeveloper100();if(id==='members')renderMembers()},0)};
const oldLoadState100=loadState;
loadState=async function(){await oldLoadState100();restoreDeveloper100();};
const oldSettings100=renderSettings;
renderSettings=function(){restoreDeveloper100();oldSettings100();const b=$('settings');if(b)[...b.querySelectorAll('.meta')].forEach(e=>{if(/콕매치 v9[0-9]/.test(e.textContent||''))e.textContent='콕매치 v100 · 개발자 배지 숨김과 실제 권한 분리'})};
if(location.pathname.startsWith('/launch/v100'))history.replaceState(null,'','/?loaded=100');
if(me){restoreDeveloper100();renderAll()}
})();
