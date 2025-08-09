
Deploy (Stripe only):
1) W Netlify ustaw STRIPE_SECRET_KEY, SUCCESS_URL, CANCEL_URL (zrobiłeś).
2) Zdeployuj z repo albo przez Netlify CLI (drag&drop nie uruchomi Functions).
3) Po deployu wejdź na /.netlify/functions/create-checkout-session (powinno zwrócić 'Method Not Allowed').
4) Na stronie dodaj pozycje do koszyka -> 'Zapłać online' -> Stripe Checkout (test: 4242 4242 4242 4242).
