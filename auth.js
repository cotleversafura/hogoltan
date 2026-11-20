/* auth.js – লগইন, সাইনআপ, পাসওয়ার্ড রিসেট */
const RECOVERY=/type=recovery/.test(location.hash);

const sb=window.supabase?supabase.createClient(SB,KEY):null;

let U=null,PR=null;

const accLbl=()=>U?((PR?.name||"").split(" ")[0]||t("acc")):t("login");

async function loadProfile(){try{const{data}=await sb.from("profiles").select("*").eq("id",U.id).maybeSingle();PR=data||null}catch(e){}}

async function initAuth(){
  if(!sb)return;
  const{data}=await sb.auth.getSession();U=data.session?.user||null;if(U)await loadProfile();render();if(RECOVERY&&U)openNewPw();
  sb.auth.onAuthStateChange((_e,s)=>{U=s?.user||null;S.MO=null;if(!U)PR=null;setTimeout(async()=>{if(U)await loadProfile();render();if(_e==="PASSWORD_RECOVERY")openNewPw()},0)});
}

function openAuth(mode="in"){
  const su=mode==="up";
  $("pn").innerHTML=`<div class="row"><h2>${su?t("signup"):t("login")}</h2><button data-close class="pill" style="background:var(--ln);color:var(--tx)">✕</button></div>
  ${su?`<input id="a_name" placeholder="${t("name")}" maxlength="100"><input id="a_phone" placeholder="${t("phone")}" maxlength="20" inputmode="tel">`:""}
  <input id="a_mail" type="email" placeholder="${t("email")}"><input id="a_pw" type="password" placeholder="${t("pw")}">
  <div class="err" id="aerr"></div>${su?"":`<button class="lk" id="a_forgot" style="align-self:flex-start">${t("forgot")}</button>`}<button class="big" id="a_go" data-mode="${mode}">${su?t("signup"):t("login")}</button>
  <button class="lk" data-am="${su?"in":"up"}">${su?t("have"):t("nohave")}</button>`;
  $("dr").classList.add("on");
}

async function doForgot(){
  const e=$("a_mail").value.trim(),box=$("aerr");box.style.color="";
  if(!/^\S+@\S+\.\S+$/.test(e)){box.textContent=t("resetMail");return}
  try{
    const{error}=await sb.auth.resetPasswordForEmail(e,{redirectTo:location.origin+location.pathname});
    if(error)throw error;
    box.style.color="var(--ok)";box.textContent=t("resetSent");
  }catch(x){box.textContent=x.message||t("fail")}
}

function openNewPw(){
  $("pn").innerHTML=`<div class="row"><h2>${t("setPw")}</h2><button data-close class="pill" style="background:var(--ln);color:var(--tx)">✕</button></div>
  <input id="n_pw" type="password" placeholder="${t("newPw")}" autocomplete="new-password">
  <div class="err" id="nerr"></div><button class="big" id="n_go">${t("setPw")}</button>`;
  $("dr").classList.add("on");
}

async function doNewPw(){
  const pw=$("n_pw").value,box=$("nerr"),b=$("n_go");box.style.color="";
  if(pw.length<6){box.textContent=t("newPw");return}
  b.disabled=true;
  const{error}=await sb.auth.updateUser({password:pw});
  if(error){box.textContent=error.message;b.disabled=false;return}
  try{history.replaceState(null,"",location.pathname+location.search)}catch(x){}
  box.style.color="var(--ok)";box.textContent=t("pwDone");
  setTimeout(()=>$("dr").classList.remove("on"),1200);
}

async function doAuth(mode){
  const e=$("a_mail").value.trim(),pw=$("a_pw").value,box=$("aerr"),b=$("a_go");
  if(!/^\S+@\S+\.\S+$/.test(e)||pw.length<6){box.textContent=t("shortPw");return}
  b.disabled=true;box.style.color="";
  try{
    if(mode==="up"){
      const name=$("a_name").value.trim(),phone=$("a_phone").value.trim();
      if(!name||!/^(\+?88)?01\d{9}$/.test(phone.replace(/[\s-]/g,""))){box.textContent=t("bad2");b.disabled=false;return}
      const{data,error}=await sb.auth.signUp({email:e,password:pw,options:{data:{name,phone}}});
      if(error)throw error;
      if(!data.session){box.style.color="var(--ok)";box.textContent=t("confirmMail");b.disabled=false;return}
      U=data.user;await sb.from("profiles").upsert({id:U.id,name,phone});await loadProfile();
    }else{const{error}=await sb.auth.signInWithPassword({email:e,password:pw});if(error)throw error}
    $("dr").classList.remove("on");S.tab="rest";render();
  }catch(x){const m=x.message||"";box.textContent=/invalid login/i.test(m)?t("wrongPw"):/registered|exists/i.test(m)?t("exists"):/password/i.test(m)?t("shortPw"):m;b.disabled=false}
}
