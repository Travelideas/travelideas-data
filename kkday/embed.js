(function(){
  const ROOT='travelideas-kkday-coupons';
  const BASE='https://travelideas.github.io/travelideas-data/kkday/';
  const host=document.getElementById(ROOT); if(!host)return;

  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const now=new Date();
  const day=s=>s?new Date(s+'T00:00:00+08:00'):null;
  const end=s=>s?new Date(s+'T23:59:59+08:00'):null;
  const active=x=>(!x.start||day(x.start)<=now)&&(!x.end||end(x.end)>=now);
  const upcoming=x=>x.start&&day(x.start)>now;
  const get=u=>fetch(BASE+u+'?t='+Date.now(),{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(u+' '+r.status);return r.json()});
  const addCid=u=>{
    if(!u)return '';
    try{const x=new URL(u,location.href);if(/kkday\.com$/.test(x.hostname)||/\.kkday\.com$/.test(x.hostname)){if(!x.searchParams.has('cid'))x.searchParams.set('cid','5149');return x.toString();}}catch(e){}
    return u;
  };

  const style=document.createElement('style');
  style.id='ti-kkday-production-style';
  style.textContent=`
  #${ROOT}.ti-wrap{--o:#ef7d00;--d:#182230;--ink:#253246;--muted:#667085;--line:#e6e9ed;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans TC",Arial,sans-serif;color:var(--ink);line-height:1.62;margin:22px 0}
  #${ROOT} *{box-sizing:border-box}
  #${ROOT} .hero{background:linear-gradient(135deg,#fff7ea,#fff 52%,#effafa);border:1px solid var(--line);border-radius:20px;padding:24px;box-shadow:0 7px 24px rgba(16,24,40,.05)}
  #${ROOT} .kicker{font-size:12px;font-weight:800;letter-spacing:.08em;color:var(--o)}
  #${ROOT} .hero h2{font-size:28px!important;line-height:1.32!important;margin:4px 0 7px!important;padding:0!important;border:0!important;color:var(--d)!important}
  #${ROOT} .hero p{margin:0;color:#596579;font-size:14px}
  #${ROOT} .nav{display:flex;gap:7px;flex-wrap:wrap;margin:12px 0}
  #${ROOT} .nav a{font-size:12px;border:1px solid #dfe4e8;border-radius:999px;padding:6px 10px;background:#fff;color:#455468!important;text-decoration:none!important;font-weight:700}
  #${ROOT} .section-title{font-size:21px!important;line-height:1.35!important;margin:28px 0 11px!important;padding:0!important;border:0!important;color:var(--d)!important}
  #${ROOT} .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px}
  #${ROOT} .card{background:#fff;border:1px solid var(--line);border-radius:15px;padding:16px;display:flex;flex-direction:column;min-width:0;box-shadow:0 3px 12px rgba(16,24,40,.035)}
  #${ROOT} .card.featured{border-top:3px solid var(--o)}
  #${ROOT} .row{display:flex;gap:9px;justify-content:space-between;align-items:flex-start}
  #${ROOT} .title{font-size:16px;font-weight:850;line-height:1.42;color:#192536}
  #${ROOT} .meta{font-size:12px;color:#7b8794;margin-top:4px}
  #${ROOT} .badge,#${ROOT} .chip{font-size:11px;background:#f4f6f8;color:#526071;border-radius:999px;padding:4px 8px;white-space:nowrap}
  #${ROOT} .offer{font-size:14px;color:#344054;margin-top:9px}
  #${ROOT} .code{display:flex;align-items:center;gap:7px;margin-top:11px;padding:9px;border:1px dashed #ccd4db;border-radius:10px;background:#fafbfc}
  #${ROOT} .code b{font-family:ui-monospace,Menlo,monospace;font-size:14px}
  #${ROOT} .copy{margin-left:auto;border:0;border-radius:7px;padding:6px 8px;cursor:pointer;font-size:12px}
  #${ROOT} .actions{margin-top:auto;padding-top:12px}
  #${ROOT} .btn{display:inline-block;background:var(--d);color:#fff!important;text-decoration:none!important;border-radius:8px;padding:8px 12px;font-size:13px;font-weight:750}
  #${ROOT} .promo .btn{background:var(--o)}
  #${ROOT} .notice{margin-top:28px;padding:13px 15px;background:#f7f9fb;border:1px solid #e8ebef;border-radius:12px;color:#596579;font-size:12px}
  #ti-kkday-live-disclaimer{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans TC",Arial,sans-serif;background:#f7f9fb;border:1px solid #e8ebef;border-radius:12px;padding:14px 16px;margin:22px 0;color:#596579;line-height:1.7;font-size:13px}
  @media(max-width:700px){#${ROOT} .hero{padding:20px 16px}#${ROOT} .hero h2{font-size:23px!important}#${ROOT} .grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  function injectDisclaimerBeforeFaq(){
    if(document.getElementById('ti-kkday-live-disclaimer'))return;
    const section=document.getElementById('ti-kkday-seo-intro');
    if(!section)return;
    const h2=[...section.querySelectorAll('h2')].find(x=>/常見問題|FAQ/i.test(x.textContent||''));
    if(!h2)return;
    const box=document.createElement('div');
    box.id='ti-kkday-live-disclaimer';
    box.textContent='資料整理自 KKday 官方公開資訊及活動頁面。活動內容、價格、折扣、名額、適用商品與使用條件可能隨時調整；如本頁資訊與 KKday 官方頁面或實際結帳頁不同，請以 KKday 官方頁面及結帳時顯示的最新資訊為準。';
    h2.parentNode.insertBefore(box,h2);
  }

  function codeBox(code){return code?'<div class="code"><span>優惠碼</span><b>'+esc(code)+'</b><button type="button" class="copy" data-code="'+esc(code)+'">複製</button></div>':''}
  function button(url,label){return url?'<div class="actions"><a class="btn" href="'+esc(addCid(url))+'" target="_blank" rel="nofollow sponsored noopener">'+esc(label||'查看優惠')+'</a></div>':''}
  function couponCard(x,featured=false){return '<article class="card'+(featured?' featured':'')+'"><div class="row"><div><div class="title">'+esc(x.label||x.scope||x.code)+'</div><div class="meta">'+esc(x.start||'現在')+' ～ '+esc(x.end||'依活動')+'</div></div><span class="badge">'+(upcoming(x)?'即將開始':'進行中')+'</span></div><div class="offer">'+esc(x.benefit||'')+'</div>'+codeBox(x.code)+'</article>'}
  function campaignCard(x){return '<article class="card featured"><div class="row"><div><div class="title">'+esc(x.title)+'</div><div class="meta">'+esc(x.start||'現在')+' ～ '+esc(x.end||'依活動')+'</div></div><span class="badge">'+(upcoming(x)?'即將開始':'進行中')+'</span></div><div class="offer">'+esc(x.offer||'')+'</div>'+button(x.landing_url,'查看活動')+'</article>'}
  function promoCard(x){const meta=[x.booking_start&&('活動 '+x.booking_start),x.booking_end&&('至 '+x.booking_end),x.travel_date&&('使用日 '+x.travel_date),x.limit].filter(Boolean).join(' · ');return '<article class="card promo featured"><div class="title">'+esc(x.title)+'</div>'+(meta?'<div class="meta">'+esc(meta)+'</div>':'')+'<div class="offer">'+esc(x.promotion||'')+'</div>'+button(x.url,'查看商品')+'</article>'}
  function bankCard(x){return '<article class="card"><div class="title">'+esc(x.scope||'信用卡／支付優惠')+'</div><div class="meta">'+esc(x.start||'現在')+' ～ '+esc(x.end||'依活動')+'</div><div class="offer">'+esc(x.benefit||'')+'</div>'+codeBox(x.code)+button(x.url,'查看活動')+'</article>'}

  host.className='ti-wrap';
  host.innerHTML='<div class="card">載入中…</div>';
  injectDisclaimerBeforeFaq();

  Promise.all([get('campaigns.json'),get('coupons.json'),get('products.json'),get('credit-cards.json')]).then(([campaignData,couponData,productData,bankData])=>{
    const campaigns=(campaignData.items||[]).filter(x=>active(x)||upcoming(x)).sort((a,b)=>(b.priority||0)-(a.priority||0));
    const coupons=(couponData.items||[]).filter(active);
    const banks=(bankData.items||[]).filter(active);
    const promos=(productData.featured_promotions||[]).filter(x=>!x.booking_end||end(x.booking_end)>=now);

    const byCode=new Map(coupons.map(x=>[x.code,x]));
    const mainCodes=['ALL95','ALL200','ALL600','AFFNEW88A','KKAFF400','KKAFF700','KKAFF1000A','KKAFFTOUR88','KKAFFLH520','KKCCCAR','KKAFF1200','KKTWOUR9','KKFLY','KKFHP500','EXCUZ2000','EXCUZ3000'];
    const dailyCodes=['HMCDAY','BSDAY','SEADAY','JPDAY','SELDAY','TWDAY','EADAY','OCDAY'];
    const seasonalCodes=['WIN600','WIN1200','26AWJPTOUR','26AUR94','KBEAUTY88','JPTRAIN','KKHOTELNEW','KKHOTEL'];
    const main=mainCodes.map(c=>byCode.get(c)).filter(Boolean);
    const daily=dailyCodes.map(c=>byCode.get(c)).filter(Boolean);
    const seasonal=seasonalCodes.map(c=>byCode.get(c)).filter(Boolean);

    const nav=[
      ['current','🔥 本月主打'],
      ['codes','🎟️ 折扣碼'],
      ['products','✨ 商品優惠'],
      ['weekly','📅 每週優惠'],
      ['seasonal','🍁 季節／常青'],
      ['cards','💳 信用卡／支付']
    ].map(([id,t])=>'<a href="#ti-'+id+'">'+t+'</a>').join('');

    const currentCampaigns=campaigns.slice(0,5);
    const currentCodes=['ALL95','ALL200','ALL600'].map(c=>byCode.get(c)).filter(Boolean);
    const currentPromos=promos.slice(0,6);

    host.innerHTML=
      '<div class="hero"><div class="kicker">里程家 Travelideas</div><h2>2026 KKday 最新優惠整理</h2><p>折扣碼、機票／機加酒／包車、信用卡與當期熱門商品一起整理；本月主打優先，常青優惠往後排。</p></div>'+
      '<nav class="nav">'+nav+'</nav>'+
      '<section id="ti-current"><h3 class="section-title">🔥 本月主打</h3><div class="grid">'+currentCampaigns.map(campaignCard).join('')+currentCodes.map(x=>couponCard(x,true)).join('')+currentPromos.map(promoCard).join('')+'</div></section>'+
      '<section id="ti-codes"><h3 class="section-title">🎟️ 精選折扣碼</h3><div class="grid">'+main.map(x=>couponCard(x)).join('')+'</div></section>'+
      '<section id="ti-products"><h3 class="section-title">✨ 當期商品優惠</h3><div class="grid">'+promos.map(promoCard).join('')+'</div></section>'+
      '<section id="ti-weekly"><h3 class="section-title">📅 每週目的地優惠</h3><div class="grid">'+daily.map(x=>couponCard(x)).join('')+'</div></section>'+
      '<section id="ti-seasonal"><h3 class="section-title">🍁 季節／常青優惠</h3><div class="grid">'+seasonal.map(x=>couponCard(x)).join('')+'</div></section>'+
      '<section id="ti-cards"><h3 class="section-title">💳 信用卡／支付優惠</h3><div class="grid">'+banks.map(bankCard).join('')+'</div></section>'+
      '<div class="notice">部分連結為合作推廣連結。優惠內容與價格可能調整，訂購前請再次確認 KKday 官方頁面及結帳頁顯示。</div>';

    host.querySelectorAll('.copy').forEach(btn=>btn.addEventListener('click',async()=>{const code=btn.dataset.code;try{await navigator.clipboard.writeText(code);const old=btn.textContent;btn.textContent='已複製';setTimeout(()=>btn.textContent=old,1200)}catch(e){window.prompt('複製優惠碼：',code)}}));
    injectDisclaimerBeforeFaq();
  }).catch(err=>{console.error(err);host.innerHTML='<div class="card">目前暫時無法顯示，請稍後再試。</div>';});
})();