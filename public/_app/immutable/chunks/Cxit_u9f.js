import{x as m,y as I,z as L,A as S,B as g,d as c,s as R,c as b,i as u,C as O,D as V,F as C,G as H,I as Y,J as k,K as M,f as P,p as $,h as E,L as j,a as z,k as B}from"./D6P7HmkW.js";import{a as F,r as A,h}from"./pxAOP3Ze.js";import{b as G}from"./C30oX93J.js";const J=["touchstart","touchmove"];function K(t){return J.includes(t)}function X(t,e){var r=e==null?"":typeof e=="object"?e+"":e;r!==(t.__t??(t.__t=t.nodeValue))&&(t.__t=r,t.nodeValue=r==null?"":r+"")}function W(t,e){return N(t,e)}function Z(t,e){m(),e.intro=e.intro??!1;const r=e.target,_=E,l=u;try{for(var a=I(r);a&&(a.nodeType!==8||a.data!==L);)a=S(a);if(!a)throw g;c(!0),R(a),b();const d=N(t,{...e,anchor:a});if(u===null||u.nodeType!==8||u.data!==O)throw V(),g;return c(!1),d}catch(d){if(d===g)return e.recover===!1&&C(),m(),H(r),c(!1),W(t,e);throw d}finally{c(_),R(l)}}const i=new Map;function N(t,{target:e,anchor:r,props:_={},events:l,context:a,intro:d=!0}){m();var v=new Set,y=o=>{for(var s=0;s<o.length;s++){var n=o[s];if(!v.has(n)){v.add(n);var f=K(n);e.addEventListener(n,h,{passive:f});var T=i.get(n);T===void 0?(document.addEventListener(n,h,{passive:f}),i.set(n,1)):i.set(n,T+1)}}};y(Y(F)),A.add(y);var p=void 0,D=k(()=>{var o=r??e.appendChild(M());return P(()=>{if(a){$({});var s=B;s.c=a}l&&(_.$$events=l),E&&G(o,null),p=t(o,_)||{},E&&(j.nodes_end=u),a&&z()}),()=>{var f;for(var s of v){e.removeEventListener(s,h);var n=i.get(s);--n===0?(document.removeEventListener(s,h),i.delete(s)):i.set(s,n)}A.delete(y),o!==r&&((f=o.parentNode)==null||f.removeChild(o))}});return w.set(p,D),p}let w=new WeakMap;function x(t,e){const r=w.get(t);return r?(w.delete(t),r(e)):Promise.resolve()}export{Z as h,W as m,X as s,x as u};
