(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[924],{8186:function(e,t,s){(window.__NEXT_P=window.__NEXT_P||[]).push(["/components/sections/ScrollText",function(){return s(2136)}])},2136:function(e,t,s){"use strict";s.r(t),s.d(t,{default:function(){return sections_ScrollText}});var l=s(5893),n=s(7294);let useMousePosition=()=>{let[e,t]=(0,n.useState)({xPos:0,yPos:0}),updateMousePosition=e=>{t({xPos:e.clientX,yPos:e.clientY})};return(0,n.useEffect)(()=>(window.addEventListener("mousemove",updateMousePosition),()=>{window.removeEventListener("mousemove",updateMousePosition)})),e};var i=s(8238),sections_ScrollText=e=>{let{screen:t,i:s,setCurrentImage:o,currentImage:r}=e,[x,c]=(0,i.XI)(),{xPos:d,yPos:a}=useMousePosition(),[u,m]=(0,n.useState)(!1),g=(0,n.useRef)(null),toggleAnimation=e=>{var t;(null===(t=e[0])||void 0===t?void 0:t.isIntersecting)&&(m(!0),o(s))},f={root:null,rootMargin:"0px",threshold:.5};return(0,n.useEffect)(()=>{let e=new IntersectionObserver(toggleAnimation,f);return g.current&&e.observe(g.current),()=>{g.current&&e.unobserve(g.current)}},[]),(0,l.jsx)("div",{className:"overflow-hidden xl:p-20 lg:p-10 border-0 ".concat(u?"text-visible":"screen-text"),ref:g,children:(0,l.jsxs)("div",{className:"flex font-bold tracking-tighter",children:[(0,l.jsxs)("div",{className:"p-4 text-gray-300 xl:text-9xl font-stencil-scroll lg:text-8xl md:text-6xl sm2:text-5xl sm1:hidden md:hidden",children:[t.id,(0,l.jsx)("span",{className:"lg:text-6xl md:text-5xl sm2:text-4xl sm1:text-3xl sm1:hidden",children:"#"})]}),(0,l.jsxs)("div",{className:"flex flex-col",children:[(0,l.jsx)("div",{className:"flex flex-col",children:(0,l.jsxs)("div",{className:"w-4/5 m-auto font-extrabold xl:p-6 lg:p-4 xl:text-8xl lg:text-7xl md:text-8xl md:pt-2 lg:pt-0 sm2:text-5xl sm1:text-4xl sm1:p-4 sm1:pl-0",children:[(0,l.jsx)("div",{className:"text-gray-400",children:t.heading1}),(0,l.jsx)("div",{className:"text-gray-400",children:t.heading2})]})}),(0,l.jsx)("div",{className:"w-4/5 m-auto font-light tracking-normal text-left text-gray-300 lg:p-8 xl:text-lg lg:text-lg md:text-lg sm1:mt-0 md:mt-8 lg:mt-0 sm1:text-xs",children:t.description})]})]})})}}},function(e){e.O(0,[238,774,888,179],function(){return e(e.s=8186)}),_N_E=e.O()}]);