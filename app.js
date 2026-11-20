/* app.js – মূল অংশ: সেটিংস, state, render, ক্লিক হ্যান্ডলার */
const SB="https://zphbqwkvsacptggytbmr.supabase.co",KEY="sb_publishable_i6_Cye57ryc5jSzHdmem-A_7WDig9Zd";

const H={apikey:KEY,Authorization:"Bearer "+KEY,"Content-Type":"application/json"};

function contactHtml(){
  let d=String(CONTACT_PHONE||"").replace(/\D/g,"");
  if(/^01\d{9}$/.test(d))d="88"+d;
  if(!/^8801\d{9}$/.test(d))return"";
  return`<a class="wa" href="https://wa.me/${d}" target="_blank" rel="noopener" aria-label="${t("waUs")}" title="${t("waUs")}">💬</a><a class="tl" href="tel:+${d}" aria-label="${t("callUs")}" title="${t("callUs")}">📞</a>`;
}

// যোগাযোগের নম্বর বসান (যেমন "01712345678"); খালি থাকলে ফোন/WhatsApp বাটন দেখানো হবে না

const CONTACT_PHONE="";

const GROC_FEE=40,SEQ=["new","confirmed","preparing","on_the_way","delivered"];

let S={tab:"rest",cat:"all",rid:null,q:"",R:[],P:[],cart:{},cartRest:null,loading:true,tn:""};

try{const c=JSON.parse(localStorage.getItem("cart")||"null");if(c){S.cart=c.cart||{};S.cartRest=c.cartRest??null}}catch(e){}

/* কোন পেজ খোলা: home | grocery | restaurant | track | account (প্রতিটি HTML ফাইলে window.PAGE সেট করা) */

const PAGE=window.PAGE||"home",QS=new URLSearchParams(location.search);

const PAGES={rest:"index.html",groc:"grocery.html",trk:"track.html"};

S.tab={home:"rest",restaurant:"rest",grocery:"groc",track:"trk",account:"acc"}[PAGE]||"rest";

if(PAGE==="restaurant")S.rid=+QS.get("id")||null;

if(PAGE==="track"){let ln="";try{ln=localStorage.getItem("lastOrder")||""}catch(e){}S.tn=(QS.get("no")||ln).toUpperCase()}

const $=id=>document.getElementById(id);

const n=x=>Number(x).toLocaleString(L==="bn"?"bn-BD":"en-US"),tk=x=>"৳"+n(x);

const nm=(o,k="name")=>L==="en"&&o[k+"_en"]?o[k+"_en"]:o[k+"_bn"];

const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

const save=()=>{try{localStorage.setItem("cart",JSON.stringify({cart:S.cart,cartRest:S.cartRest}))}catch(e){}};

const ART={"টমেটো": "<circle cx=\"50\" cy=\"57\" r=\"32\" fill=\"#e53935\"/><path d=\"M50 22l-11 9 8-1 3 7 3-7 8 1z\" fill=\"#43a047\"/><circle cx=\"38\" cy=\"47\" r=\"6\" fill=\"#fff\" opacity=\".3\"/>", "আলু": "<ellipse cx=\"50\" cy=\"58\" rx=\"37\" ry=\"27\" fill=\"#c9a06b\"/><circle cx=\"36\" cy=\"52\" r=\"2.5\" fill=\"#9a7447\"/><circle cx=\"58\" cy=\"64\" r=\"2.5\" fill=\"#9a7447\"/><circle cx=\"66\" cy=\"50\" r=\"2\" fill=\"#9a7447\"/><circle cx=\"44\" cy=\"68\" r=\"2\" fill=\"#9a7447\"/>", "পেঁয়াজ": "<path d=\"M50 14q-7 15 0 24q7-9 0-24z\" fill=\"#c98a2b\"/><ellipse cx=\"50\" cy=\"60\" rx=\"31\" ry=\"28\" fill=\"#e0a83f\"/><path d=\"M50 36q-14 24 0 52M50 36q14 24 0 52\" stroke=\"#c98a2b\" stroke-width=\"2\" fill=\"none\"/>", "পালং শাক": "<path d=\"M50 88C20 64 24 28 50 14c26 14 30 50 0 74z\" fill=\"#2e8b3d\"/><path d=\"M50 86V26M50 56l-14-14M50 66l14-14\" stroke=\"#a5d6a7\" stroke-width=\"2.5\" fill=\"none\"/>", "কলা": "<path d=\"M24 28Q26 86 82 76Q88 70 80 66Q46 70 38 26z\" fill=\"#fbd935\" stroke=\"#c9a400\" stroke-width=\"2\"/><path d=\"M24 28l6-6 10 4z\" fill=\"#8d6e3f\"/>", "আপেল": "<path d=\"M50 30C30 22 16 40 22 62c6 20 22 24 28 20 6 4 22 0 28-20 6-22-8-40-28-32z\" fill=\"#d32f2f\"/><path d=\"M50 30q0-10 6-16\" stroke=\"#6d4c41\" stroke-width=\"4\" fill=\"none\"/><path d=\"M54 22q12-8 20 0q-10 8-20 0z\" fill=\"#43a047\"/><circle cx=\"36\" cy=\"46\" r=\"5\" fill=\"#fff\" opacity=\".3\"/>", "আম": "<ellipse cx=\"50\" cy=\"58\" rx=\"27\" ry=\"34\" transform=\"rotate(-25 50 58)\" fill=\"#ffa726\"/><ellipse cx=\"62\" cy=\"70\" rx=\"14\" ry=\"20\" transform=\"rotate(-25 62 70)\" fill=\"#ef5350\" opacity=\".45\"/><path d=\"M52 24q12-10 22-4q-8 10-22 4z\" fill=\"#43a047\"/>", "লেবু": "<ellipse cx=\"50\" cy=\"56\" rx=\"36\" ry=\"25\" fill=\"#fdd835\"/><circle cx=\"14\" cy=\"56\" r=\"4\" fill=\"#fdd835\"/><circle cx=\"86\" cy=\"56\" r=\"4\" fill=\"#fdd835\"/><ellipse cx=\"40\" cy=\"48\" rx=\"9\" ry=\"5\" fill=\"#fff\" opacity=\".35\"/>", "মিনিকেট চাল": "<ellipse cx=\"50\" cy=\"50\" rx=\"32\" ry=\"16\" fill=\"#fff\"/><path d=\"M16 52h68a34 34 0 0 1-68 0z\" fill=\"#d84315\"/><path d=\"M34 40l4 3M50 36l3 4M62 42l4 2M44 46l4 2\" stroke=\"#cfd8dc\" stroke-width=\"2\"/>", "মসুর ডাল": "<ellipse cx=\"50\" cy=\"50\" rx=\"32\" ry=\"15\" fill=\"#ef6c00\"/><path d=\"M16 52h68a34 34 0 0 1-68 0z\" fill=\"#6d4c41\"/><circle cx=\"38\" cy=\"48\" r=\"3\" fill=\"#ffb74d\"/><circle cx=\"52\" cy=\"44\" r=\"3\" fill=\"#ffb74d\"/><circle cx=\"62\" cy=\"50\" r=\"3\" fill=\"#ffb74d\"/><circle cx=\"46\" cy=\"54\" r=\"3\" fill=\"#ffb74d\"/>", "সয়াবিন তেল": "<rect x=\"40\" y=\"10\" width=\"20\" height=\"10\" rx=\"2\" fill=\"#c62828\"/><path d=\"M42 20h16l12 14v50a6 6 0 0 1-6 6H36a6 6 0 0 1-6-6V34z\" fill=\"#fbc02d\"/><rect x=\"34\" y=\"46\" width=\"32\" height=\"26\" rx=\"3\" fill=\"#fff\"/><path d=\"M40 56h20M40 64h14\" stroke=\"#c62828\" stroke-width=\"3\"/>", "লবণ": "<rect x=\"32\" y=\"14\" width=\"36\" height=\"16\" rx=\"5\" fill=\"#90a4ae\"/><path d=\"M32 30h36l4 52a6 6 0 0 1-6 6H34a6 6 0 0 1-6-6z\" fill=\"#fff\" stroke=\"#b0bec5\" stroke-width=\"3\"/><circle cx=\"42\" cy=\"21\" r=\"1.6\" fill=\"#546e7a\"/><circle cx=\"50\" cy=\"21\" r=\"1.6\" fill=\"#546e7a\"/><circle cx=\"58\" cy=\"21\" r=\"1.6\" fill=\"#546e7a\"/>", "ডিম": "<ellipse cx=\"38\" cy=\"58\" rx=\"22\" ry=\"29\" fill=\"#fff8e1\" stroke=\"#e0c9a6\" stroke-width=\"2\"/><ellipse cx=\"64\" cy=\"62\" rx=\"20\" ry=\"26\" fill=\"#d7a86e\"/><ellipse cx=\"58\" cy=\"52\" rx=\"4\" ry=\"7\" fill=\"#fff\" opacity=\".35\"/>", "তরল দুধ": "<path d=\"M28 18h44l-5 66a6 6 0 0 1-6 5H39a6 6 0 0 1-6-5z\" fill=\"#e3f2fd\" stroke=\"#90caf9\" stroke-width=\"3\"/><path d=\"M31 40h38l-3 44a5 5 0 0 1-5 4H39a5 5 0 0 1-5-4z\" fill=\"#fff\"/>", "মাখন": "<path d=\"M14 46l14-14h58l-14 14z\" fill=\"#fff59d\"/><rect x=\"14\" y=\"46\" width=\"58\" height=\"30\" rx=\"3\" fill=\"#fdd835\"/><path d=\"M72 46l14-14v30l-14 14z\" fill=\"#f9a825\"/>", "পাউরুটি": "<path d=\"M20 48a30 22 0 0 1 60 0v32a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4z\" fill=\"#e0a458\"/><path d=\"M26 50a24 16 0 0 1 48 0v28H26z\" fill=\"#f6dcae\"/>", "বেগুন": "<path d=\"M62 18q18 4 12 28Q66 80 34 84Q14 82 22 64Q40 46 56 30z\" fill=\"#6a1b9a\"/><path d=\"M58 16q8-4 14 2l-8 8z\" fill=\"#43a047\"/><ellipse cx=\"38\" cy=\"70\" rx=\"5\" ry=\"3\" fill=\"#fff\" opacity=\".25\" transform=\"rotate(-30 38 70)\"/>", "শসা": "<g transform=\"rotate(-18 50 51)\"><rect x=\"12\" y=\"38\" width=\"76\" height=\"26\" rx=\"13\" fill=\"#43a047\"/><path d=\"M24 58l6-2M40 50l5-2M58 44l5-2M72 38l5-2\" stroke=\"#a5d6a7\" stroke-width=\"2.5\"/></g>", "গাজর": "<path d=\"M36 26Q50 18 64 26L52 90Q50 92 48 90z\" fill=\"#fb8c00\"/><path d=\"M46 20l-6-12M52 20l2-14M58 22l8-10\" stroke=\"#43a047\" stroke-width=\"5\" stroke-linecap=\"round\"/><path d=\"M42 40h10M44 54h8M47 68h5\" stroke=\"#e65100\" stroke-width=\"2\"/>", "কমলা": "<circle cx=\"50\" cy=\"56\" r=\"33\" fill=\"#fb8c00\"/><path d=\"M50 24q10-8 18-2q-8 8-18 2z\" fill=\"#43a047\"/><circle cx=\"38\" cy=\"46\" r=\"6\" fill=\"#fff\" opacity=\".28\"/>", "পেয়ারা": "<ellipse cx=\"50\" cy=\"56\" rx=\"31\" ry=\"30\" fill=\"#aed581\"/><ellipse cx=\"50\" cy=\"56\" rx=\"22\" ry=\"21\" fill=\"#f8bbd0\" opacity=\".55\"/><path d=\"M50 26q8-8 16-4q-6 8-16 4z\" fill=\"#558b2f\"/>", "মিষ্টি দই": "<path d=\"M24 36h52l-6 46a6 6 0 0 1-6 5H36a6 6 0 0 1-6-5z\" fill=\"#fff\" stroke=\"#ce93d8\" stroke-width=\"3\"/><rect x=\"20\" y=\"28\" width=\"60\" height=\"10\" rx=\"4\" fill=\"#ab47bc\"/><path d=\"M36 56h28\" stroke=\"#ce93d8\" stroke-width=\"4\"/>"};

const fb=name=>{const a=ART[name]||`<rect x="10" y="10" width="80" height="80" rx="18" fill="#f3b3cf"/><text x="50" y="66" text-anchor="middle" font-size="46" font-weight="700" fill="#d70f64" font-family="inherit">${esc(Array.from(name||"?")[0])}</text>`;return `<svg viewBox="0 0 100 100" aria-hidden="true">${a}</svg>`};

const img=(u,name)=>fb(name)+(u?`<img class="ov" loading="lazy" src="${esc(u)}" alt="" onerror="this.remove()">`:"");

async function load(){
  try{
    const[r,p]=await Promise.all([
      fetch(SB+"/rest/v1/restaurants?select=*,menu_items(*)&order=id",{headers:H}).then(x=>x.json()),
      fetch(SB+"/rest/v1/products?select=*&order=id",{headers:H}).then(x=>x.json())]);
    S.R=Array.isArray(r)?r:[];
    const seen={};(Array.isArray(p)?p:[]).forEach(x=>{const k=x.name_bn+"|"+x.unit_bn;if(!seen[k])seen[k]=x});
    S.P=Object.values(seen);
  }catch(e){}
  S.loading=false;render();
}

/* quantity control */

const ctl=(key,dis)=>{const c=S.cart[key];return c?`<span class="st"><button data-q="${key}" data-d="-1">−</button>${n(c.q)}<button data-q="${key}" data-d="1">+</button></span>`:`<button class="add" data-add="${key}" ${dis?"disabled":""}>${t("add")}</button>`};

function render(){
  document.documentElement.lang=L;
  $("lang").textContent=L==="bn"?"English":"বাংলা";$("acc").textContent=accLbl();
  $("h1").textContent=t("h1");$("sub").textContent=t("sub");$("q").placeholder=t("ph");$("foot").textContent=t("foot");$("ct").innerHTML=contactHtml();
  $("chips").innerHTML=["c1","c2","c3"].map(k=>`<span>${t(k)}</span>`).join("");
  $("tabs").innerHTML=["rest","groc","trk"].map(k=>`<a class="tab ${S.tab===k&&!S.rid?"on":""}" href="${PAGES[k]}">${t(k)}</a>`).join("");
  const cnt=Object.values(S.cart).reduce((a,b)=>a+b.q,0);
  $("cartbtn").textContent=t("cart")+" ("+n(cnt)+")";
  const f=$("fab");f.classList.toggle("on",cnt>0);
  if(cnt)f.innerHTML=`<span> ${t("view")} · ${n(cnt)}</span><span>${tk(sub())}</span>`;
  const v=$("view"),q=S.q.toLowerCase();
  if(PAGE==="restaurant"&&!S.rid){location.replace("index.html");return}
  if(S.loading){v.innerHTML=`<div class="grid">${"<div class='sk'></div>".repeat(6)}</div>`;return}
  if(S.tab==="acc"&&!S.rid){accView();return}
  if(S.tab==="trk"&&!S.rid){v.innerHTML=`<div class="card info trk"><h2>${t("track")}</h2><div class="row" style="margin-top:12px;gap:8px"><input id="tn" placeholder="${t("tno")}" value="${esc(S.tn)}"><button class="add" id="tgo">${t("tgo")}</button></div><div id="tr"></div></div>`;
    if(S.tn)trackShow();return}
  if(S.rid){
    const r=S.R.find(x=>x.id===S.rid);if(!r){location.replace("index.html");return}
    document.title=nm(r,"name")+" | "+(L==="bn"?"হগলতান":"Hogoltan");
    v.innerHTML=`<button class="back" data-back>${t("back")}</button>
    <div class="card rh"><div class="cv">${img(r.image_url,r.name_bn)}<span class="bd ${r.is_open?"":"x"}">${r.is_open?t("open"):t("closed")}</span></div>
    <div class="info"><h2>${esc(nm(r,"name"))}</h2><div class="mu">${esc(r.cuisine||"")} · ${esc(r.area||"")}</div><div class="mu"> ${n(r.prep_time_min||0)} ${t("mn")} · ${t("fee")} ${tk(r.delivery_fee)} · ${t("min")} ${tk(r.min_order)}</div></div></div>
    <h2 class="t" style="margin-top:18px">${t("pop")}</h2>
    <div class="card">${(r.menu_items||[]).filter(m=>m.in_stock&&(!q||m.name_bn.toLowerCase().includes(q))).sort((a,b)=>a.id-b.id).map(m=>`<div class="item"><div class="i"><b>${esc(nm(m))}</b><div class="mu">${esc(m.description_bn||"")}</div><div class="pr">${tk(m.price)}</div></div><div class="th">${img(m.image_url,m.name_bn)}</div>${ctl("m"+m.id,!r.is_open)}</div>`).join("")||`<p class="info mu">${t("none")}</p>`}</div>`;
    return}
  if(S.tab==="rest"){
    const list=S.R.filter(r=>!q||(r.name_bn+" "+(r.cuisine||"")+" "+(r.area||"")+" "+(r.menu_items||[]).map(m=>m.name_bn).join(" ")).toLowerCase().includes(q));
    v.innerHTML=list.length?`<div class="grid">${list.map(r=>`<div class="card rc ${r.is_open?"":"closed"}" data-r="${r.id}"><div class="cv">${img(r.image_url,r.name_bn)}<span class="bd ${r.is_open?"":"x"}">${r.is_open?t("open"):t("closed")}</span><span class="fee">${t("fee")} ${tk(r.delivery_fee)}</span></div><div class="rb"><h3>${esc(nm(r,"name"))}</h3><div class="mu">${esc(r.cuisine||"")} · ${esc(r.area||"")}</div><div class="mu"> ${n(r.prep_time_min||0)} ${t("mn")} · ${t("min")} ${tk(r.min_order)}</div></div></div>`).join("")}</div>`:`<p class="mu">${t("none")}</p>`;
  }else{
    const cats=["all","veg","fruit","stap","dairy"];
    const list=S.P.filter(p=>p.in_stock&&(S.cat==="all"||p.category===S.cat)&&(!q||(p.name_bn+" "+(p.name_en||"")).toLowerCase().includes(q)));
    v.innerHTML=`<div class="tabs">${cats.map(c=>`<button class="tab ${S.cat===c?"on":""}" data-c="${c}">${t(c)}</button>`).join("")}</div>
    <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(170px,1fr))">${list.map(p=>`<div class="card gc"><div class="th">${img(p.image_url,p.name_bn)}</div><b>${esc(nm(p))}</b><div class="mu">${esc(p.unit_bn||"")}</div><div class="row" style="margin-top:8px"><b>${tk(p.price)}</b>${ctl("p"+p.id)}</div></div>`).join("")}</div>${list.length?"":`<p class="mu">${t("none")}</p>`}`;
  }
}

/* ---------- অ্যাকাউন্ট ---------- */

document.addEventListener("click",e=>{
  const g=s=>e.target.closest(s);let el;
  if(el=g("[data-c]")){S.cat=el.dataset.c;render()}
  else if(el=g("[data-r]")){location.href="restaurant.html?id="+el.dataset.r}
  else if(g("[data-back]")){location.href="index.html"}
  else if(el=g("[data-add]")){addItem(el.dataset.add)}
  else if(el=g("[data-q]")){chg(el.dataset.q,+el.dataset.d)}
  else if(g("#cartbtn")||g("#fab")){openCart()}
  else if(g("[data-close]")||e.target.id==="dr"){$("dr").classList.remove("on")}
  else if(g("#place")){placeOrder()}
  else if(g("#tgo")){S.tn=$("tn").value.trim().toUpperCase();trackShow()}
  else if(el=g("[data-am]")){openAuth(el.dataset.am)}
  else if(el=g("#a_go")){doAuth(el.dataset.mode)}
  else if(g("#a_forgot")){doForgot()}
  else if(g("#n_go")){doNewPw()}
  else if(g("#acc")){if(U){if(PAGE==="account")scrollTo(0,0);else location.href="account.html"}else openAuth("in")}
  else if(el=g("[data-ro]")){const o=(S.MO||[]).find(x=>String(x.id)===el.dataset.ro);if(o)reorder(o)}
  else if(el=g("[data-tr]")){location.href="track.html?no="+encodeURIComponent(el.dataset.tr)}
  else if(g("#saveP")){saveProfile()}
  else if(g("#logout")){sb.auth.signOut().then(()=>{location.href="index.html"})}
  else if(g("#logo")){location.href="index.html"}
  else if(g("#lang")){L=L==="bn"?"en":"bn";try{localStorage.setItem("lang",L)}catch(x){}render()}
});

$("q").addEventListener("input",e=>{S.q=e.target.value;render()});
