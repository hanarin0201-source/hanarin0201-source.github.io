(()=>{
const memberControls42=memberControls;
memberControls=function(m){
  if(roleOf(m)==='admin'&&!me?.globalAdmin)return `<div class="status">${stateLabel(m.state)}</div>`;
  return memberControls42(m);
};

const openMemberModal42=openMemberModal;
openMemberModal=function(m){
  openMemberModal42(m);
  if(m&&roleOf(m)==='manager'&&!me?.globalAdmin&&m.id===me?.memberId){
    const type=$('fmType');if(type){type.value='member';type.disabled=true}
  }
};

if(me)renderAll();
})();
