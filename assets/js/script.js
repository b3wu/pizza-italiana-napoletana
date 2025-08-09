document.getElementById('pay').onclick=async()=>{
  const res = await fetch('/.netlify/functions/create-checkout-session', {method:'POST',headers:{'Content-Type':'application/json'}, body: JSON.stringify({cart:[{name:"Margherita",price:28,qty:1}], delivery:0, currency:'pln'})});
  if(!res.ok){alert('err '+await res.text()); return;}
  const data = await res.json(); location.href = data.url;
};