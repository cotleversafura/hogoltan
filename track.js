/* track.js – অর্ডার ট্র্যাকিং */
async function trackShow(){
  const box=$("tr");if(!box||!S.tn)return;
  try{
    const r=await fetch(SB+"/rest/v1/rpc/track_order",{method:"POST",headers:H,body:JSON.stringify({p_no:S.tn})}).then(x=>x.json());
    if(!Array.isArray(r)||!r.length){box.innerHTML=`<p class="err" style="margin-top:10px">${t("tnf")}</p>`;return}
    const st=r[0].status;
    if(st==="cancelled"){box.innerHTML=`<p class="err" style="margin-top:10px">${t("cancelled")}</p>`;return}
    const i=Math.max(0,SEQ.indexOf(st));
    box.innerHTML=`<div class="steps">${T[L].s.map((s,k)=>`<div class="sx ${k<=i?"on":""}"><i>${k<=i?"✓":""}</i>${s}</div>`).join("")}</div>`;
  }catch(e){}
}
