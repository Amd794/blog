document.addEventListener("DOMContentLoaded",()=>{const x=document.querySelector(".article-content");if(!x)return;const e=document.createElement("div");e.id="image-viewer-container",e.className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-md hidden",e.setAttribute("aria-hidden","true"),e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-label","图片查看器"),e.innerHTML=`
    <div class="relative w-full h-full p-4 md:p-8 flex items-center justify-center">
      <div class="image-viewer-content w-full h-full flex items-center justify-center">
        <div class="image-loader"></div>
        <img src="" alt="" class="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all duration-300 opacity-0" />
      </div>
      
      <div class="bottom-controls-container absolute bottom-0 left-0 right-0 flex flex-col items-center justify-center pb-4">
        <div id="image-caption" class="px-4 py-2 bg-gray-800 bg-opacity-70 text-white rounded-lg max-w-md text-sm mb-3"></div>
        
        <div class="control-bar flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-full">
          <button id="image-viewer-prev" class="p-2 rounded-full text-white hover:bg-gray-700 transition-colors" aria-label="上一张图片" tabindex="0">
            <iconify-icon icon="mdi:chevron-left" width="20" height="20"></iconify-icon>
          </button>
          
          <button id="image-viewer-rotate-left" class="p-2 rounded-full text-white hover:bg-gray-700 transition-colors" aria-label="向左旋转" tabindex="0">
            <iconify-icon icon="mdi:rotate-left" width="20" height="20"></iconify-icon>
          </button>
          
          <button id="image-viewer-zoom-out" class="p-2 rounded-full text-white hover:bg-gray-700 transition-colors" aria-label="缩小图片" tabindex="0">
            <iconify-icon icon="mdi:magnify-minus" width="20" height="20"></iconify-icon>
          </button>
          
          <button id="image-viewer-reset" class="p-2 rounded-full text-white hover:bg-gray-700 transition-colors" aria-label="重置图片大小" tabindex="0">
            <iconify-icon icon="mdi:refresh" width="20" height="20"></iconify-icon>
          </button>
          
          <button id="image-viewer-zoom-in" class="p-2 rounded-full text-white hover:bg-gray-700 transition-colors" aria-label="放大图片" tabindex="0">
            <iconify-icon icon="mdi:magnify-plus" width="20" height="20"></iconify-icon>
          </button>
          
          <button id="image-viewer-rotate-right" class="p-2 rounded-full text-white hover:bg-gray-700 transition-colors" aria-label="向右旋转" tabindex="0">
            <iconify-icon icon="mdi:rotate-right" width="20" height="20"></iconify-icon>
          </button>
          
          <button id="image-viewer-next" class="p-2 rounded-full text-white hover:bg-gray-700 transition-colors" aria-label="下一张图片" tabindex="0">
            <iconify-icon icon="mdi:chevron-right" width="20" height="20"></iconify-icon>
          </button>
          
          <div class="mx-2 h-6 w-px bg-gray-400 bg-opacity-50"></div>
          
          <button id="image-viewer-download" class="p-2 rounded-full text-white hover:bg-gray-700 transition-colors" aria-label="下载图片" tabindex="0">
            <iconify-icon icon="mdi:download" width="20" height="20"></iconify-icon>
          </button>
          
          <button id="image-viewer-close" class="p-2 rounded-full text-white hover:bg-gray-700 transition-colors" aria-label="关闭图片查看器" tabindex="0">
            <iconify-icon icon="mdi:close" width="20" height="20"></iconify-icon>
          </button>
        </div>
      </div>
    </div>
  `,document.body.appendChild(e);const t=e.querySelector("img"),w=e.querySelector(".image-loader"),E=e.querySelector("#image-viewer-close"),L=e.querySelector("#image-viewer-download"),I=e.querySelector("#image-viewer-zoom-in"),H=e.querySelector("#image-viewer-zoom-out"),W=e.querySelector("#image-viewer-reset"),$=e.querySelector("#image-viewer-rotate-left"),V=e.querySelector("#image-viewer-rotate-right"),r=e.querySelector("#image-viewer-prev"),d=e.querySelector("#image-viewer-next"),O=e.querySelector("#image-caption"),u=x.querySelectorAll("img");let o=0,n=1,p=0,l=!1,N=0,F=0,c=0,a=0;u.forEach((e,t)=>{e.style.cursor="zoom-in",e.setAttribute("tabindex","0"),e.setAttribute("aria-label",`${e.alt||"图片"} (点击查看大图)`),e.setAttribute("data-index",t);const n=()=>{f(t)};e.addEventListener("click",n),e.addEventListener("keydown",e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),n())})});function f(n){o=n;const s=u[n];m(),w.style.display="block",t.classList.add("opacity-0"),t.src=s.src,t.alt=s.alt||"图片",O.textContent=s.alt||s.title||"",O.style.display=O.textContent?"block":"none",e.classList.remove("hidden"),document.body.style.overflow="hidden",P(),t.onload=()=>{w.style.display="none",t.classList.remove("opacity-0"),t.classList.add("fade-in"),E.focus()},t.onerror=()=>{w.style.display="none",t.src="/images/image-error.svg",t.classList.remove("opacity-0")}}function P(){u.length<=1?(r.disabled=!0,d.disabled=!0,r.classList.add("opacity-50","cursor-not-allowed"),d.classList.add("opacity-50","cursor-not-allowed")):(o===0?(r.classList.add("opacity-50","cursor-not-allowed"),r.disabled=!0):(r.classList.remove("opacity-50","cursor-not-allowed"),r.disabled=!1),o===u.length-1?(d.classList.add("opacity-50","cursor-not-allowed"),d.disabled=!0):(d.classList.remove("opacity-50","cursor-not-allowed"),d.disabled=!1))}function m(){n=1,p=0,c=0,a=0,s()}function s(){t.style.transform=`translate(${c}px, ${a}px) rotate(${p}deg) scale(${n})`}const b=()=>{e.classList.add("hidden"),document.body.style.overflow="",m();const t=u[o];t&&t.focus()},A=()=>{o>0&&f(o-1)},S=()=>{o<u.length-1&&f(o+1)},v=()=>{n+=.1,n=Math.min(5,n),s()},y=()=>{n-=.1,n=Math.max(.1,n),s()},T=()=>{p-=90,s()},z=()=>{p+=90,s()},R=()=>{const e=document.createElement("a");e.href=t.src,e.download=t.alt||"image",e.target="_blank",e.click()};E.addEventListener("click",b),L.addEventListener("click",R),r.addEventListener("click",A),d.addEventListener("click",S),I.addEventListener("click",v),H.addEventListener("click",y),W.addEventListener("click",m),$.addEventListener("click",T),V.addEventListener("click",z),document.addEventListener("keydown",t=>{if(e.classList.contains("hidden"))return;switch(t.key){case"Escape":b();break;case"ArrowLeft":A();break;case"ArrowRight":S();break;case"ArrowUp":case"+":v();break;case"ArrowDown":case"-":y();break;case"r":z();break;case"l":T();break;case"0":m();break}}),e.addEventListener("click",t=>{t.target===e&&b()}),t.addEventListener("mousedown",e=>{if(e.button!==0)return;l=!0,N=e.clientX-c,F=e.clientY-a,t.style.cursor="grabbing",e.preventDefault()}),document.addEventListener("mousemove",e=>{if(!l)return;c=e.clientX-N,a=e.clientY-F,s(),e.preventDefault()}),document.addEventListener("mouseup",()=>{if(!l)return;l=!1,t.style.cursor="grab"}),t.addEventListener("dragstart",e=>{e.preventDefault()}),e.addEventListener("wheel",t=>{e.classList.contains("hidden")||(t.preventDefault(),t.deltaY<0?v():y())},{passive:!1});let j=0,C=1,D=0,k=0;t.addEventListener("touchstart",e=>{if(e.touches.length===1)l=!0,D=e.touches[0].clientX-c,k=e.touches[0].clientY-a;else if(e.touches.length===2){e.preventDefault();const t=e.touches[0],s=e.touches[1];j=Math.hypot(s.clientX-t.clientX,s.clientY-t.clientY),C=n}},{passive:!1}),t.addEventListener("touchmove",e=>{if(e.touches.length===1&&l)c=e.touches[0].clientX-D,a=e.touches[0].clientY-k,s();else if(e.touches.length===2){e.preventDefault();const t=e.touches[0],o=e.touches[1],i=Math.hypot(o.clientX-t.clientX,o.clientY-t.clientY);n=C*(i/j),n=Math.max(.1,Math.min(5,n)),s()}},{passive:!1}),t.addEventListener("touchend",()=>{l=!1,j=0}),t.addEventListener("dblclick",e=>{if(n===1){n=2;const s=t.getBoundingClientRect(),o=(e.clientX-s.left)/s.width,i=(e.clientY-s.top)/s.height;c=(1-n)*s.width*o,a=(1-n)*s.height*i}else m();s()});const i=document.createElement("div");i.className="gesture-indicator fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm hidden",i.innerHTML="双指缩放 • 拖动移动 • 双击放大",document.body.appendChild(i);let M=!1;const B=new MutationObserver(t=>{t.forEach(t=>{if(t.attributeName==="class"){const t=e.classList.contains("hidden");!t&&!M&&(i.classList.remove("hidden"),i.classList.add("fade-in"),setTimeout(()=>{i.classList.add("fade-out"),setTimeout(()=>{i.classList.add("hidden"),i.classList.remove("fade-in","fade-out")},500)},3e3),M=!0)}})});B.observe(e,{attributes:!0});const h=e.querySelector(".bottom-controls-container");let g;const _=()=>{h.classList.remove("control-bar-hidden"),clearTimeout(g),g=setTimeout(()=>{e.classList.contains("hidden")||h.classList.add("control-bar-hidden")},3e3)};e.addEventListener("mousemove",_),e.addEventListener("touchstart",_),h.addEventListener("mouseenter",()=>{clearTimeout(g)}),h.addEventListener("mouseleave",()=>{g=setTimeout(()=>{e.classList.contains("hidden")||h.classList.add("control-bar-hidden")},3e3)});const U=f;f=e=>{U(e),_()}})