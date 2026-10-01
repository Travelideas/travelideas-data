(function(){
  const ROOT_ID='travelideas-kkday-coupons';
  const BASE='https://travelideas.github.io/travelideas-data/kkday/';
  const host=document.getElementById(ROOT_ID);
  if(!host) return;

  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const now=new Date();
  const endDate=s=>s?new Date(s+'T23:59:59+08:00'):null;
  const startDate=s=>s?new Date(s+'T00:00:00+08:00'):null;
  const active=x=>!x.end||endDate(x.end)>=now;
  const status=x=>{const s=startDate(x.start),e=endDate(x.end);if(s&&now<s)return'即將開始';if(e&&now>e)return'已結束';return'進行中'};
  const slug=s=>'ti-'+String(s).replace(/[^a-zA-Z0-9\u4e00-\u9fff]+/g,'-');
  const icon=cat=>({
    '本月主打':'🔥','10 月折扣碼':'🎟️','每週優惠':'📅','主題活動':'✨','熱門主題':'🍁','指定商品':'🎯','信用卡／支付優惠':'💳'
  }[cat]||'✈️');

  if(!document.getElementById('ti-kkday-embed-style')){
    const style=document.createElement('style');
    style.id='ti-kkday-embed-style';
    style.textContent=`
      #${ROOT_ID}.ti-kkday{--ti-orange:#f28c00;--ti-dark:#182230;--ti-teal:#0d8c95;--ti-line:#e8ebef;--ti-soft:#f7f9fb;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans TC",Arial,sans-serif;color:#172033;line-height:1.62;margin:22px 0}
      #${ROOT_ID} *{box-sizing:border-box}
      #${ROOT_ID} .ti-head{position:relative;overflow:hidden;padding:26px 24px 23px;background:linear-gradient(135deg,#fff8ee 0%,#ffffff 48%,#eefafb 100%);border:1px solid #e6e9ed;border-radius:20px;margin-bottom:14px;box-shadow:0 7px 24px rgba(16,24,40,.055)}
      #${ROOT_ID} .ti-head:after{content:"";position:absolute;width:170px;height:170px;border-radius:50%;right:-65px;top:-75px;background:rgba(242,140,0,.09);pointer-events:none}
      #${ROOT_ID} .ti-kicker{font-size:12px;font-weight:800;letter-spacing:.08em;color:var(--ti-orange);margin-bottom:4px}
      #${ROOT_ID} .ti-title{font-size:29px!important;line-height:1.3!important;font-weight:850!important;margin:0 0 7px!important;color:var(--ti-dark)!important;border:0!important;padding:0!important}
      #${ROOT_ID} .ti-sub{font-size:14px;color:#596579;margin:0;max-width:720px}
      #${ROOT_ID} .ti-meta{display:flex;gap:7px;flex-wrap:wrap;margin-top:13px}
      #${ROOT_ID} .ti-meta span{font-size:12px;background:#fff;border:1px solid #e4e8ec;border-radius:999px;padding:5px 9px;color:#596579}
      #${ROOT_ID} .ti-nav{display:flex;gap:7px;flex-wrap:wrap;padding:4px 0 9px;margin-bottom:4px}
      #${ROOT_ID} .ti-nav a{display:inline-block;text-decoration:none!important;color:#394658!important;background:#fff;border:1px solid #dfe4e8;border-radius:999px;padding:7px 11px;font-size:12px;font-weight:700;transition:.18s ease}
      #${ROOT_ID} .ti-nav a:hover{border-color:var(--ti-orange);color:#b76700!important;background:#fffaf4}
      #${ROOT_ID} .ti-section-wrap{scroll-margin-top:16px}
      #${ROOT_ID} .ti-section{display:flex;align-items:center;gap:8px;font-size:20px!important;font-weight:850!important;line-height:1.35!important;color:var(--ti-dark)!important;margin:25px 0 11px!important;padding:0!important;border:0!important}
      #${ROOT_ID} .ti-section-count{font-size:11px;font-weight:700;color:#7b8794;background:#f2f4f7;border-radius:999px;padding:3px 7px}
      #${ROOT_ID} .ti-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(255px,1fr));gap:12px}
      #${ROOT_ID} .ti-card{display:flex;flex-direction:column;min-width:0;background:#fff;border:1px solid var(--ti-line);border-radius:15px;padding:16px;margin:0;box-shadow:0 3px 12px rgba(16,24,40,.035);transition:transform .15s ease,box-shadow .15s ease,border-color .15s ease}
      #${ROOT_ID} .ti-card:hover{transform:translateY(-1px);border-color:#d9dee4;box-shadow:0 6px 18px rgba(16,24,40,.065)}
      #${ROOT_ID} .ti-card.ti-featured{border-top:3px solid var(--ti-orange)}
      #${ROOT_ID} .ti-row{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}
      #${ROOT_ID} .ti-card-title{font-size:17px;font-weight:850;line-height:1.43;color:#192536;min-width:0}
      #${ROOT_ID} .ti-date{font-size:12px;color:#818b98;margin-top:4px}
      #${ROOT_ID} .ti-badge{flex:0 0 auto;font-size:11px;font-weight:750;color:#08757c;background:#eaf8f8;border-radius:999px;padding:4px 8px;white-space:nowrap}
      #${ROOT_ID} .ti-badge.upcoming{color:#9a5b00;background:#fff3df}
      #${ROOT_ID} .ti-offer{font-size:15px;margin-top:10px;color:#344054;line-height:1.55}
      #${ROOT_ID} .ti-code{display:flex;align-items:center;gap:7px;margin-top:12px;padding:9px 9px 9px 11px;border:1px dashed #d0d6dc;border-radius:10px;background:#fafbfc;min-width:0}
      #${ROOT_ID} .ti-code-label{font-size:11px;color:#7a8592;white-space:nowrap}
      #${ROOT_ID} .ti-code b{min-width:0;overflow:hidden;text-overflow:ellipsis;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:15px;letter-spacing:.025em;color:#1c2938}
      #${ROOT_ID} .ti-copy{margin-left:auto;flex:0 0 auto;border:0;border-radius:7px;background:#eef1f4;color:#344054;padding:6px 8px;cursor:pointer;font-size:12px;font-weight:700}
      #${ROOT_ID} .ti-actions{margin-top:auto;padding-top:12px}
      #${ROOT_ID} .ti-btn{display:inline-block;text-decoration:none!important;background:var(--ti-dark);color:#fff!important;border-radius:8px;padding:8px 12px;font-size:13px;font-weight:750;line-height:1.4}
      #${ROOT_ID} .ti-card.ti-featured .ti-btn{background:var(--ti-orange)}
      #${ROOT_ID} .ti-bank{border-left:3px solid #c8d7dd}
      #${ROOT_ID} .ti-note{margin-top:18px;padding:12px 14px;border-radius:10px;background:#f7f9fb;border:1px solid #edf0f2;color:#697586;font-size:11px;line-height:1.6}
      #${ROOT_ID} .ti-loading,#${ROOT_ID} .ti-error{padding:18px;border:1px dashed #cbd5e1;border-radius:12px;color:#667085;background:#fff}
      @media(max-width:700px){#${ROOT_ID} .ti-head{padding:21px 17px 19px}#${ROOT_ID} .ti-title{font-size:23px!important}#${ROOT_ID} .ti-grid{grid-template-columns:1fr}#${ROOT_ID} .ti-card{padding:15px}#${ROOT_ID} .ti-section{font-size:18px!important}}
    `;
    document.head.appendChild(style);
  }

  host.className='ti-kkday';
  host.innerHTML='<div class="ti-loading">正在讀取最新 KKday 優惠…</div>';

  Promise.all([
    fetch(BASE+'campaigns.json?t='+Date.now(),{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('campaigns HTTP '+r.status);return r.json();}),
    fetch(BASE+'credit-cards.json?t='+Date.now(),{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('cards HTTP '+r.status);return r.json();})
  ]).then(([campaignData,cardData])=>{
    const campaigns=(campaignData.items||[]).filter(active).sort((a,b)=>(b.priority||0)-(a.priority||0));
    const cards=(cardData.items||[]).filter(active).map((x,i)=>({
      category:'信用卡／支付優惠',title:x.scope,offer:x.benefit,code:x.code,start:x.start,end:x.end,affiliate_url:x.url,priority:40-i,_bank:true
    }));
    const items=[...campaigns,...cards];
    const groups={};
    items.forEach(x=>(groups[x.category]||(groups[x.category]=[])).push(x));
    const preferred=['本月主打','10 月折扣碼','每週優惠','信用卡／支付優惠','主題活動','熱門主題','指定商品'];
    const categories=[...preferred.filter(x=>groups[x]),...Object.keys(groups).filter(x=>!preferred.includes(x))];

    const nav=categories.map(c=>`<a href="#${slug(c)}">${icon(c)} ${esc(c)}</a>`).join('');
    const sections=categories.map(category=>{
      const list=groups[category];
      const html=list.map((x,i)=>{
        const st=status(x);
        const code=x.code?`<div class="ti-code"><span class="ti-code-label">折扣碼</span><b>${esc(x.code)}</b><button type="button" class="ti-copy" data-code="${esc(x.code)}">複製</button></div>`:'';
        const featured=(category==='本月主打'||(category==='10 月折扣碼'&&i<2))?' ti-featured':'';
        const bank=x._bank?' ti-bank':'';
        const badgeClass=st==='即將開始'?' upcoming':'';
        return `<article class="ti-card${featured}${bank}"><div class="ti-row"><div><div class="ti-card-title">${esc(x.title)}</div><div class="ti-date">${esc(x.start||'現在')} ～ ${esc(x.end||'依活動頁')}</div></div><span class="ti-badge${badgeClass}">${esc(st)}</span></div><div class="ti-offer">${esc(x.offer||'')}</div>${code}<div class="ti-actions"><a class="ti-btn" href="${esc(x.affiliate_url||'https://www.kkday.com/zh-tw?cid=5149')}" target="_blank" rel="nofollow sponsored noopener">查看優惠</a></div></article>`;
      }).join('');
      return `<section class="ti-section-wrap" id="${slug(category)}"><h3 class="ti-section"><span>${icon(category)}</span>${esc(category)}<span class="ti-section-count">${list.length}</span></h3><div class="ti-grid">${html}</div></section>`;
    }).join('');

    const updated=String(campaignData.updated_at||'—').replace('T',' ').replace('+08:00','');
    host.innerHTML=`<div class="ti-head"><div class="ti-kicker">里程家 Travelideas</div><h2 class="ti-title">KKday 最新優惠與折扣碼</h2><p class="ti-sub">全站折扣碼、每週限定、熱門主題與信用卡／支付優惠集中整理；已過期優惠會自動下架。</p><div class="ti-meta"><span>目前 ${campaigns.length} 個活動優惠</span><span>${cards.length} 個信用卡／支付優惠</span><span>更新 ${esc(updated)}</span></div></div><nav class="ti-nav">${nav}</nav>${sections||'<div class="ti-loading">目前沒有可顯示的優惠。</div>'}<div class="ti-note">提醒：折扣碼、名額、適用商品、付款方式及實際折抵金額可能調整，請以 KKday 結帳頁面顯示為準。部分連結為合作推廣連結。</div>`;

    host.querySelectorAll('.ti-copy').forEach(btn=>btn.addEventListener('click',async()=>{
      const code=btn.dataset.code;
      try{await navigator.clipboard.writeText(code);const old=btn.textContent;btn.textContent='已複製';setTimeout(()=>btn.textContent=old,1200);}catch(e){window.prompt('複製折扣碼：',code);}
    }));
  }).catch(err=>{console.error(err);host.innerHTML='<div class="ti-error">優惠資料暫時讀取失敗，請稍後重新整理。</div>';});
})();
