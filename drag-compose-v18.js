(async()=>{
const path=location.pathname;
const archived=new URLSearchParams(location.search).get('version')||'';
const MAIN_API='https://wjelumpbjklfrdjxbesj.supabase.co/functions/v1/kokmatch-api';
function load(src,onload){const s=document.createElement('script');s.src=src;s.async=false;if(onload)s.onload=onload;document.body.appendChild(s)}
function load20(next){load('/mobile-compose-v20.js?v=20',next)}
function load21(next){load('/mobile-compose-v21.js?v=21',next)}
function load22(next){load('/mobile-compose-v22.js?v=22',next)}
function load23(next){load('/mobile-compose-v23.js?v=23',next)}
function load24(next){load('/mobile-compose-v24.js?v=24',next)}
function load25(next){load('/mobile-compose-v25.js?v=25',()=>load('/mobile-compose-v25-fix.js?v=25',next))}
function load26(next){load('/mobile-compose-v26.js?v=26',next)}
function load27(){load('/mobile-compose-v27.js?v=27')}
async function allowArchive(){
 document.documentElement.style.visibility='hidden';
 try{
  const t=localStorage.getItem('kokmatch_token')||'';
  if(!t)throw new Error('no token');
  const r=await fetch(MAIN_API+'?api=state',{headers:{authorization:'Bearer '+t},cache:'no-store'});
  const x=await r.json();
  if(!r.ok||x?.user?.role!=='admin')throw new Error('not admin');
  document.documentElement.style.visibility='';return true;
 }catch(e){location.replace('/?v=27&archiveDenied=1');return false}
}
const archiveMode=['20','21','22','23','24','25','26'].some(v=>path.startsWith('/versions/v'+v+'/'))||['20','21','22','23','24','25','26'].includes(archived);
if(archiveMode&&!(await allowArchive()))return;
if(path.startsWith('/versions/v20/')||archived==='20'){load20();return}
if(path.startsWith('/versions/v21/')||archived==='21'){load20(()=>load21());return}
if(path.startsWith('/versions/v22/')||archived==='22'){load20(()=>load21(()=>load22()));return}
if(path.startsWith('/versions/v23/')||archived==='23'){load20(()=>load21(()=>load22(()=>load23())));return}
if(path.startsWith('/versions/v24/')||archived==='24'){load20(()=>load21(()=>load22(()=>load23(()=>load24()))));return}
if(path.startsWith('/versions/v25/')||archived==='25'){load20(()=>load21(()=>load22(()=>load23(()=>load24(()=>load25())))));return}
if(path.startsWith('/versions/v26/')||archived==='26'){load20(()=>load21(()=>load22(()=>load23(()=>load24(()=>load25(()=>load26()))))));return}
load20(()=>load21(()=>load22(()=>load23(()=>load24(()=>load25(()=>load26(()=>load27())))))));
})();
