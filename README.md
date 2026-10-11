# TosCheZy — Passwordless P2P Chat

A decentralized, encrypted, browser-only chat with file sharing.
No accounts. No servers. No logs. Just a link.

## Features

- 🚫 **No signup** — identity is a random UUID in `localStorage`
- 🔒 **End-to-end encryption** — AES-GCM 256, PBKDF2 100k iterations
- 🕸️ **Decentralized** — WebRTC data channels signaled via BitTorrent trackers
- 💬 **Multiple rooms** — create as many as you like, switch instantly
- 📨 **Direct messages** — click a peer's name to open a DM
- 📎 **File sharing** — videos, PDFs, images, audio, ZIPs, up to 200 MB
- 🖼️ **Inline previews** — images, videos, and audio render in-chat
- ✏️ **Editable nicknames** — change anytime, live across all rooms
- 🌗 **Dark / light** — theme follows your preference
- 📱 **PWA** — installable, works offline for the shell
- 💨 **Ephemeral** — refresh and messages are gone

## Our Policy

> This is a **decentralized app**. Even the developer cannot access the contents
> exchanged between users.
>
> The existence of this app depends **purely on its users**. Everything is stored
> locally, therefore **each and every user is a node** that enhances the existence
> of this app.
>
> The app **cannot be shut down** in any way, since it is decentralized. The
> developer can only provide new updates to the same app.
>
> **Feel secure. Feel secret. Share anything.**

### What this means in practice

- Messages and files are **end-to-end encrypted** in your browser before they
  leave your device.
- There is **no central server** — the developer has nothing to hand over.
- No accounts, no tracking, no logs. Refreshing clears your local session.
- Your browser is the client and the node. Every copy of this page strengthens
  the network.

## Deploy to Render (free static hosting)

1. Push these files to a Git repository.
2. In Render Dashboard, click **New → Static Site**.
3. Connect the repo.
4. Set **Publish directory** to `.` (or `/`).
5. Leave **Build command** empty.
6. Click **Create Static Site**.
7. Render picks up `render.yaml` automatically for headers and rewrites.

## Configure a TURN server (recommended)

By default, TosCheZy uses Google's free STUN servers. About 15–20% of
users on symmetric NATs (mobile 4G/5G, corporate WiFi) won't be able to
connect without a TURN relay.

Free / cheap options:

- **Metered.ca** — 50 GB/month free TURN
- **Twilio Network Traversal** — pay-as-you-go
- **Cloudflare Calls** — free tier available
- **Self-host coturn** — most control

Once you have credentials, edit `index.html` and set:

```js
const TURN_CONFIG = {
  urls: 'turn:your-turn.example.com:3478',
  username: 'your-username',
  credential: 'your-credential',
};