
Instrukcja (FULL + Stripe, bez bazy):
1) W Netlify dodaj zmienne: STRIPE_SECRET_KEY (Secret), SUCCESS_URL, CANCEL_URL.
   Domyślne: https://pizza-italiana-napoletana.netlify.app/success.html i /cancel.html
2) Zdeployuj przez Netlify CLI albo Import from Git (drag&drop samych plików statycznych nie uruchomi Functions).
3) Test: /.netlify/functions/create-checkout-session → 405 (OK). Na stronie: koszyk → Zapłać online.
Karta testowa: 4242 4242 4242 4242 (dowolna data/CVC).
