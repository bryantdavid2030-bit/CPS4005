# Deploy the Worker without a terminal

If you don't want to install Wrangler or open a terminal, you can
deploy the Worker entirely from the Cloudflare dashboard using the
web code editor. This works for anyone with a Cloudflare account.

## One-time setup

1. **Cloudflare account** — https://dash.cloudflare.com/sign-up (free)
2. **Resend account** — https://resend.com/signup (free)
3. **Resend API key** — Resend → API Keys → Create. Permission:
   **Sending access**. Copy the `re_...` key.

## Deploy

1. Go to <https://dash.cloudflare.com> → **Workers & Pages** →
   **Create** → **Create Worker**
2. Name it `humnsprt-enquiries` → **Deploy** (accept the default
   hello-world code for now)
3. On the Worker's page click **Edit code**
4. In the editor, select all the code (Ctrl/Cmd+A), delete it,
   then paste the entire contents of [`index.js`](./index.js)
5. Click **Deploy** (top right)

## Configure

Back on the Worker's overview page:

1. Click **Settings** → **Variables and Secrets** (or **Variables**)
2. Add four variables:

   | Name              | Type     | Value                                          |
   |-------------------|----------|------------------------------------------------|
   | `RESEND_API_KEY`  | Secret   | your `re_...` key from Resend                  |
   | `RESEND_FROM`     | Text     | `Humn Sprt <onboarding@resend.dev>`            |
   | `RESEND_TO`       | Text     | the inbox you want enquiries delivered to      |
   | `ALLOWED_ORIGINS` | Text     | `*`                                            |

   `RESEND_FROM` uses Resend's free shared sender until you verify
   `humnsprt.com`. Once verified, change this to
   `Humn Sprt <enquiries@humnsprt.com>`.

3. Click **Deploy** again so the variables take effect.

## Test it

At the top of the Worker page, copy the URL. It looks like:

```
https://humnsprt-enquiries.<your-subdomain>.workers.dev
```

Open `<that-url>/health` in your browser. You should see:

```
{"ok":true}
```

If you see that, the Worker is live.

## Point the app at it

In your root `.env` file, set:

```env
EXPO_PUBLIC_ENQUIRY_ENDPOINT=https://humnsprt-enquiries.<your-subdomain>.workers.dev/enquiries
```

(Note the `/enquiries` suffix — the Worker routes `/enquiries` to the
email handler, and `/health` to the liveness probe.)

Restart Metro and submit a test enquiry from the app. The email
should land in your `RESEND_TO` inbox within seconds.
