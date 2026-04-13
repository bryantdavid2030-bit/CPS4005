# Humn Sprt — Enquiry Worker

A small Cloudflare Worker that accepts JSON enquiries from the mobile
app and forwards them to `hello@humnsprt.com` via [Resend](https://resend.com).

## Why this stack

| Concern | Choice | Why |
|---|---|---|
| Public endpoint | Cloudflare Workers | 100k req/day free, no cold starts, secrets stay server-side, sub-50ms globally |
| Email delivery | Resend | 3,000 emails/month free, modern JSON API, DKIM/SPF from dashboard, top-tier deliverability |
| Validation | Hand-rolled | Zero deps, fast, predictable |
| Spam control | Honeypot + CF rate-limit | No CAPTCHA, no friction |

The Resend API key is stored as a Worker secret (`wrangler secret put`)
and **never** ships in the mobile bundle. The app only knows the
public Worker URL.

## Endpoints

| Method | Path           | Purpose                |
|--------|----------------|------------------------|
| `POST` | `/enquiries`   | Submit a new enquiry   |
| `GET`  | `/health`      | Liveness probe         |
| `OPTIONS` | (any)       | CORS preflight         |

### Request body (`POST /enquiries`)

```json
{
  "type": "individual",
  "clientName": "Jane Doe",
  "email": "jane@example.com",
  "message": "Looking for a strength coach in London for 8 weeks.",
  "coachId": "c-001",
  "phone": "+44 7700 900000",
  "organisation": "Example Hotel",
  "startDate": "2026-05-01"
}
```

`type`, `clientName`, `email`, and `message` are required.
`message` must be 10–4000 chars. `email` must look like an email.
A `website` field is treated as a honeypot — populated requests
silently succeed (returning `{ ok: true }`) so bots get no signal.

### Responses

| Status | Body | Meaning |
|---|---|---|
| `200` | `{ "ok": true }` | Email sent |
| `400` | `{ "error": "..." }` | Validation failed |
| `404` | `{ "error": "Not found" }` | Wrong route/method |
| `413` | `{ "error": "Payload too large" }` | Body > 16 KB |
| `502` | `{ "error": "Upstream email error" }` | Resend rejected the call |
| `500` | `{ "error": "Unexpected error" }` | Worker exception |

## First-time setup

1. **Create a Resend account** at <https://resend.com> (no card needed).
2. **Verify a sending domain** — add the DKIM + SPF records Resend gives
   you to your DNS for `humnsprt.com`. This takes ~5 min once DNS
   propagates.
3. **Create an API key** in the Resend dashboard. Copy it — you'll
   only see it once.
4. **Install Wrangler** locally:
   ```bash
   npm install -g wrangler   # or: brew install cloudflare-wrangler
   wrangler login            # opens browser, log in to Cloudflare
   ```
5. **Install worker deps:**
   ```bash
   cd worker
   npm install
   ```
6. **Set the secret:**
   ```bash
   wrangler secret put RESEND_API_KEY
   # paste the Resend key when prompted
   ```
7. **Adjust `wrangler.toml`** if your sender or destination addresses
   differ from the defaults.
8. **Deploy:**
   ```bash
   npm run deploy
   ```
   Wrangler prints the live URL, e.g.
   `https://humnsprt-enquiries.<your-account>.workers.dev`.

9. **Wire the app** by adding to `.env` at the repo root:
   ```env
   EXPO_PUBLIC_ENQUIRY_ENDPOINT=https://humnsprt-enquiries.<your-account>.workers.dev/enquiries
   ```
   Restart Metro and the app will POST to the Worker.

## Custom domain (optional but recommended)

Once `humnsprt.com` is on Cloudflare, uncomment the `[[routes]]`
block in `wrangler.toml` and redeploy. Your endpoint becomes
`https://api.humnsprt.com/enquiries`.

## Local dev

```bash
cd worker
npm run dev
# Worker runs at http://127.0.0.1:8787
```

Test with:

```bash
curl -X POST http://127.0.0.1:8787/enquiries \
  -H 'Content-Type: application/json' \
  -d '{"type":"individual","clientName":"Test","email":"t@e.com","message":"hello world enough chars"}'
```

In dev, secrets come from a local `.dev.vars` file:

```env
RESEND_API_KEY=re_xxxxx
```

(Add `.dev.vars` to your global gitignore — never commit secrets.)

## Logs and observability

```bash
npm run tail
```

Streams structured logs from the live Worker. CF dashboard also
shows request volume, p50/p99, and error rates under
**Workers & Pages → humnsprt-enquiries → Observability**.

## Cost expectations

| Layer | Free tier | Likely usage at launch | Cost |
|---|---|---|---|
| Cloudflare Workers | 100,000 req/day | < 1,000 / day | £0 |
| Resend | 3,000 / month, 100 / day | < 100 / day | £0 |

You stay on free tiers comfortably until you're doing thousands of
enquiries a day.
