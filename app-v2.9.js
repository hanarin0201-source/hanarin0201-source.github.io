(()=>{
const groupCache29=new Map();
const groupFetch29=new Map();
const GROUP_CACHE_TTL29=20000;

function cacheSnapshot29(id,x){
 if(!id||!x?.data||!x?.group)return;
 groupCache29.set(String(id),{at:Date.now(),x:{data:x.data,user:x.user,group:x.group,groups:x.groups||groups}});
}
function currentSnapshot29(){
 if(!currentGroupId||!group)return;
 groupCache29.set(String(currentGroupId),{at:Date.now(),x:{data:S,user:me,group,groups}});
}
function renderCurrentView29(view){
 try{renderHeader()}catch{}
 try{renderNav()}catch{}
 const v=String(view||currentView||'members');
 try{
  if(v==='members')renderMembers();
  else if(v==='queue')renderQueue();
  else if(v==='playing')renderPlaying();
  else if(v==='stats')renderStats();
  else if(v==='settings')renderSettings();
  else if(v==='groups'&&canManageGroups())renderGroups();
 }catch(e){console.error('group switch render',e)}
 document.querySelectorAll('.view').forEach(el=>el.classList.toggle('on',el.id===v));
 document.querySelectorAll('#nav button[data-v]').forEach(b=>b.classList.toggle('on',b.dataset.v===v));
}
function clearOtherViews29(keep){
 for(const id of ['members','queue','playing','stats','settings']){
  if(id!==keep){const el=$(id);if(el)el.innerHTML=''}
 }
}
function applyGroup29(id,x,view){
 S=x.data;me=x.user||me;group=x.group;groups=x.groups||groups;currentGroupId=String(id);localStorage.setItem(GROUP_KEY,currentGroupId);normalizeClient();
 currentView=view||'members';clearOtherViews29(currentView);renderCurrentView29(currentView);
}
async function fetchGroup29(id){
 const key=String(id);if(groupFetch29.has(key))return groupFetch29.get(key);
 const p=request('state','GET',null,{groupId:key}).then(x=>{cacheSnapshot29(key,x);return x}).finally(()=>groupFetch29.delete(key));
 groupFetch29.set(key,p);return p;
}
function prefetchGroups29(){
 if(!me?.globalAdmin||!Array.isArray(groups))return;
 const ids=groups.map(g=>String(g.groupId||'')).filter(id=>id&&id!==String(currentGroupId));
 let i=0;
 const run=()=>{
  if(i>=ids.length)return;
  const id=ids[i++],c=groupCache29.get(id);
  if(!c||Date.now()-c.at>GROUP_CACHE_TTL29)fetchGroup29(id).catch(()=>{});
  if('requestIdleCallback'in window)requestIdleCallback(run,{timeout:250});else setTimeout(run,80);
 };
 if('requestIdleCallback'in window)requestIdleCallback(run,{timeout:150});else setTimeout(run,40);
}

const loadState28=loadState;
loadState=async function(...args){
 const r=await loadState28(...args);currentSnapshot29();prefetchGroups29();return r;
};

const openGroupSwitch28=openGroupSwitch;
openGroupSwitch=async function(){
 if(!me?.globalAdmin)return;
 currentSnapshot29();prefetchGroups29();return openGroupSwitch28();
};

switchGroup=async function(id,view='members'){
 if(!me?.globalAdmin)return;
 const target=String(id||'');if(!target)return;
 if(target===String(currentGroupId)){closeModal();goView(view);return}
 currentSnapshot29();closeModal();
 const cached=groupCache29.get(target);
 if(cached&&Date.now()-cached.at<GROUP_CACHE_TTL29){
  applyGroup29(target,cached.x,view);
  try{window.scrollTo(0,0)}catch{}
  fetchGroup29(target).then(x=>{
    if(String(currentGroupId)!==target)return;
    const sigBefore=JSON.stringify([S.members?.length,S.queue?.length,S.pendingGames?.length,S.games?.length,S.history?.length,group?.name]);
    const sigAfter=JSON.stringify([x.data?.members?.length,x.data?.queue?.length,x.data?.pendingGames?.length,x.data?.games?.length,x.data?.history?.length,x.group?.name]);
    if(sigBefore!==sigAfter)applyGroup29(target,x,currentView);
    else{S=x.data;me=x.user||me;group=x.group;groups=x.groups||groups;normalizeClient();renderHeader()}
  }).catch(showError);
  return;
 }
 const g=(groups||[]).find(x=>String(x.groupId)===target);
 if(g){currentGroupId=target;localStorage.setItem(GROUP_KEY,target);const btn=$('groupBtn');if(btn)btn.textContent=`${g.name} · 불러오는 중`}
 try{const x=await fetchGroup29(target);applyGroup29(target,x,view);prefetchGroups29()}catch(e){showError(e);currentSnapshot29()}
};

const renderSettings28=renderSettings;
renderSettings=function(){
 renderSettings28();const b=$('settings');if(!b)return;
 [...b.querySelectorAll('.meta')].forEach(el=>{if(/콕매치 v(?:\d+|\d+\.\d+)/.test(el.textContent||''))el.textContent='콕매치 v2.9 · 개발자 모임전환 캐시 · 사전 로딩 · 선택 즉시 전환'});
};

currentSnapshot29();prefetchGroups29();
})();
