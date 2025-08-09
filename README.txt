
Flat-root deploy (Netlify):
1) Ten folder wrzuć do repo lub użyj Netlify CLI (polecane bez Gita): netlify deploy --prod
2) Ustaw env: STRIPE_SECRET_KEY (sk_test...), SUCCESS_URL, CANCEL_URL.
3) Wejdź na /.netlify/functions/create-checkout-session -> 405 (OK), potem test płatności.
