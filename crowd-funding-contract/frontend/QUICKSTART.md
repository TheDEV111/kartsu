# CrowdStack Frontend - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
cd frontend
pnpm install
```

### 2. Setup Environment

```bash
cp .env.example .env.local
```

**Required Environment Variables:**

```env
# Get from https://platform.hiro.so
CHAINHOOKS_API_KEY=your_hiro_api_key_here

# Generate random 32+ character string
SECRET_KEY=your_random_secret_key_min_32_characters

# MongoDB connection
DATABASE_URL=mongodb://localhost:27017/crowdfunding

# For local development, use ngrok URL (see step 4)
CHAINHOOKS_WEBHOOK_URL=http://localhost:3000/api/chainhooks/webhook
```

### 3. Start MongoDB

**Option A: Docker (Recommended)**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: Local Installation**
```bash
brew install mongodb-community  # macOS
sudo apt-get install mongodb    # Ubuntu
```

**Option C: MongoDB Atlas (Cloud)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string
- Update `DATABASE_URL` in `.env.local`

### 4. Start Development Server

```bash
pnpm dev
```

Server runs at http://localhost:3000

### 5. Expose Webhook (for local dev)

**In another terminal:**

```bash
# Install ngrok
npm install -g ngrok

# Expose port 3000
ngrok http 3000
```

**Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`) and update `.env.local`:

```env
CHAINHOOKS_WEBHOOK_URL=https://abc123.ngrok.io/api/chainhooks/webhook
```

**Restart the dev server** for changes to take effect.

### 6. Register Chainhooks

```bash
node scripts/setup-chainhooks.js
```

This registers 6 chainhooks for monitoring blockchain events.

## ✅ Verify Setup

### Test Webhook Endpoint

```bash
curl http://localhost:3000/api/chainhooks/webhook
```

Expected response:
```json
{
  "status": "ok",
  "message": "Chainhooks webhook endpoint is ready"
}
```

### List Registered Chainhooks

```bash
curl http://localhost:3000/api/chainhooks
```

Should return array of 6 chainhooks.

### Check Homepage

Open http://localhost:3000 - you should see the CrowdStack homepage.

## 🎯 Next Steps

### 1. Connect Wallet Integration

Install Stacks Connect:

```bash
pnpm add @stacks/connect-react
```

Add provider in `app/layout.tsx`.

### 2. Test with Real Campaign

- Create a test campaign on mainnet
- Contribute small amount (1-10 STX)
- Check database for events
- Verify webhook processing in logs

### 3. Deploy to Production

**Deploy to Vercel:**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

- Go to vercel.com
- Import repository
- Add environment variables
- Deploy

**Update webhook URL** with production URL:

```env
CHAINHOOKS_WEBHOOK_URL=https://your-app.vercel.app/api/chainhooks/webhook
```

**Re-register chainhooks** with production URL.

## 📚 Key Files to Know

- `app/page.tsx` - Homepage
- `app/api/chainhooks/webhook/route.ts` - Webhook handler
- `lib/chainhooks/client.ts` - Chainhook utilities
- `lib/db/models.ts` - Database schemas
- `components/` - Reusable UI components

## 🐛 Troubleshooting

### "Database connection failed"
- Check MongoDB is running: `docker ps` or `brew services list`
- Verify DATABASE_URL in `.env.local`

### "Webhook not receiving events"
- Ensure ngrok is running and URL is updated
- Check CHAINHOOKS_API_KEY is valid
- Verify chainhooks are registered: `curl http://localhost:3000/api/chainhooks`

### "Module not found" errors
- Run `pnpm install` again
- Delete `node_modules` and `.next` folders, reinstall

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
pnpm dev -p 3001
```

## 🔗 Resources

- [Full Documentation](./README.md)
- [Hiro Platform](https://platform.hiro.so)
- [Stacks Explorer](https://explorer.stacks.co)
- [Contract Addresses](./README.md#contract-addresses)

## 💬 Support

Issues? Questions?
- Create GitHub issue
- Check logs: `docker logs mongodb` or console output
- Review webhook endpoint health: `/api/chainhooks/webhook`

---

Happy building! 🎉
