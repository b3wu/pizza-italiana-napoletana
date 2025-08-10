# Pizza Italiana Napoletana — Supabase + Stripe + Admin

## Env w Netlify
- STRIPE_SECRET_KEY (secret)
- STRIPE_WEBHOOK_SECRET (secret, po dodaniu webhooka w Stripe)
- SUPABASE_URL = https://uovwtfpclmmnynmodbgc.supabase.co
- SUPABASE_SERVICE_ROLE_KEY (secret)

## Deploy
1. W Supabase → SQL → uruchom `schema.sql`.
2. W Netlify ustaw Env (powyżej) i zdeployuj.
3. Stripe → Webhooks → Add endpoint: `https://TWOJA-DOMENA.netlify.app/.netlify/functions/stripe-webhook`, event: `checkout.session.completed`. Skopiuj Signing secret do `STRIPE_WEBHOOK_SECRET`.
4. Test: dodaj z menu, wypełnij formularz zamówienia, zapłać (4242 4242 4242 4242). Po sukcesie status `paid` będzie widoczny w /admin.

## Strony
- `/` — start
- `/menu.html` — menu i dodawanie do koszyka
- `/order.html` — dane klienta + płatność Stripe
- `/admin.html` — lista zamówień (pobiera z Supabase, zmiana statusu przez Function)