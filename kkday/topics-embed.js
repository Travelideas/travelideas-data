(function(){
  const ROOT='travelideas-kkday-topics';
  const BASE='https://travelideas.github.io/travelideas-data/kkday/';
  const host=document.getElementById(ROOT); if(!host)return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const get=f=>fetch(BASE+f+'?v=20261002-topics1',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(f+' '+r.status);return r.json()});
  const pidFromUrl=u=>{const m=String(u||'').match(/\/product\/(\d+)/);return m?Number(m[1]):null};
  const addCid=u=>{
    if(!u)return '';
    try{
      const x=new URL(u,location.href);
      if(/(^|\.)kkday\.com$/.test(x.hostname) && !x.searchParams.has('cid'))x.searchParams.set('cid','5149');
      return x.toString();
    }catch(e){return u}
  };

  const style=document.createElement('style');
  style.textContent=`
  #${ROOT}{--ink:#1f2937;--muted:#667085;--line:#e5e7eb;--brand:#0e7a85;--accent:#ef7d00;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans TC",Arial,sans-serif;color:var(--ink);line-height:1.6}
  #${ROOT} *{box-sizing:border-box}
  #${ROOT} .hero{padding:26px;border:1px solid var(--line);border-radius:20px;background:linear-gradient(135deg,#eefbfb,#fff 55%,#fff6e9);box-shadow:0 6px 24px rgba(16,24,40,.05)}
  #${ROOT} .eyebrow{font-size:12px;font-weight:800;letter-spacing:.08em;color:var(--brand)}
  #${ROOT} h2{margin:5px 0 8px!important;font-size:29px!important;line-height:1.3!important;color:#172033!important;border:0!important;padding:0!important}
  #${ROOT} .hero p{margin:0;color:#596579;font-size:14px}
  #${ROOT} .season{margin:18px 0 8px}
  #${ROOT} .season-title,#${ROOT} .all-title{font-size:20px!important;margin:26px 0 12px!important;padding:0!important;border:0!important}
  #${ROOT} .chips{display:flex;flex-wrap:wrap;gap:8px}
  #${ROOT} .chip{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:999px;border:1px solid #dbe3e6;background:#fff;color:#37505a!important;text-decoration:none!important;font-size:13px;font-weight:750}
  #${ROOT} .chip:hover{border-color:var(--brand);color:var(--brand)!important}
  #${ROOT} .theme-index{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin:10px 0 24px}
  #${ROOT} .index-card{display:block;border:1px solid var(--line);border-radius:13px;padding:13px 14px;text-decoration:none!important;color:var(--ink)!important;background:#fff}
  #${ROOT} .index-card b{display:block;font-size:15px}
  #${ROOT} .index-card span{font-size:12px;color:var(--muted)}
  #${ROOT} details.theme{border:1px solid var(--line);border-radius:16px;margin:12px 0;background:#fff;overflow:hidden}
  #${ROOT} details.theme[open]{box-shadow:0 5px 18px rgba(16,24,40,.045)}
  #${ROOT} summary{cursor:pointer;list-style:none;padding:17px 18px;display:flex;align-items:center;gap:12px}
  #${ROOT} summary::-webkit-details-marker{display:none}
  #${ROOT} .theme-thumb{width:70px;height:50px;object-fit:cover;border-radius:9px;background:#f3f4f6;flex:0 0 auto}
  #${ROOT} .sum-main{min-width:0;flex:1}
  #${ROOT} .sum-main b{display:block;font-size:18px}
  #${ROOT} .sum-main span{font-size:12px;color:var(--muted)}
  #${ROOT} .arrow{font-size:19px;color:#98a2b3}
  #${ROOT} details[open] .arrow{transform:rotate(90deg)}
  #${ROOT} .theme-body{padding:0 18px 20px;border-top:1px solid #f0f2f4}
  #${ROOT} .group-title{font-size:16px!important;margin:20px 0 9px!important;padding:0!important;border:0!important;color:#243342!important}
  #${ROOT} .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(225px,1fr));gap:11px}
  #${ROOT} .product{border:1px solid var(--line);border-radius:13px;overflow:hidden;background:#fff;display:flex;flex-direction:column;min-width:0}
  #${ROOT} .product.hidden-extra{display:none}
  #${ROOT} .pimg{width:100%;aspect-ratio:16/10;object-fit:cover;background:#f4f5f6}
  #${ROOT} .pbody{padding:13px;display:flex;flex-direction:column;flex:1}
  #${ROOT} .badges{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px}
  #${ROOT} .badge{font-size:10.5px;border-radius:999px;background:#eef7f7;color:#17646c;padding:3px 7px;font-weight:750}
  #${ROOT} .badge.sale{background:#fff1e6;color:#a94c00}
  #${ROOT} .ptitle{font-size:14px;font-weight:800;line-height:1.45}
  #${ROOT} .price{font-size:12px;color:var(--muted);margin-top:6px}
  #${ROOT} .promo{font-size:12px;color:#7a3f00;background:#fff8ef;border-radius:8px;padding:7px 8px;margin-top:8px}
  #${ROOT} .pactions{margin-top:auto;padding-top:11px}
  #${ROOT} .btn{display:inline-block;border-radius:8px;padding:7px 10px;background:#172033;color:#fff!important;text-decoration:none!important;font-size:12px;font-weight:750}
  #${ROOT} .nolink{font-size:11px;color:#98a2b3}
  #${ROOT} .more{margin-top:10px;border:1px solid #d8dee4;background:#fff;border-radius:9px;padding:7px 10px;font-size:12px;cursor:pointer}
  #${ROOT} .notice{margin-top:22px;padding:13px 15px;border:1px solid #e7eaee;background:#f8fafb;border-radius:12px;color:#667085;font-size:12px}
  @media(max-width:700px){#${ROOT} .hero{padding:20px 16px}#${ROOT} h2{font-size:24px!important}#${ROOT} .grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  host.innerHTML='<div class="notice">載入中…</div>';

  Promise.all([get('packs.json'),get('products.json'),get('deals.json'),get('picks.json')]).then(([packData,productData,dealData,pickData])=>{
    const productMap=new Map((productData.items||[]).map(x=>[Number(x.id),x]));
    const promoById=new Map((productData.featured_promotions||[]).map(x=>[Number(x.product_id),x]));
    const dealById=new Map();
    (dealData.items||[]).forEach(x=>{const id=pidFromUrl(x.url);if(id&&!dealById.has(id))dealById.set(id,x)});
    const pickedIds=new Set();
    (pickData.items||[]).forEach(w=>(w.products||[]).forEach(x=>{const id=pidFromUrl(x.url);if(id)pickedIds.add(id)}));

    const preferred=['lianjia','maple','ski','krwinter','aurora','sea'];
    const themes=(packData.themes||[]).slice().sort((a,b)=>{
      const ai=preferred.indexOf(a.id),bi=preferred.indexOf(b.id);
      if(ai>=0||bi>=0)return (ai<0?999:ai)-(bi<0?999:bi);
      return String(a.title).localeCompare(String(b.title),'zh-Hant');
    });

    function productCard(x,i){
      const id=Number(x.product_id)||null;
      const norm=id?productMap.get(id):null;
      const fp=id?promoById.get(id):null;
      const deal=id?dealById.get(id):null;
      const title=x.product_name||x.short_title||norm?.title||('商品 '+id);
      const img=x.image||norm?.image||fp?.image||'';
      const url=x.url||norm?.url||fp?.url||deal?.url||'';
      const price=x.reference_price??norm?.price_ref;
      const promo=x.promotion||fp?.promotion||deal?.promotion||'';
      const code=x.explicit_code||deal?.code||'';
      const badges=[];
      if(id&&pickedIds.has(id))badges.push('<span class="badge">本週選品</span>');
      if(fp||deal)badges.push('<span class="badge sale">當期優惠</span>');
      if(code)badges.push('<span class="badge">'+esc(code)+'</span>');
      return '<article class="product'+(i>=6?' hidden-extra':'')+'">'+
        (img?'<img class="pimg" loading="lazy" src="'+esc(img)+'" alt="'+esc(title)+'">':'')+
        '<div class="pbody">'+
          (badges.length?'<div class="badges">'+badges.join('')+'</div>':'')+
          '<div class="ptitle">'+esc(title)+'</div>'+
          (price!==undefined&&price!==null?'<div class="price">參考價格 NT$ '+esc(Number(price).toLocaleString('zh-TW'))+' 起</div>':'')+
          (promo?'<div class="promo">'+esc(promo)+'</div>':'')+
          '<div class="pactions">'+(url?'<a class="btn" href="'+esc(addCid(url))+'" target="_blank" rel="nofollow sponsored noopener">查看商品</a>':'<span class="nolink">目前未提供公開商品連結</span>')+'</div>'+
        '</div></article>';
    }

    function themeBlock(t,idx){
      const count=(t.groups||[]).reduce((a,g)=>a+(g.products||[]).length,0);
      const thumb=t.image||((t.groups?.[0]?.products||[]).find(p=>p.image)?.image)||'';
      const groups=(t.groups||[]).map((g,gi)=>{
        const products=g.products||[];
        return '<section class="group"><h4 class="group-title">'+esc(g.title)+'</h4>'+
          '<div class="grid" data-group="'+esc(t.id)+'-'+gi+'">'+products.map(productCard).join('')+'</div>'+
          (products.length>6?'<button class="more" type="button" data-target="'+esc(t.id)+'-'+gi+'">顯示更多（'+(products.length-6)+'）</button>':'')+
        '</section>';
      }).join('');
      return '<details class="theme" id="topic-'+esc(t.id)+'" '+(idx<2?'open':'')+'>'+
        '<summary>'+(thumb?'<img class="theme-thumb" loading="lazy" src="'+esc(thumb)+'" alt="">':'')+
        '<div class="sum-main"><b>'+esc(t.title)+'</b><span>'+(t.groups||[]).length+' 個分類 · '+count+' 個商品</span></div><span class="arrow">›</span></summary>'+
        '<div class="theme-body">'+groups+'</div></details>';
    }

    const seasonal=themes.filter(t=>preferred.includes(t.id)).slice(0,6);
    const chips=seasonal.map(t=>'<a class="chip" href="#topic-'+esc(t.id)+'">'+esc(t.title)+'</a>').join('');
    const index=themes.map(t=>{
      const c=(t.groups||[]).reduce((a,g)=>a+(g.products||[]).length,0);
      return '<a class="index-card" href="#topic-'+esc(t.id)+'"><b>'+esc(t.title)+'</b><span>'+c+' 個商品</span></a>';
    }).join('');

    host.innerHTML=
      '<div class="hero"><div class="eyebrow">里程家 Travelideas</div><h2>KKday 熱門商品與旅遊主題大全</h2><p>依旅遊季節、目的地與玩法分類整理 KKday 熱門商品，從賞楓、滑雪、極光，到東南亞、JR PASS、包車、機票與郵輪，都可以快速找到適合的行程。</p></div>'+
      '<section class="season"><h3 class="season-title">現在值得看的主題</h3><div class="chips">'+chips+'</div></section>'+
      '<h3 class="all-title">全部旅遊主題</h3><div class="theme-index">'+index+'</div>'+
      themes.map(themeBlock).join('')+
      '<div class="notice">商品內容、價格、供應日期與優惠可能調整，實際訂購條件請以 KKday 官方商品頁及結帳頁顯示為準。</div>';

    host.querySelectorAll('.more').forEach(btn=>btn.addEventListener('click',()=>{
      const grid=host.querySelector('[data-group="'+CSS.escape(btn.dataset.target)+'"]');
      if(!grid)return;
      const hidden=grid.querySelectorAll('.hidden-extra');
      hidden.forEach(x=>x.classList.remove('hidden-extra'));
      btn.remove();
    }));
    host.querySelectorAll('.chip,.index-card').forEach(a=>a.addEventListener('click',()=>{
      const id=(a.getAttribute('href')||'').slice(1);
      const d=document.getElementById(id); if(d)d.open=true;
    }));
  }).catch(err=>{
    console.error(err);
    host.innerHTML='<div class="notice">目前暫時無法顯示旅遊主題資料，請稍後再試。</div>';
  });
})();