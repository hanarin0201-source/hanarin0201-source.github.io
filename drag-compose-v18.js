(()=>{
const APP_VERSION='20';
if(window.__kokmatchMobileV20Loading)return;
window.__kokmatchMobileV20Loading=true;
const s=document.createElement('script');
s.src='/mobile-compose-v20.js?v=20';
s.async=false;
s.onload=()=>{document.documentElement.dataset.kokmatchVersion=APP_VERSION;window.__kokmatchMobileV20Loaded=true};
s.onerror=()=>{window.__kokmatchMobileV20Loading=false;console.error('콕매치 v20 모듈을 불러오지 못했습니다.')};
document.body.appendChild(s);
})();
