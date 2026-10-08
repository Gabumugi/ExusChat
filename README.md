# Nexus — Passwordless P2P Chat

A decentralized, encrypted, browser-only chat with file sharing.
No accounts. No servers. No logs. Just a link.

## Features

- 🚫 **No signup** — identity is a random UUID in `localStorage`
- 🔒 **End-to-end encryption** — AES-GCM 256, PBKDF2 600k iterations
- 🕸️ **Decentralized** — WebRTC data channels signaled via BitTorrent trackers
- 📎 **File sharing** — videos, PDFs, images, audio, ZIPs, anything up to 200 MB
- 🖼️ **Inline previews** — images, videos, and audio render in-chat
- 🌗 **Dark / light** — theme follows your preference
- 📱 **PWA** — installable, works offline for the shell
- 💨 **Ephemeral** — refresh and it's gone

## Deploy to Render (free static hosting)

1. Push these files to a Git repository.
2. In Render Dashboard, click **New → Static Site**.
3. Connect the repo.
4. Set **Publish directory** to `.` (or `/`).
5. Set **Build command** to empty.
6. Click **Create Static Site**.
7. Render picks up `render.yaml` automatically for headers and rewrites.

## Configure a TURN server (recommended)

By default, Nexus uses Google's free STUN servers. About 15–20% of users
on symmetric NATs (mobile 4G/5G, corporate WiFi) won't be able to connect
without a TURN relay.

Free / cheap options:

- **Metered.ca** — 50 GB/month free TURN
- **Twilio Network Traversal** — pay-as-you-go, $0.40/1000 GB
- **Cloudflare Calls** — free tier available
- **Self-host coturn** — most control, requires a small VPS

Once you have credentials, edit `index.html` and set:

```js
const TURN_CONFIG = {
  urls: 'turn:your-turn.example.com:3478',
  username: 'your-username',
  credential: 'your-credential',
};