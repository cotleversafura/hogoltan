/* account.js – অ্যাকাউন্ট পেজ, আগের অর্ডার, রিঅর্ডার */
const ordersHtml=()=>!S.MO.length?`<p class="mu">${t("noorders")}</p>`:S.MO.map(o=>{
  const i=SEQ.indexOf(o.status),lab=o.status==="cancelled"?t("cancelled"):T[L].s[Math.max(0,i)];
  return `<div class="card info" style="margin-bottom:12px"><div class="row"><b>${esc(o.order_no)}</b><span class="tag">${lab}</span></div>
  <div class="mu">${new Date(o.created_at).toLocaleString(L==="bn"?"bn-BD":"en-US")}</div>
  <div style="margin:6px 0">${(o.items||[]).map(x=>esc(x.name_bn||x.name)+" × "+n(x.qty)).join(", ")}</div>
  <div class="row"><b>${tk(o.total)}</b><span><button class="add" data-ro="${o.id}">${t("reorder")}</button> <button class="pill" data-tr="${esc(o.order_no)}" style="background:var(--ln);color:var(--tx)">${t("trackb")}</button></span></div></div>`}).join("");

async function loadMyOrders(){
  const{data}=await sb.from("orders").select("*").eq("user_id",U.id).order("created_at",{ascending:false}).limit(30);
  S.MO=data||[];if(S.tab==="acc"&&$("mo"))$("mo").innerHTML=ordersHtml();
}

function accView(){
  const v=$("view");
  if(!U){v.innerHTML=`<div class="card info trk"><h2> ${t("acc")}</h2><p class="mu">${t("hint")}</p><button class="big" data-am="in" style="margin-top:12px">${t("login")}</button></div>`;return}
  const p=PR||{};
  v.innerHTML=`<div class="card info trk"><h2> ${t("acc")}</h2><div class="mu">${esc(U.email)}</div>
  <div style="display:grid;gap:8px;margin-top:12px"><input id="p_name" class="fi" placeholder="${t("name")}" maxlength="100" value="${esc(p.name)}"><input id="p_phone" class="fi" placeholder="${t("phone")}" maxlength="20" inputmode="tel" value="${esc(p.phone)}"><textarea id="p_addr" class="fi" rows="2" placeholder="${t("addr")}" maxlength="300">${esc(p.address)}</textarea></div>
  <div class="row" style="margin-top:12px"><button class="add" id="saveP">${t("saveP")}</button><button class="pill" id="logout" style="background:var(--ln);color:var(--tx)">${t("logout")}</button></div><div class="mu" id="pmsg" style="margin-top:6px"></div></div>
  <h2 class="t" style="margin-top:18px">${t("myorders")}</h2><div id="mo">${S.MO?ordersHtml():"…"}</div>`;
  if(!S.MO)loadMyOrders();
}

async function saveProfile(){
  const{error}=await sb.from("profiles").upsert({id:U.id,name:$("p_name").value.trim()||null,phone:$("p_phone").value.trim()||null,address:$("p_addr").value.trim()||null});
  $("pmsg").textContent=error?t("fail"):t("saved");if(!error){await loadProfile();$("acc").textContent=accLbl()}
}

function reorder(o){
  const r=o.restaurant_id?S.R.find(x=>x.id===o.restaurant_id):null;
  if(o.restaurant_id&&(!r||!r.is_open))return alert(t("closedR"));
  S.cart={};S.cartRest=o.restaurant_id??null;let miss=0;
  (o.items||[]).forEach(i=>{
    const nmn=i.name_bn||i.name;let key=null;
    if(r){const m=(r.menu_items||[]).find(x=>x.in_stock&&x.name_bn===nmn);if(m)key="m"+m.id}
    else{const p=S.P.find(x=>x.in_stock&&x.name_bn+" ("+(x.unit_bn||"")+")"===nmn);if(p)key="p"+p.id}
    const it=key&&find(key);if(it)S.cart[key]={...it,q:+i.qty||1};else miss++;
  });
  if(!Object.keys(S.cart).length){S.cartRest=null;return alert(t("miss"))}
  save();render();openCart();if(miss)alert(t("miss"));
}
