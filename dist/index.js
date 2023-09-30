var P="astro-svg-sprite";import p from"node:fs";function H(t){let e="./src/assets/images/sprite";if(!t||t==="")return e;if(typeof t=="string")return t;if(Array.isArray(t)){let r=t.filter(s=>s&&s!=="");if(r.length>0)return r}return e}function J(t){return!t||t===""?"assets/images":t}var w=class{colors={reset:"\x1B[0m",fg:{red:"\x1B[31m",green:"\x1B[32m",yellow:"\x1B[33m",cyanBold:"\x1B[1m\x1B[36m"}};packageName;constructor(e){this.packageName=e}log(e,r=""){let s=e.join(`
`),n=new Date,a=n.getHours().toString().padStart(2,"0"),i=n.getMinutes().toString().padStart(2,"0"),l=n.getSeconds().toString().padStart(2,"0"),c=`\x1B[2m${a}:${i}:${l}\x1B[22m`;console.log(`${c} %s[${this.packageName}]%s ${s}`,r,r?this.colors.reset:"")}info(...e){this.log(e,this.colors.fg.cyanBold)}success(...e){this.log(e,this.colors.fg.cyanBold)}warn(...e){this.log([`${this.colors.fg.yellow}(!)${this.colors.reset} ${e}`],this.colors.fg.cyanBold)}error(...e){this.log([`${this.colors.fg.red}failed!${this.colors.reset}`,...e],this.colors.fg.cyanBold)}};function A(t){let e=/viewBox="([^"]*)"/,r=/fill="([^"]*)"/,s=t.match(e),n=t.match(r),a=s&&s[0]?s[0]:"",i=n&&n[0]?n[0]:"";return`${a} ${i}`}function T(t){let e="<svg",r="</svg>",s=t.indexOf(e),n=t.indexOf(r);if(s!==-1&&n!==-1){let a=t.indexOf(">",s);return t.slice(a+1,n).trim()}return""}function $(t){return typeof t=="string"?p.readdirSync(t).some(r=>r.endsWith(".svg")):Array.isArray(t)?t.some(e=>p.readdirSync(e).some(s=>s.endsWith(".svg"))):!1}function y(t){return t.includes("<svg")&&t.includes("</svg>")}function v(t){let e=performance.now();t();let r=performance.now();return Math.floor(r-e)}var F=new w(P);var k=[],b=[],S=[];function K(t){p.readdirSync(t).forEach(e=>{if(!e.toLowerCase().endsWith(".svg"))return;let r=p.readFileSync(`${t}/${e}`,"utf-8");y(r)?S.push(`${t}/${e}`):(b.push(`${t}/${e}`),S.push(`${t}/${e}`)),y(r)&&k.push({name:e.replace(/\.svg$/,""),content:r})})}function U(t){typeof t=="string"?K(t):Array.isArray(t)&&t.forEach(e=>K(e))}function N(t){return $(t)&&(typeof t=="string"?U(t):Array.isArray(t)&&t.forEach(e=>U(e))),k}function E(t){let e='<svg xmlns="http://www.w3.org/2000/svg" class="svg-sprite">';return t.forEach(r=>{e+=`
      <symbol class="svg-sprite" id="${r.name}" ${A(r.content)}>
        ${T(r.content)}  
      </symbol>
    `}),e+="</svg>",e}function R(t,e){if(!p.existsSync(t)){let r=t.substr(0,t.lastIndexOf("/"));p.existsSync(r)||p.mkdirSync(r,{recursive:!0}),p.writeFileSync(t,"","utf-8")}p.writeFileSync(t,e,"utf-8")}function V(t){let e=/<circle([^>]*)\/?>/g;return t.replace(e,(s,n)=>{let a=/(\w+)\s*=\s*["']([^"']*)["']/g,i={},l;for(;(l=a.exec(n))!==null;){let[,x,d]=l;i[x]=d}let{cx:c,cy:g,r:o,...u}=i,m=`M${Number(c)-Number(o)},${g}A${o},${o} 0 1,0 ${Number(c)+Number(o)},${g}A${o},${o} 0 1,0 ${Number(c)-Number(o)},${g}`,f=Object.entries(u).map(([x,d])=>`${x}="${d}"`).join(" ");return`<path d="${m}" ${f}></path>`})}function B(t){let e=/<ellipse([^>]*)\/?>/g;return t.replace(e,(s,n)=>{let a=/(\w+)\s*=\s*["']([^"']*)["']/g,i={},l;for(;(l=a.exec(n))!==null;){let[,d,h]=l;i[d]=h}let{cx:c,cy:g,rx:o,ry:u,...m}=i,f=`M${Number(c)-Number(o)},${g}A${o},${u} 0 1,0 ${Number(c)+Number(o)},${g}A${o},${u} 0 1,0 ${Number(c)-Number(o)},${g}`,x=Object.entries(m).map(([d,h])=>`${d}="${h}"`).join(" ");return`<path d="${f}" ${x}></path>`})}function L(t){let e=/<line([^>]*)\/?>/g;return t.replace(e,(s,n)=>{let a=/(\w+)\s*=\s*["']([^"']*)["']/g,i={},l;for(;(l=a.exec(n))!==null;){let[,d,h]=l;i[d]=h}let{x1:c,y1:g,x2:o,y2:u,...m}=i,f=`M ${c},${g} L ${o},${u}`,x=Object.entries(m).map(([d,h])=>`${d}="${h}"`).join(" ");return`<path d="${f}" ${x}></path>`})}function M(t){return t.split(/\s+/).map(e=>Number(e))}function D(t){let e=/<polygon([^>]*)\/?>/g;return t.replace(e,(s,n)=>{let a=/(\w+)\s*=\s*["']([^"']*)["']/g,i={},l;for(;(l=a.exec(n))!==null;){let[,m,f]=l;i[m]=f}let{points:c,...g}=i,o=`M ${M(c).join(" ")} Z`,u=Object.entries(g).map(([m,f])=>`${m}="${f}"`).join(" ");return`<path d="${o}" ${u}></path>`})}function W(t){let e=/<polyline([^>]*)\/?>/g;return t.replace(e,(s,n)=>{let a=/(\w+)\s*=\s*["']([^"']*)["']/g,i={},l;for(;(l=a.exec(n))!==null;){let[,m,f]=l;i[m]=f}let{points:c,...g}=i,o=`M ${M(c).join(" ")}`,u=Object.entries(g).map(([m,f])=>`${m}="${f}"`).join(" ");return`<path d="${o}" ${u}></path>`})}function Q(t){return t=V(t),t=B(t),t=L(t),t=D(t),t=W(t),t}function _(t){let e=["g","defs","metadata","title","desc","marker"];for(let r of e){let s=new RegExp(`<${r}\\b[^>]*>`,"g"),n=new RegExp(`</${r}\\s*>`,"g");t=t.replace(s,""),t=t.replace(n,"")}return t}function G(t){return t.replace(/>\s+</g,"><").replace(/\s+(?==|>)/g,"").replace(/(\r\n|\n|\r|\t)/g,"")}function Z(t){return t=G(t),t=_(t),t.replace(/<(\w+)><\/\1>/g,"").replace(/"/g,"'").replace(/([a-zA-Z-]+)\s*=\s*([a-zA-Z0-9-]+)/g,"$1=$2").replace(/style="([^"]+)"/g,(e,r)=>`style="${r.replace(/(\r\n|\n|\r|\t)/gm,"").replace(/ +/g," ")}"`)}function X(t){return t=Z(t),t=Q(t),t}function I(t,e){switch(e){case"best":t=X(t);break;case"standard":case void 0:t=Z(t);break;case"fast":t=G(t);break;default:break}return t}function O(t){return t.length===1?"file":"files"}function q(){if(b.length>0){console.log(`
\x1B[42m parsed ${S.length} SVG ${O(S)} \x1B[0m`);let t=[`
\x1B[33m(!) Please provide a standard svg ${O(b)}.`,`\x1B[1m${O(b)}:\x1B[22m ${JSON.stringify(b,null,2)}`,`   \x1B[1mNot a valid SVG file.\x1B[22m
`,`\x1B[33m- To remove the warning information, delete or remove the SVG ${O(b)}.`,`- Visit \x1B[4mhttps://developer.mozilla.org/en-US/docs/Web/SVG\x1B[24m know more about SVG.\x1B[0m
`];console.log(`${t.join(`
`)}`)}}function C(t,e){p.stat(t,(r,s)=>{if(r){F.error("Could not read file information:",`${r}`);return}let a=s.size/1024;F.info(`\x1B[2mCompleted in ${j}ms.\x1B[22m`),q(),F.success(`\x1B[32mgenerated\x1B[0m 'sprite.svg' ${a}(kb).`)})}async function z(t,e){let r;return e?r=`${t.replaceAll(`
`,"")}`:r=`

<!--astro-svg-sprite-->
${t.replace(/(?<!\n)\n\n+(?!\n)/g,`
`)}
<!--astro-svg-sprite-->
	`,{name:"vite-plugin-spriter",enforce:"pre",transform(s){try{return s.replace("</body>",`${r}</body>`)}catch(n){throw n}}}}var tt={emitFile:!0},et={include:"./src/assets/images/sprite",mode:"verbose",emitFile:{compress:"standard",path:"assets/images"},...tt},j;function rt(t={}){var g,o;let e,r,s={...et,...t},n=H(t.include),a=J((g=t.emitFile)==null?void 0:g.path),i=N(n),l=I(E(i),(o=s.emitFile)==null?void 0:o.compress);function c(){$(n)&&(t.emitFile||s.emitFile)&&(i.length!==0&&R(e,l),s.mode!=="quiet"&&C(e,a))}return{name:P,hooks:{"astro:config:setup":async({updateConfig:u,config:m})=>{((t==null?void 0:t.emitFile)!==void 0||(t==null?void 0:t.emitFile)===!1)&&u({vite:{plugins:[z(l,m.compressHTML)]}})},"astro:config:done":async({config:u})=>{r=u,e=`${r.publicDir.pathname}${a}/sprite.svg`},"astro:server:start":async()=>{j=v(c)},"astro:build:start":async()=>{j=v(c)}}}}export{rt as default,j as executionTime};
