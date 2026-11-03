import {initializeStorage} from './storage';
import {mountInlineAI} from '../src/inline-ai';
Object.assign(window,{lifeAtlasAI:mountInlineAI});
window.LIFEATLAS_LOCAL_READY=initializeStorage();
window.LIFEATLAS_LOCAL_READY.catch(()=>{const status=document.querySelector('#webgl-status');if(status)status.textContent='本地资料暂不可用，请重新启动程序后刷新。';});
