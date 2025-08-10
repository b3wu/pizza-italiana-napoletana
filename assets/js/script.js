
// Shared cart + Stripe logic for classic multi-page site
const qs=s=>document.querySelector(s); const qsa=s=>Array.from(document.querySelectorAll(s));
let CART = JSON.parse(localStorage.getItem('cart_v3')||'[]');
const save=()=>localStorage.setItem('cart_v3', JSON.stringify(CART));
const fmt=n=>n.toFixed(2).replace('.', ',')+' PLN';
function totals(method){ const sub=CART.reduce((s,i)=>s+i.price*i.qty,0); const del=method==='delivery'?6:0; return {sub,del,total:sub+del}; }
function updateCartCount(){ const cnt = CART.reduce((a,b)=>a+b.qty,0); const el = qs('.cart-count'); if(el) el.textContent = cnt; }

function addItem(p){
  const f=CART.find(x=>x.id===p.id);
  if(f) f.qty++; else CART.push({id:p.id,name:p.n,price:p.p,qty:1});
  save(); updateCartCount();
}
function removeItem(id){ CART = CART.filter(x=>x.id!==id); save(); updateCartCount(); }
function changeQty(id, delta){ const it=CART.find(x=>x.id===id); if(!it) return; it.qty=Math.max(1,(it.qty||1)+delta); save(); updateCartCount(); }

// Bind menu page buttons
function bindMenuButtons(menu){
  if(!menu) return;
  Object.values(menu).flat().forEach(p=>{
    const btn = qs(`[data-add="${p.id}"]`);
    if(btn){ btn.onclick=()=>{ addItem(p); btn.textContent='Dodano ✓'; setTimeout(()=>btn.textContent='Dodaj',800); }; }
  });
}

// Render order table
function renderOrder(){
  const tbody = qs('#order-items'); if(!tbody) return;
  tbody.innerHTML='';
  CART.forEach(it=>{
    const tr = document.createElement('tr'); tr.className='fade-in';
    tr.innerHTML = `<td>${it.name}</td>
    <td>${fmt(it.price)}</td>
    <td class="qty"><button data-a="dec">−</button><span>${it.qty}</span><button data-a="inc">+</button></td>
    <td>${fmt(it.price*it.qty)}</td>
    <td><button data-a="rm" title="Usuń">✕</button></td>`;
    tr.querySelector('[data-a=inc]').onclick=()=>{changeQty(it.id, +1); renderOrder();};
    tr.querySelector('[data-a=dec]').onclick=()=>{changeQty(it.id, -1); renderOrder();};
    tr.querySelector('[data-a=rm]').onclick=()=>{removeItem(it.id); renderOrder();};
    tbody.appendChild(tr);
  });
  const method = qs('#deliveryMethod')?.value || 'pickup';
  const t = totals(method);
  ['subtotal','delivery','total'].forEach(k=>{
    const el = qs(`#sum-${k}`); if(el) el.textContent = fmt({subtotal:t.sub,delivery:t.del,total:t.total}[k]);
  });
  updateCartCount();
}

document.addEventListener('DOMContentLoaded',()=>{
  // topbar cart count
  updateCartCount();

  // MENU page
  if(window.MENU){ bindMenuButtons(window.MENU); }

  // ORDER page
  if(qs('#order-items')){
    const dm=qs('#deliveryMethod'); if(dm){ dm.onchange=renderOrder; }
    const pay = qs('#payNow'); if(pay){
      pay.onclick=async()=>{
        if(CART.length===0){ alert('Koszyk jest pusty'); return; }
        const method = qs('#deliveryMethod')?.value || 'pickup';
        const payload = { cart: CART, delivery: method==='delivery'?6:0, currency:'pln' };
        const res = await fetch('/.netlify/functions/create-checkout-session', {
          method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)
        });
        if(!res.ok){ alert('Błąd płatności ('+res.status+'): '+await res.text()); return; }
        const data = await res.json(); location.href = data.url;
      };
    }
    const clear = qs('#clearCart'); if(clear){ clear.onclick=()=>{ CART=[]; save(); renderOrder(); }; }
    renderOrder();
  }

  // Remove email ordering button if exists accidentally
  const emailBtn = document.getElementById('emailOrder'); if(emailBtn){ emailBtn.remove(); }
});
