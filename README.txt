
Jak wdrożyć (działa Stripe + koszyk):
1) Ustaw w Netlify zmienne: STRIPE_SECRET_KEY, SUCCESS_URL=https://pizza-italiana-napoletana.netlify.app/success.html, CANCEL_URL=https://pizza-italiana-napoletana.netlify.app/cancel.html
2) Zdeployuj przez Git albo Netlify CLI (drag&drop nie uruchomi Functions).
3) Sprawdź: /.netlify/functions/create-checkout-session -> 405 (OK). Potem "Zapłać online".
Karta testowa: 4242 4242 4242 4242.
