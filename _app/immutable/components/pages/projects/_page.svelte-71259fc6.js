import{S,i as $,s as z,a as g,k as d,M as A,h as i,c as j,l as m,m as u,n as f,b as x,B as b,R as B,q as P,r as k,D as _}from"../../../chunks/index-f3dc23af.js";import{b as C}from"../../../chunks/paths-b4419565.js";import{p as q}from"../../../chunks/projects-5b6a106c.js";function D(n,s,a){const r=n.slice();return r[0]=s[a],r}function R(n){let s,a,r=n[0].name+"",l,e,c,t=n[0].description+"",o,v;return{c(){s=d("a"),a=d("p"),l=P(r),e=g(),c=d("p"),o=P(t),v=g(),this.h()},l(p){s=m(p,"A",{href:!0,class:!0});var h=u(s);a=m(h,"P",{class:!0});var E=u(a);l=k(E,r),E.forEach(i),e=j(h),c=m(h,"P",{class:!0});var y=u(c);o=k(y,t),y.forEach(i),v=j(h),h.forEach(i),this.h()},h(){f(a,"class","projects--item--title svelte-hcf83r"),f(c,"class","projects--item--text"),f(s,"href",`${C}/projects/${n[0].id}`),f(s,"class","projects--item svelte-hcf83r")},m(p,h){x(p,s,h),_(s,a),_(a,l),_(s,e),_(s,c),_(c,o),_(s,v)},p:b,d(p){p&&i(s)}}}function I(n){let s,a,r=q,l=[];for(let e=0;e<r.length;e+=1)l[e]=R(D(n,r,e));return{c(){s=g(),a=d("div");for(let e=0;e<l.length;e+=1)l[e].c();this.h()},l(e){A("svelte-1h1pie4",document.head).forEach(i),s=j(e),a=m(e,"DIV",{class:!0});var t=u(a);for(let o=0;o<l.length;o+=1)l[o].l(t);t.forEach(i),this.h()},h(){document.title="Projects | RedstoneWizard08",f(a,"class","projects svelte-hcf83r")},m(e,c){x(e,s,c),x(e,a,c);for(let t=0;t<l.length;t+=1)l[t].m(a,null)},p(e,[c]){if(c&0){r=q;let t;for(t=0;t<r.length;t+=1){const o=D(e,r,t);l[t]?l[t].p(o,c):(l[t]=R(o),l[t].c(),l[t].m(a,null))}for(;t<l.length;t+=1)l[t].d(1);l.length=r.length}},i:b,o:b,d(e){e&&i(s),e&&i(a),B(l,e)}}}class w extends S{constructor(s){super(),$(this,s,null,I,z,{})}}export{w as default};