(function(){
  const ROOT_ID='travelideas-kkday-coupons';
  const BASE='https://travelideas.github.io/travelideas-data/kkday/';
  const host=document.getElementById(ROOT_ID); if(!host)return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#039;'}[m]));
  const now=new Date(), endDate=s=>s?new Date(s+'T23:59:59+08:00'):null, startDate=s=>s?new Date(s+'T00:00:00+08:00'):null;
  const active=x=>!x.end||endDate(x.end)>=now;
  const status=x=>{const s=startDate(x.start),e=endDate(x.end);return s&&now<s?'即將開始':e&&now>e?'已結束':'進行中'};
  const slug=s=>'ti-'+String(s).replace(/[^a-zA-Z0-9\u4e00-\u9fff]+/g,'-');
  const icons={'本月主打':'🔥','10 月折扣碼':'🎟️','每週優惠':'📅','信用卡／支付優惠':'💳','主題活動':'✨','熱門主題':'🍁','指定商品':'🎯'};
  const icon=c=>icons[c]||'✈️';

  function subcat(p){
    const t=(p.title||'')+' '+(p.note||'');
    switch(p.category){
      case 'KKday 獨家': if(/東京|富士|日本/.test(t))return'日本'; if(/墨爾本|雪梨|澳洲/.test(t))return'澳洲'; if(/深圳/.test(t))return'中國大陸'; return'其他精選';
      case '雙十連假國旅': if(/花蓮/.test(t))return'東部'; if(/澎湖|馬祖/.test(t))return'離島'; if(/龜山|宜蘭/.test(t))return'宜蘭／東北角'; if(/高雄|屏東|墾丁|義大/.test(t))return'南部'; return'北部／中部';
      case '東南亞': if(/湄公|古芝|下龍|富國|越南|胡志明/.test(t))return'越南'; if(/清邁|芭達雅|丹嫩|美功|曼谷|泰式/.test(t))return'泰國'; return'其他東南亞';
      case '極光': if(/黃刀/.test(t))return'加拿大・黃刀鎮'; if(/芬蘭|羅瓦涅米/.test(t))return'北歐・芬蘭'; return'其他極光';
      case '韓國冬季': if(/接駁|機場/.test(t))return'雪場交通／接駁'; if(/滑雪|High One|High1|伊利希安/.test(t))return'滑雪／雪場'; return'冰釣／玩雪體驗';
      case '日本滑雪': if(/北海道|手稻/.test(t))return'北海道'; if(/長野|白馬|栂池/.test(t))return'長野／白馬'; return'其他日本雪場';
      case '賞楓': if(/嵐山|奈良|伏見|日本/.test(t))return'日本・關西'; if(/全州|慶州|釜山|韓國/.test(t))return'韓國'; return'其他賞楓';
      case '白川鄉': if(/名古屋/.test(t))return'名古屋出發'; if(/高山站出發/.test(t))return'高山出發'; if(/金澤|二日/.test(t))return'金澤／多日行程'; return'白川鄉經典線';
      case '銀山溫泉': return /藏王|狐狸/.test(t)?'銀山＋藏王周邊':'銀山溫泉經典線';
      case '避冬紐澳': if(/墨爾本|大洋路|企鵝|澳洲/.test(t))return'澳洲・墨爾本'; if(/庫克|塔斯曼|特卡波|紐西蘭/.test(t))return'紐西蘭・南島'; return'其他紐澳';
      default:return'精選商品';
    }
  }

  if(!document.getElementById('ti-kkday-embed-style')){
    const s=document.createElement('style'); s.id='ti-kkday-embed-style'; s.textContent=`
    #${ROOT_ID}.ti-kkday{--o:#f28c00;--d:#182230;--t:#0d8c95;--l:#e8ebef;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans TC",Arial,sans-serif;color:#172033;line-height:1.62;margin:22px 0}#${ROOT_ID} *{box-sizing:border-box}
    #${ROOT_ID} .ti-head{padding:25px 23px;background:linear-gradient(135deg,#fff7eb,#fff 50%,#eefafb);border:1px solid #e6e9ed;border-radius:20px;box-shadow:0 7px 24px rgba(16,24,40,.055)}
    #${ROOT_ID} .ti-kicker{font-size:12px;font-weight:800;letter-spacing:.08em;color:var(--o)}#${ROOT_ID} .ti-title{font-size:28px!important;margin:3px 0 7px!important;border:0!important;color:var(--d)!important}#${ROOT_ID} .ti-sub{font-size:14px;color:#596579;margin:0}
    #${ROOT_ID} .ti-nav,#${ROOT_ID} .ti-subnav{display:flex;gap:7px;flex-wrap:wrap;margin-top:12px}#${ROOT_ID} .ti-nav a,#${ROOT_ID} .ti-subnav a{font-size:12px;border:1px solid #e1e6ea;border-radius:999px;padding:6px 10px;background:#fff;color:#4d5968!important;text-decoration:none!important}
    #${ROOT_ID} .ti-section{font-size:20px!important;margin:27px 0 11px!important;color:var(--d)!important;border:0!important;padding:0!important}
    #${ROOT_ID} .ti-grid,#${ROOT_ID} .ti-products{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}
    #${ROOT_ID} .ti-card,#${ROOT_ID} .ti-product{display:flex;flex-direction:column;background:#fff;border:1px solid var(--l);border-radius:15px;min-width:0;box-shadow:0 3px 12px rgba(16,24,40,.035)}#${ROOT_ID} .ti-card{padding:16px}#${ROOT_ID} .ti-featured{border-top:3px solid var(--o)}
    #${ROOT_ID} .ti-row{display:flex;justify-content:space-between;gap:9px;align-items:flex-start}#${ROOT_ID} .ti-card-title,#${ROOT_ID} .ti-product-title{font-size:16px;font-weight:850;line-height:1.43;color:#192536}#${ROOT_ID} .ti-date,#${ROOT_ID} .ti-product-note{font-size:12px;color:#7b8794;margin-top:5px}#${ROOT_ID} .ti-badge{font-size:11px;color:#08757c;background:#eaf8f8;border-radius:999px;padding:4px 8px;white-space:nowrap}
    #${ROOT_ID} .ti-offer{font-size:14px;color:#344054;margin-top:9px}#${ROOT_ID} .ti-code{display:flex;align-items:center;gap:7px;margin-top:11px;padding:9px;border:1px dashed #ccd4db;border-radius:10px;background:#fafbfc}#${ROOT_ID} .ti-code b{font-family:ui-monospace,Menlo,monospace;font-size:14px;overflow:hidden;text-overflow:ellipsis}#${ROOT_ID} .ti-copy{margin-left:auto;border:0;border-radius:7px;padding:6px 8px;font-size:12px;cursor:pointer}
    #${ROOT_ID} .ti-actions{margin-top:auto;padding-top:11px}#${ROOT_ID} .ti-btn{display:inline-block;background:var(--d);color:#fff!important;text-decoration:none!important;border-radius:8px;padding:8px 12px;font-size:13px;font-weight:750}#${ROOT_ID} .ti-featured .ti-btn,#${ROOT_ID} .ti-product .ti-btn{background:var(--o)}
    #${ROOT_ID} .ti-product-block{margin-top:35px;padding-top:3px;border-top:2px solid #eef1f3}#${ROOT_ID} .ti-theme{scroll-margin-top:20px}#${ROOT_ID} .ti-theme-head{display:flex;align-items:baseline;gap:7px;margin-top:29px;border-bottom:1px solid #edf0f2;padding-bottom:7px}#${ROOT_ID} .ti-theme-head h3{margin:0!important;font-size:21px!important;border:0!important;padding:0!important}#${ROOT_ID} .ti-subgroup{scroll-margin-top:20px;margin-top:18px}#${ROOT_ID} .ti-subgroup h4{margin:0 0 9px;font-size:15px;color:#526071}
    #${ROOT_ID} .ti-product{padding:0}#${ROOT_ID} .ti-product-body{display:flex;flex-direction:column;flex:1;padding:15px 16px 16px}#${ROOT_ID} .ti-product-cat{font-size:11px;font-weight:800;color:var(--o);margin-bottom:4px}#${ROOT_ID} .ti-price{font-size:12px;font-weight:700;margin-top:7px;color:#344054}
    #${ROOT_ID} .ti-note{margin-top:20px;padding:12px 14px;background:#f7f9fb;border:1px solid #edf0f2;border-radius:10px;color:#697586;font-size:11px}#${ROOT_ID} .ti-loading,#${ROOT_ID} .ti-error{padding:18px;border:1px dashed #cbd5e1;border-radius:12px;color:#667085;background:#fff}
    @media(max-width:700px){#${ROOT_ID} .ti-title{font-size:23px!important}#${ROOT_ID} .ti-grid,#${ROOT_ID} .ti-products{grid-template-columns:1fr}#${ROOT_ID} .ti-head{padding:20px 16px}}
    `; document.head.appendChild(s);
  }

  function setSEO(faqs){
    if(location.hostname.indexOf('travelideas.tw')===-1)return;
    const desc='2026 KKday 折扣碼與優惠整理：全站優惠碼、新客折扣、包車、日遊、機票、機加酒、郵輪、信用卡與熱門日本韓國東南亞旅遊商品。';
    let m=document.querySelector('meta[name="description"]'); if(!m){m=document.createElement('meta');m.name='description';document.head.appendChild(m)} if(!m.content||m.content.length<60)m.content=desc;
    if(!document.getElementById('ti-kkday-jsonld')){const j=document.createElement('script');j.id='ti-kkday-jsonld';j.type='application/ld+json';j.textContent=JSON.stringify({'@context':'https://schema.org','@type':'FAQPage','mainEntity':faqs.map(x=>({'@type':'Question','name':x.q,'acceptedAnswer':{'@type':'Answer','text':x.a}}))});document.head.appendChild(j)}
  }

  host.className='ti-kkday'; host.innerHTML='<div class="ti-loading">載入中…</div>';
  Promise.all([
    fetch(BASE+'campaigns.json?t='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject(r.status)),
    fetch(BASE+'credit-cards.json?t='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject(r.status)),
    fetch(BASE+'products.json?t='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject(r.status))
  ]).then(([cd,bd,pd])=>{
    const campaigns=(cd.items||[]).filter(active).sort((a,b)=>(b.priority||0)-(a.priority||0));
    const banks=(bd.items||[]).filter(active).map((x,i)=>({category:'信用卡／支付優惠',title:x.scope,offer:x.benefit,code:x.code,start:x.start,end:x.end,landing_url:x.url,cta_label:'查看卡友優惠',priority:40-i,_bank:true}));
    const groups={}; [...campaigns,...banks].forEach(x=>(groups[x.category]||(groups[x.category]=[])).push(x));
    const order=['本月主打','10 月折扣碼','每週優惠','信用卡／支付優惠','主題活動','熱門主題','指定商品']; const cats=[...order.filter(x=>groups[x]),...Object.keys(groups).filter(x=>!order.includes(x))];
    const nav=cats.map(c=>`<a href="#${slug(c)}">${icon(c)} ${esc(c)}</a>`).join('')+'<a href="#ti-direct-products">🛍️ 熱門商品</a>';
    const sections=cats.map(c=>`<section id="${slug(c)}"><h3 class="ti-section">${icon(c)} ${esc(c)}</h3><div class="ti-grid">${groups[c].map((x,i)=>{const st=status(x);const code=x.code?`<div class="ti-code"><span>折扣碼</span><b>${esc(x.code)}</b><button class="ti-copy" data-code="${esc(x.code)}">複製</button></div>`:'';const url=x.internal_anchor||x.landing_url||'';const target=url.startsWith('#')?'':' target="_blank" rel="nofollow sponsored noopener"';const action=url?`<div class="ti-actions"><a class="ti-btn" href="${esc(url)}"${target}>${esc(x.cta_label||'查看優惠')}</a></div>`:'';return `<article class="ti-card${c==='本月主打'||(c==='10 月折扣碼'&&i<2)?' ti-featured':''}"><div class="ti-row"><div><div class="ti-card-title">${esc(x.title)}</div><div class="ti-date">${esc(x.start||'現在')} ～ ${esc(x.end||'依活動頁')}</div></div><span class="ti-badge">${esc(st)}</span></div><div class="ti-offer">${esc(x.offer||'')}</div>${code}${action}</article>`}).join('')}</div></section>`).join('');

    const products=(pd.items||[]).filter(x=>x.id&&/\/product\//.test(x.url||'')); const pg={}; products.forEach(p=>{const c=p.category||'其他',s=p.subcategory||subcat(p);(((pg[c]||(pg[c]={}))[s])||((pg[c])[s]=[])).push(p)});
    const productNav=Object.keys(pg).map(c=>`<a href="#${slug('商品-'+c)}">${esc(c)}</a>`).join('');
    const productSections=Object.keys(pg).map(c=>{const subs=pg[c];const subHtml=Object.keys(subs).map(s=>`<div class="ti-subgroup" id="${slug('商品-'+c+'-'+s)}"><h4>${esc(s)}</h4><div class="ti-products">${subs[s].map(p=>{const price=p.price_ref?`<div class="ti-price">參考價格：約 NT$${Number(p.price_ref).toLocaleString()}</div>`:'';return `<article class="ti-product"><div class="ti-product-body"><div class="ti-product-cat">${esc(c)} · ${esc(s)}</div><div class="ti-product-title">${esc(p.title)}</div>${p.note?`<div class="ti-product-note">${esc(p.note)}</div>`:''}${price}<div class="ti-actions"><a class="ti-btn" href="${esc(p.url)}" target="_blank" rel="nofollow sponsored noopener">查看商品</a></div></div></article>`}).join('')}</div></div>`).join('');return `<section class="ti-theme" id="${slug('商品-'+c)}"><div class="ti-theme-head"><h3>${esc(c)}</h3></div>${subHtml}</section>`}).join('');

    const faqs=[
      {q:'KKday 折扣碼怎麼使用？',a:'選好商品進入結帳頁，在優惠券或折扣碼欄位輸入可用代碼；最低消費、適用商品、付款方式與名額以結帳頁顯示為準。'},
      {q:'KKday 有機票、機加酒和郵輪優惠嗎？',a:'有，機票、機加酒與郵輪會依活動提供專區優惠或滿額折扣。'},
      {q:'折扣碼可以和信用卡優惠一起用嗎？',a:'是否能同時使用依各活動規則而定，建議結帳時比較折扣後金額與信用卡回饋。'}
    ];
    setSEO(faqs);
    host.innerHTML=`<div class="ti-head"><div class="ti-kicker">里程家 Travelideas</div><h2 class="ti-title">KKday 最新優惠、折扣碼與熱門商品</h2><p class="ti-sub">整理本月折扣碼、信用卡優惠與熱門旅遊商品，依優惠類型、目的地與玩法快速查找。</p></div><nav class="ti-nav">${nav}</nav>${sections}<section class="ti-product-block" id="ti-direct-products"><h3 class="ti-section">🛍️ 熱門旅遊商品</h3><p class="ti-sub">依目的地與玩法分類，快速查看日本、韓國、東南亞、紐澳及季節限定行程。</p><nav class="ti-subnav">${productNav}</nav>${productSections}</section><div class="ti-note">提醒：折扣碼、名額、適用商品、付款方式及價格可能調整，請以 KKday 實際結帳頁面顯示為準。部分連結為合作推廣連結。</div>`;
    host.querySelectorAll('.ti-copy').forEach(btn=>btn.addEventListener('click',async()=>{const code=btn.dataset.code;try{await navigator.clipboard.writeText(code);const old=btn.textContent;btn.textContent='已複製';setTimeout(()=>btn.textContent=old,1200);}catch(e){window.prompt('複製折扣碼：',code);}}));
  }).catch(err=>{console.error(err);host.innerHTML='<div class="ti-error">目前暫時無法顯示，請稍後再試。</div>';});
})();