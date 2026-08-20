(()=>{
const ROLE_REPLACE92=[['총관리자','개발자']];
roleLabel=function(r){return r==='admin'?'개발자':r==='manager'?'모임장':r==='organizer'?'운영진':'일반'};
function translate92(root){
 if(!root)return;
 const apply=t=>{if(!t?.nodeValue)return;const p=t.parentElement;if(p&&['SCRIPT','STYLE'].includes(p.tagName))return;let s=t.nodeValue;for(const[a,b]of ROLE_REPLACE92)s=s.split(a).join(b);if(s!==t.nodeValue)t.nodeValue=s};
 if(root.nodeType===Node.TEXT_NODE){apply(root);return}
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode()))apply(n);
}
const obs92=new MutationObserver(ms=>{for(const m of ms){if(m.type==='characterData')translate92(m.target);else for(const n of m.addedNodes)translate92(n)}});
obs92.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
const renderSettings91=renderSettings;
renderSettings=function(){renderSettings91();const box=$('settings');if(box){translate92(box);[...box.querySelectorAll('.meta')].forEach(el=>{if((el.textContent||'').includes('콕매치 v91'))el.textContent='콕매치 v92 · 역할명칭/편성화면 조정'})}};
if(location.pathname.startsWith('/launch/v92'))history.replaceState(null,'','/?loaded=92');
translate92(document.documentElement);
if(me)renderAll();
})();
