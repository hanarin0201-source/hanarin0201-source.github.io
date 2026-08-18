(()=>{
const path=location.pathname;
function load(src,onload){const s=document.createElement('script');s.src=src;s.async=false;if(onload)s.onload=onload;document.body.appendChild(s)}
if(path.startsWith('/versions/v20/')){load('/versions/v20/mobile-compose-v20.js?v=20');return}
if(path.startsWith('/versions/v21/')){load('/versions/v21/mobile-compose-v20.js?v=20',()=>load('/versions/v21/mobile-compose-v21.js?v=21'));return}
load('/mobile-compose-v20.js?v=20',()=>load('/mobile-compose-v21.js?v=21',()=>load('/mobile-compose-v22.js?v=22')));
})();
