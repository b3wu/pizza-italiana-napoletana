
Instrukcja:
1) W Netlify env ustaw: STRIPE_SECRET_KEY (sk_test...), SUCCESS_URL, CANCEL_URL (opcjonalnie).
2) Deploy z Git (Import from Git) albo Netlify CLI: netlify deploy --prod
3) Po deployu sprawdź:
   - /assets/css/styles.css -> 200
   - /assets/js/script.js -> 200
   - /.netlify/functions/create-checkout-session -> 405
4) Dodaj pozycje do koszyka -> Zapłać online -> Stripe Checkout (karta test 4242 4242 4242 4242).
