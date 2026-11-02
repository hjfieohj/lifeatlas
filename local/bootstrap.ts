import {initializeStorage} from './storage';
window.LIFEATLAS_LOCAL_READY=initializeStorage();
window.LIFEATLAS_LOCAL_READY.catch(()=>{const status=document.querySelector('#webgl-status');if(status)status.textContent='本地资料暂不可用，请重新启动程序后刷新。';});
