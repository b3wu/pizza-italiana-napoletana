
// minimal helpers
const qs=s=>document.querySelector(s); const qsa=s=>Array.from(document.querySelectorAll(s));

// cart state
let CART = JSON.parse(localStorage.getItem('cart_v4')||'[]');
const save=()=>localStorage.setItem('cart_v4', JSON.stringify(CART));
function fmt(n){return n.toFixed(2).replace('.', ',')+' PLN';}
function totals(){ const sub=CART.reduce((s,i)=>s+i.price*i.qty,0); const del=(qs('#deliveryMethod')?.value==='delivery')?6:0; return {sub,del,total:sub+del}; }
function render(prefix){
  const list=qs('.items'); if(list){ list.innerHTML=''; CART.forEach(it=>{ const el=document.createElement('div'); el.className='item'; el.innerHTML=`<div><strong>${it.name}</strong><div class='small'>${fmt(it.price)} × ${it.qty}</div></div><div class='qty'><button data-a='dec'>−</button><span>${it.qty}</span><button data-a='inc'>+</button><button data-a='rm' title='Usuń' style='margin-left:6px'>✕</button></div>`; el.querySelector('[data-a=inc]').onclick=()=>{it.qty++;update();}; el.querySelector('[data-a=dec]').onclick=()=>{it.qty=Math.max(1,it.qty-1);update();}; el.querySelector('[data-a=rm]').onclick=()=>{CART=CART.filter(x=>x.id!==it.id);update();}; list.appendChild(el); }); }
  const t=totals(); ['subtotal','delivery','total'].forEach(k=>{ const el=qs(`#${prefix}-${k}`); if(el) el.textContent = fmt(k==='subtotal'?t.sub:k==='delivery'?t.del:t.total); }); const cspan=qs('.cart-fab .count'); if(cspan) cspan.textContent=CART.reduce((a,b)=>a+b.qty,0);
}
function add(p){ const f=CART.find(x=>x.id===p.id); if(f) f.qty++; else CART.push({id:p.id,name:p.n,price:p.p,qty:1}); update(); const b=qs(`[data-add='${p.id}']`); if(b){b.textContent='Dodano ✓'; setTimeout(()=>b.textContent='Dodaj',800);} }
function update(){ save(); render('drawer'); render('checkout'); }
function clearCart(){ CART=[]; update(); }

// mount menu
function mount(){ const root=qs('#menu-root'); root.innerHTML=''; Object.keys(window.MENU).forEach(cat=>{ const sec=document.createElement('div'); sec.innerHTML=`<h3>${cat}</h3>`; const grid=document.createElement('div'); grid.className='menu-grid'; window.MENU[cat].forEach(p=>{ const row=document.createElement('div'); row.className='menu-item'; row.innerHTML=`<div><div class='menu-title'>${p.n}</div><div class='small'>${p.d}</div></div><div style='display:flex;flex-direction:column;align-items:flex-end;gap:6px'><div><strong>${p.p} PLN</strong></div><button class='cta' data-add='${p.id}' style='padding:6px 10px'>Dodaj</button></div>`; grid.appendChild(row); }); sec.appendChild(grid); root.appendChild(sec); }); Object.values(window.MENU).flat().forEach(p=>{ qs(`[data-add='${p.id}']`).onclick=()=>add(p); }); }

document.addEventListener('DOMContentLoaded',()=>{
  // drawer
  const d=qs('.drawer'); qs('.cart-fab').onclick=()=>d.classList.add('open'); qs('#closeDrawer').onclick=()=>d.classList.remove('open'); qs('#clearCart').onclick=clearCart; qs('#deliveryMethod').onchange=()=>{render('drawer');render('checkout');};
  mount(); update();
  // Stripe checkout
  qs('#payNow').onclick=async()=>{
    if(CART.length===0){alert('Koszyk jest pusty');return;}
    const payload={cart:CART,delivery:(qs('#deliveryMethod').value==='delivery')?6:0,currency:'pln'};
    const res = await fetch('/.netlify/functions/create-checkout-session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    if(!res.ok){alert('Błąd płatności ('+res.status+'): '+await res.text()); return;}
    const data = await res.json(); location.href = data.url;
  };
  // optional email
  qs('#emailOrder').onclick=()=>{
    const t=totals(); const body=encodeURIComponent(CART.map(i=>`- ${i.name} x${i.qty} = ${fmt(i.price*i.qty)}`).join('\n')+`\n\nRazem: ${fmt(t.total)}`);
    location.href=`mailto:kontakt@napoletana.pl?subject=Zamówienie&body=${body}`;
  };
});
