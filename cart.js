/* cart.js – কার্ট ও অর্ডার দেওয়া */
function find(key){
  if(key[0]==="m"){for(const r of S.R){const m=(r.menu_items||[]).find(x=>"m"+x.id===key);if(m)return{key,name:nm(m),bn:m.name_bn,price:+m.price,rest:r.id}}}
  else{const p=S.P.find(x=>"p"+x.id===key);if(p)return{key,name:nm(p)+" ("+(p.unit_bn||"")+")",bn:p.name_bn+" ("+(p.unit_bn||"")+")",price:+p.price,rest:null}}
}

function addItem(key){
  const it=find(key);if(!it)return;
  if(Object.keys(S.cart).length&&S.cartRest!==it.rest){if(!confirm(t("oneRest")))return;S.cart={}}
  S.cartRest=it.rest;S.cart[key]={...it,q:(S.cart[key]?.q||0)+1};save();render();
}

function chg(key,d){const c=S.cart[key];if(!c)return;c.q+=d;if(c.q<=0)delete S.cart[key];if(!Object.keys(S.cart).length)S.cartRest=null;save();render();if($("dr").classList.contains("on"))openCart()}

const sub=()=>Object.values(S.cart).reduce((a,b)=>a+b.price*b.q,0);

const fee=()=>{if(!Object.keys(S.cart).length)return 0;if(S.cartRest===null)return GROC_FEE;const r=S.R.find(x=>x.id===S.cartRest);return r?+r.delivery_fee:0};

const minOrder=()=>{const r=S.R.find(x=>x.id===S.cartRest);return r?+r.min_order:0};

function openCart(){
  const items=Object.values(S.cart);
  $("pn").innerHTML=`<div class="row"><h2> ${t("cart")}</h2><button data-close class="pill" style="background:var(--ln);color:var(--tx)">✕</button></div>`+
  (items.length?`${items.map(i=>`<div class="row"><span>${esc(i.name)}<div class="mu">${tk(i.price)}</div></span><span class="st"><button data-q="${i.key}" data-d="-1">−</button>${n(i.q)}<button data-q="${i.key}" data-d="1">+</button></span></div>`).join("")}
  <hr style="border:0;border-top:1px solid var(--ln)">
  <div class="row"><span>${t("sub_t")}</span><b>${tk(sub())}</b></div><div class="row"><span>${t("del")}</span><b>${tk(fee())}</b></div><div class="row"><span>${t("tot")}</span><b>${tk(sub()+fee())}</b></div>
  ${U?"":`<div class="mu">${t("hint")} <button class="lk" data-am="in">${t("login")}</button></div>`}<input id="f_name" placeholder="${t("name")}" maxlength="100" value="${esc(PR?.name)}"><input id="f_phone" placeholder="${t("phone")}" maxlength="20" inputmode="tel" value="${esc(PR?.phone)}"><textarea id="f_addr" rows="2" placeholder="${t("addr")}" maxlength="300">${esc(PR?.address)}</textarea><input id="f_memo" placeholder="${t("memo")}" maxlength="200">${U?`<label class="mu"><input type="checkbox" id="f_save" ${PR?.address?"":"checked"} style="width:auto"> ${t("saveaddr")}</label>`:""}
  <div class="err" id="err"></div><button class="big" id="place">${t("place")} · ${tk(sub()+fee())}</button>`:`<p class="mu">${t("empty")}</p>`);
  $("dr").classList.add("on");
}

async function placeOrder(){
  const name=$("f_name").value.trim(),phone=$("f_phone").value.trim(),addr=$("f_addr").value.trim(),memo=$("f_memo").value.trim(),e=$("err");
  if(!name||!addr||!/^(\+?88)?01\d{9}$/.test(phone.replace(/[\s-]/g,""))){e.textContent=t("bad");return}
  if(S.cartRest!==null&&sub()<minOrder()){e.textContent=t("minerr")+tk(minOrder());return}
  const b=$("place");b.disabled=true;b.textContent=t("placing");
  let no;
  const args={p_name:name,p_phone:phone,p_address:addr,p_memo:memo||null,p_restaurant_id:S.cartRest,p_items:Object.values(S.cart).map(i=>({key:i.key,qty:i.q}))};
  try{
    if(sb){const{data,error}=await sb.rpc("place_order",args);if(error||!data)throw 0;no=data}
    else{const r=await fetch(SB+"/rest/v1/rpc/place_order",{method:"POST",headers:H,body:JSON.stringify(args)});if(!r.ok)throw 0;no=await r.json();if(!no)throw 0}
    try{if(U&&sb&&($("f_save")?.checked||!PR?.address)){await sb.from("profiles").upsert({id:U.id,name,phone,address:addr});await loadProfile()}}catch(x){}
    S.MO=null;
    S.cart={};S.cartRest=null;save();S.tn=no;try{localStorage.setItem("lastOrder",no)}catch(x){}render();
    $("pn").innerHTML=`<div class="ok"><svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2e9d4f" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M7 12.5l3.2 3.2L17 9"/></svg><h2>${t("done")}</h2><p>${t("ono")}: <b>${no}</b></p><p class="mu">${t("cod")}</p><div id="tr"></div><button class="big" data-close style="margin-top:14px">OK</button></div>`;
    trackShow();
  }catch(x){b.disabled=false;b.textContent=t("place");e.textContent=t("fail")}
}
