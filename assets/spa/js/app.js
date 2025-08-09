
// Scoped SPA under .spa container to avoid conflicts
(function(){
  const $ = (s,root=document)=>root.querySelector(s);
  const $$ = (s,root=document)=>Array.from(root.querySelectorAll(s));
  let CART = JSON.parse(localStorage.getItem('cart_spa_v1')||'[]');
  function save(){ localStorage.setItem('cart_spa_v1', JSON.stringify(CART)); }
  function fmt(n){return n.toFixed(2).replace('.', ',')+' PLN'}
  function totals(method){ const sub=CART.reduce((s,i)=>s+i.price*i.qty,0); const del=method==='delivery'?6:0; return {sub,del,total:sub+del} }
  const routes = { '/': viewHome, '/menu': viewMenu, '/contact': viewContact, '/privacy': viewPrivacy, '/terms': viewTerms, '/success': viewSuccess, '/cancel': viewCancel };
  function go(path){ history.pushState({},'', '#'+path); render(); }
  window.addEventListener('popstate', render); window.addEventListener('hashchange', render);

  function viewHome(){
    const el = document.createElement('div'); el.className='view enter';
    el.innerHTML = `
    <section class="hero"><div class="container grid grid-2">
      <div>
        <h1>Neapol 2025 — 90 sekund w piecu.</h1>
        <p class="kicker">Ciasto 48h • San Marzano • fior di latte • piec 450–500°C</p>
        <div style="margin-top:12px"><button class="cta" onclick="go('/menu')">Przejdź do menu</button></div>
      </div>
      <div class="card"><div class="kicker">Dlaczego my</div>
        <ul><li>Składniki z Włoch</li><li>Wypiek 450–500°C</li><li>Menu wege & bezgluten</li></ul>
      </div>
    </div></section>
    <section class="section"><div class="container"><h2 class="kicker">Polecane</h2>
      <div class="gallery">
        <img src="assets/spa/img/photos/ph_1.svg" alt="Margherita"/><img src="assets/spa/img/photos/ph_2.svg" alt="Diavola"/><img src="assets/spa/img/photos/ph_3.svg" alt="Quattro"/>
        <img src="assets/spa/img/photos/ph_4.svg" alt="Pistacchio"/><img src="assets/spa/img/photos/ph_5.svg" alt="Tartufo"/><img src="assets/spa/img/photos/ph_6.svg" alt="Panna Cotta"/>
      </div></div></section>`;
    return el;
  }
  function viewMenu(){
    const el = document.createElement('div'); el.className='view enter';
    const cards = [{"id": "margherita", "n": "Margherita", "d": "San Marzano, fior di latte, bazylia", "p": 28, "img": "assets/spa/img/photos/ph_1.svg"}, {"id": "diavola", "n": "Diavola", "d": "Spianata piccante, mi\u00f3d peperoncino", "p": 39, "img": "assets/spa/img/photos/ph_2.svg"}, {"id": "quattro", "n": "Quattro Formaggi", "d": "Fior di latte, gorgonzola, parmezan, pecorino", "p": 41, "img": "assets/spa/img/photos/ph_3.svg"}, {"id": "pistacchio", "n": "Pistacchio e Mortadella", "d": "Krem pistacjowy, mortadella, burrata", "p": 46, "img": "assets/spa/img/photos/ph_4.svg"}, {"id": "tartufo", "n": "Tartufo", "d": "Krem truflowy, grzyby, rukola", "p": 44, "img": "assets/spa/img/photos/ph_5.svg"}, {"id": "panna", "n": "Panna Cotta", "d": "Z sosem malinowym", "p": 17, "img": "assets/spa/img/photos/ph_6.svg"}].map(p=>`
      <div class="menu-card">
        <img src="${p.img}" alt="${p.n}">
        <div class="menu-info">
          <div><div class="menu-title">${p.n}</div><div class="menu-desc">${p.d}</div></div>
          <div style="text-align:right">
            <div class="price">${p.p} PLN</div>
            <button class="cta" onclick='addToCart({id:"${p.id}",n:"${p.n}",p:${p.p}})'>Dodaj</button>
          </div>
        </div>
      </div>`).join('');
    el.innerHTML = `<section class="section"><div class="container"><h2>Menu</h2><div class="grid grid-3">${cards}</div></div></section>`;
    return el;
  }
  function viewContact(){
    const map = `<iframe src="https://www.google.com/maps?q=Ul.+Przyk%C5%82adowa+10,+00-000+Miasto&output=embed" width="100%" height="280" style="border:0" loading="lazy" allowfullscreen></iframe>`;
    const el = document.createElement('div'); el.className='view enter';
    el.innerHTML = `<section class="section"><div class="container grid grid-2">
      <div>
        <h2>Kontakt</h2>
        <p>Ul. Przykładowa 10, 00-000 Miasto</p>
        <p>Tel: <a href="tel:+48600000000">+48 600 000 000</a><br/>Email: <a href="mailto:kontakt@napoletana.pl">kontakt@napoletana.pl</a></p>
        <div class="card" style="margin-top:10px">${map}</div>
      </div>
      <div class="card">
        <h3>Zamów teraz</h3>
        <label>Sposób odbioru
          <select id="deliveryMethod"><option value="pickup">Odbiór osobisty</option><option value="delivery">Dostawa (+6 PLN)</option></select>
        </label>
        <div class="totals">
          <div>Razem: <strong id="checkout-subtotal">0,00 PLN</strong></div>
          <div>Dostawa: <strong id="checkout-delivery">0,00 PLN</strong></div>
          <div>Do zapłaty: <strong id="checkout-total">0,00 PLN</strong></div>
        </div>
        <button id="payNow" class="cta" style="margin-top:8px">Zamów i zapłać</button>
        <p class="kicker">Płatność tylko online (Stripe). Brak zamówień na e‑mail.</p>
      </div>
    </div></section>`;
    setTimeout(()=>attachCheckoutHandlers(),0);
    return el;
  }
  function viewPrivacy(){
    const el=document.createElement('div'); el.className='view enter';
    el.innerHTML = `<section class="section"><div class="container card">
      <h2>Polityka prywatności</h2>
      <p>Administrator: Pizza Italiana Napoletana. Dane przetwarzamy w celu realizacji zamówień i obowiązków prawnych.</p>
    </div></section>`;
    return el;
  }
  function viewTerms(){
    const el=document.createElement('div'); el.className='view enter';
    el.innerHTML = `<section class="section"><div class="container card">
      <h2>Regulamin</h2>
      <ol><li>Wyłącznie płatności online (Stripe).</li><li>Ceny zawierają VAT.</li></ol>
    </div></section>`;
    return el;
  }
  function viewSuccess(){
    const el=document.createElement('div'); el.className='view enter';
    el.innerHTML = `<section class="section"><div class="container card"><h2>Dziękujemy!</h2><p>Płatność przyjęta.</p></div></section>`;
    return el;
  }
  function viewCancel(){
    const el=document.createElement('div'); el.className='view enter';
    el.innerHTML = `<section class="section"><div class="container card"><h2>Płatność anulowana</h2><p>Spróbuj ponownie.</p></div></section>`;
    return el;
  }

  // Cart
  function addToCart(p){ const f=CART.find(x=>x.id===p.id); if(f) f.qty++; else CART.push({id:p.id,name:p.n,price:p.p,qty:1}); updateCart(); }
  function updateCart(){ save(); const cnt=CART.reduce((a,b)=>a+b.qty,0); const cs=document.querySelector('.spa .cart-fab .count'); if(cs) cs.textContent=cnt; const dm=document.getElementById('deliveryMethod'); if(dm) setTotals(totals(dm.value)); }
  function setTotals(t){ const s=document.getElementById('checkout-subtotal'); if(s) s.textContent=fmt(t.sub); const d=document.getElementById('checkout-delivery'); if(d) d.textContent=fmt(t.del); const tt=document.getElementById('checkout-total'); if(tt) tt.textContent=fmt(t.total); }
  function attachCheckoutHandlers(){ const dm=document.getElementById('deliveryMethod'); if(dm) dm.onchange=()=>setTotals(totals(dm.value)); setTotals(totals(dm?.value||'pickup')); const pay=document.getElementById('payNow'); if(pay) pay.onclick=async()=>{{ if(CART.length===0){{alert('Koszyk jest pusty');return;}} const method=document.getElementById('deliveryMethod')?.value||'pickup'; const payload={{cart:CART,delivery:method==='delivery'?6:0,currency:'pln'}}; const res=await fetch('/.netlify/functions/create-checkout-session',{{method:'POST',headers:{{'Content-Type':'application/json'}},body:JSON.stringify(payload)}}); if(!res.ok){{alert('Błąd płatności: '+await res.text());return;}} const data=await res.json(); location.href=data.url; }}; }

  // Drawer
  function openDrawer(){ document.querySelector('.spa .drawer').classList.add('open'); renderDrawer(); }
  function closeDrawer(){ document.querySelector('.spa .drawer').classList.remove('open'); }
  function renderDrawer(){ const box=document.getElementById('drawer-items'); box.innerHTML=''; CART.forEach(it=>{{ const row=document.createElement('div'); row.className='item'; row.innerHTML=`<div><strong>${{it.name}}</strong><div class="kicker">${{fmt(it.price)}} × ${{it.qty}}</div></div><div class="qty"><button data-a="dec">−</button><span>${{it.qty}}</span><button data-a="inc">+</button><button data-a="rm" style="margin-left:6px">✕</button></div>`; row.querySelector('[data-a=inc]').onclick=()=>{{it.qty++; updateCart(); renderDrawer();}}; row.querySelector('[data-a=dec]').onclick=()=>{{it.qty=Math.max(1,it.qty-1); updateCart(); renderDrawer();}}; row.querySelector('[data-a=rm]').onclick=()=>{{ CART = CART.filter(x=>x.id!==it.id); updateCart(); renderDrawer(); }}; box.appendChild(row); }}); const dmVal=document.getElementById('deliveryMethod')?.value||'pickup'; const t=totals(dmVal); document.getElementById('drawer-subtotal').textContent=fmt(t.sub); document.getElementById('drawer-delivery').textContent=fmt(t.del); document.getElementById('drawer-total').textContent=fmt(t.total); document.querySelector('.spa .cart-fab .count').textContent=CART.reduce((a,b)=>a+b.qty,0); }

  // Mount
  function render(){ const path=location.hash.replace('#','')||'/'; const view=(routes[path]||viewHome)(); const root=document.getElementById('spa-view'); root.innerHTML=''; root.appendChild(view); }
  window.go = go;
  window.addToCart = addToCart;

  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelector('.spa .cart-fab').addEventListener('click',openDrawer);
    document.getElementById('closeDrawer').addEventListener('click',closeDrawer);
    updateCart(); render();
  });
})();
