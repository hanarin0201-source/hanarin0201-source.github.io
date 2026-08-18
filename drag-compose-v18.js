(()=>{
const path=location.pathname;
const archived=new URLSearchParams(location.search).get('version')||'';
function load(src,onload){const s=document.createElement('script');s.src=src;s.async=false;if(onload)s.onload=onload;document.body.appendChild(s)}
function load20(next){load('/mobile-compose-v20.js?v=20',next)}
function load21(next){load('/mobile-compose-v21.js?v=21',next)}
function load22(next){load('/mobile-compose-v22.js?v=22',next)}
function load23(){load('/mobile-compose-v23.js?v=23')}
if(path.startsWith('/versions/v20/')){load('/versions/v20/mobile-compose-v20.js?v=20');return}
if(path.startsWith('/versions/v21/')){load('/versions/v21/mobile-compose-v20.js?v=20',()=>load('/versions/v21/mobile-compose-v21.js?v=21'));return}
if(path.startsWith('/versions/v22/')||archived==='22'){load20(()=>load21(()=>load22()));return}
if(archived==='21'){load20(()=>load21());return}
if(archived==='20'){load20();return}
load20(()=>load21(()=>load22(()=>load23())));
})();
