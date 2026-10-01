(function(){
  const ROOT_ID='travelideas-kkday-coupons';
  const DATA_URL='https://travelideas.github.io/travelideas-data/kkday/campaigns.json';
  const host=document.getElementById(ROOT_ID);
  if(!host) return;

  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const now=new Date();
  const endDate=s=>s?new Date(s+'T23:59:59+08:00'):null;
  const startDate=s=>s?new Date(s+'T00:00:00+08:00'):null;
  const active=x=>!x.end||endDate(x.end)>=now;
  const status=x=>{const s=startDate(x.start),e=endDate(x.end);if(s&&now<s)return'即將開始';if(e&&now>e)return'已結束';return'進行中'};

  if(!document.getElementById('ti-kkday-embed-style')){
    const style=document.createElement('style');
    style.id='ti-kkday-embed-style';
    style.textContent=`
      #${ROOT_ID}.ti-kkday{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans TC",Arial,sans-serif;color:#172033;line-height:1.65;margin:24px 0}
      #${ROOT_ID} *{box-sizing:border-box}
      #${ROOT_ID} .ti-head{padding:22px 20px;background:linear-gradient(135deg,#ffffff 0%,#f2fbfc 100%);border:1px solid #e7ecef;border-radius:18px;margin-bottom:16px}
      #${ROOT_ID} .ti-kicker{font-size:13px;font-weight:800;letter-spacing:.06em;color:#0e7e89;margin-bottom:4px}
      #${ROOT_ID} .ti-title{font-size:28px;line-height:1.3;font-weight:800;margin:0 0 6px}
      #${ROOT_ID} .ti-sub{font-size:14px;color:#5f6b7a;margin:0}
      #${ROOT_ID} .ti-updated{font-size:12px;color:#7b8794;margin-top:8px}
      #${ROOT_ID} .ti-section{font-size:20px;font-weight:800;margin:24px 0 10px}
      #${ROOT_ID} .ti-card{background:#fff;border:1px solid #e8ebef;border-radius:14px;padding:17px 18px;margin:12px 0;box-shadow:0 3px 14px rgba(16,24,40,.035)}
      #${ROOT_ID} .ti-row{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap}
      #${ROOT_ID} .ti-card-title{font-size:18px;font-weight:800;line-height:1.45}
      #${ROOT_ID} .ti-date{font-size:13px;color:#7b8794;margin-top:3px}
      #${ROOT_ID} .ti-badge{font-size:12px;color:#0e7e89;background:#eef9fa;border-radius:999px;padding:5px 9px;white-space:nowrap}
      #${ROOT_ID} .ti-offer{font-size:16px;margin-top:10px;color:#273142}
      #${ROOT_ID} .ti-code{display:flex;align-items:center;gap:8px;margin-top:11px;padding:10px 11px;border:1px dashed #b9c3cc;border-radius:10px;background:#fafbfc}
      #${ROOT_ID} .ti-code-label{font-size:13px;color:#667085}
      #${ROOT_ID} .ti-code b{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:16px;letter-spacing:.04em}
      #${ROOT_ID} .ti-copy{margin-left:auto;border:0;border-radius:8px;background:#eef1f4;padding:7px 10px;cursor:pointer;font-size:13px}
      #${ROOT_ID} .ti-actions{margin-top:13px}
      #${ROOT_ID} .ti-btn{display:inline-block;text-decoration:none;background:#1f2937;color:#fff!important;border-radius:9px;padding:9px 14px;font-size:14px;font-weight:700}
      #${ROOT_ID} .ti-note{margin-top:16px;padding:12px 14px;border-radius:10px;background:#f8fafb;color:#667085;font-size:12px}
      #${ROOT_ID} .ti-loading,#${ROOT_ID} .ti-error{padding:18px;border:1px dashed #cbd5e1;border-radius:12px;color:#667085;background:#fff}
      @media(max-width:640px){#${ROOT_ID} .ti-title{font-size:23px}#${ROOT_ID} .ti-card-title{font-size:17px}#${ROOT_ID} .ti-head{padding:19px 16px}#${ROOT_ID} .ti-card{padding:15px}}
    `;
    document.head.appendChild(style);
  }

  host.className='ti-kkday';
  host.innerHTML='<div class="ti-loading">正在讀取最新 KKday 優惠…</div>';

  fetch(DATA_URL+'?t='+Date.now(),{cache:'no-store'})
    .then(r=>{if(!r.ok) throw new Error('HTTP '+r.status);return r.json();})
    .then(data=>{
      const items=(data.items||[]).filter(active).sort((a,b)=>(b.priority||0)-(a.priority||0));
      const groups={};
      items.forEach(x=>(groups[x.category]||(groups[x.category]=[])).push(x));
      const cards=Object.keys(groups).map(category=>{
        const list=groups[category].map(x=>{
          const code=x.code?`<div class="ti-code"><span class="ti-code-label">折扣碼</span><b>${esc(x.code)}</b><button type="button" class="ti-copy" data-code="${esc(x.code)}">複製</button></div>`:'';
          return `<article class="ti-card"><div class="ti-row"><div><div class="ti-card-title">${esc(x.title)}</div><div class="ti-date">活動期間：${esc(x.start||'—')} ～ ${esc(x.end||'—')}</div></div><span class="ti-badge">${esc(status(x))}</span></div><div class="ti-offer">${esc(x.offer||'')}</div>${code}<div class="ti-actions"><a class="ti-btn" href="${esc(x.affiliate_url||'https://www.kkday.com/zh-tw?cid=5149')}" target="_blank" rel="nofollow sponsored noopener">查看活動</a></div></article>`;
        }).join('');
        return `<section><div class="ti-section">${esc(category)}</div>${list}</section>`;
      }).join('');
      const updated=String(data.updated_at||'—').replace('T',' ').replace('+08:00','');
      host.innerHTML=`<div class="ti-head"><div class="ti-kicker">里程家 Travelideas</div><h2 class="ti-title">KKday 最新優惠與折扣碼</h2><p class="ti-sub">整理目前可用的活動與折扣碼，優惠名額與適用商品可能隨時調整。</p><div class="ti-updated">最後更新：${esc(updated)}</div></div>${cards||'<div class="ti-loading">目前沒有可顯示的優惠。</div>'}<div class="ti-note">提醒：折扣碼、名額、適用商品與付款條件請以 KKday 實際結帳頁面為準；部分連結為合作推廣連結。</div>`;
      host.querySelectorAll('.ti-copy').forEach(btn=>btn.addEventListener('click',async()=>{
        const code=btn.dataset.code;
        try{await navigator.clipboard.writeText(code);const old=btn.textContent;btn.textContent='已複製';setTimeout(()=>btn.textContent=old,1200);}catch(e){window.prompt('複製折扣碼：',code);}
      }));
    })
    .catch(err=>{console.error(err);host.innerHTML='<div class="ti-error">優惠資料暫時讀取失敗，請稍後重新整理。</div>';});
})();
