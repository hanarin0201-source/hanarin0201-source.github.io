(()=>{
const path=location.pathname;
if(path.startsWith('/versions/v20/')){
  const s=document.createElement('script');
  s.src='/versions/v20/mobile-compose-v20.js?v=20';
  s.async=false;
  document.body.appendChild(s);
  return;
}
const base=document.createElement('script');
base.src='/mobile-compose-v20.js?v=20';
base.async=false;
base.onload=()=>{
  const next=document.createElement('script');
  next.src='/mobile-compose-v21.js?v=21';
  next.async=false;
  document.body.appendChild(next);
};
document.body.appendChild(base);
})();
