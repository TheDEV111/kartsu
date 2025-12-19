# CrowdStack Frontend

A modern, blockchain-based crowdfunding platform built with Next.js 14, TypeScript, Tailwind CSS, and integrated with Stacks blockchain smart contracts.

## Features

- 🚀 **Next.js 14** with App Router
- 💎 **TypeScript** for type safety
- 🎨 **Tailwind CSS** with optimistic orange theme
- ⛓️ **Stacks Integration** for blockchain transactions
- 🔗 **Hiro Chainhooks** for real-time blockchain event monitoring
- 🗄️ **MongoDB** for event storage and analytics
- 📊 **Real-time Updates** via webhook processing
- 🎯 **Milestone-based Funding** with democratic voting
- 🔒 **Secure** smart contract integration

## Project Structure

```
frontend/
├── app/                        # Next.js 14 App Router
│   ├── api/                   # API Routes
│   │   ├── chainhooks/       # Chainhook management
│   │   ├── campaigns/        # Campaign data APIs
│   │   └── users/            # User data APIs
│   ├── campaigns/            # Campaign pages
│   ├── create/               # Create campaign flow
│   ├── dashboard/            # User dashboard
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/               # Reusable components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── CampaignCard.tsx
│   └── ProgressRing.tsx
├── hooks/                    # React hooks
│   ├── useChainhooks.ts     # Chainhook management
│   └── useCampaigns.ts      # Campaign data fetching
├── lib/                      # Core utilities
│   ├── chainhooks/          # Chainhook client
│   ├── config/              # Configuration
│   ├── db/                  # Database models
│   └── types/               # TypeScript types
├── public/                   # Static assets
├── .env.example             # Environment variables template
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration
└── package.json             # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- MongoDB instance (local or cloud)
- Hiro API key from [platform.hiro.so](https://platform.hiro.so)
- ngrok (for local webhook development)

### Installation

1. **Install dependencies:**

```bash
cd frontend
pnpm install
```

2. **Configure environment variables:**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# Hiro Chainhooks
CHAINHOOKS_API_KEY=your_hiro_api_key
CHAINHOOKS_WEBHOOK_URL=https://your-domain.com/api/chainhooks/webhook
CHAINHOOKS_NETWORK=mainnet
SECRET_KEY=your_secret_key_min_32_chars

# MongoDB
DATABASE_URL=mongodb://localhost:27017/crowdfunding
MONGODB_URI=mongodb://localhost:27017/crowdfunding

# Stacks Network
NEXT_PUBLIC_STACKS_NETWORK=mainnet
NEXT_PUBLIC_CONTRACT_ADDRESS=SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F
NEXT_PUBLIC_CAMPAIGN_CONTRACT=campaign
NEXT_PUBLIC_TRACKER_CONTRACT=contribution-tracker
NEXT_PUBLIC_MILESTONE_CONTRACT=milestone-manager
NEXT_PUBLIC_API_URL=https://api.hiro.so
```

3. **Start MongoDB:**

```bash
# If using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use MongoDB Atlas cloud instance
```

4. **Start development server:**

```bash
pnpm dev
```

5. **Expose webhook endpoint (for local dev):**

```bash
# In another terminal
ngrok http 3000
```

Copy the ngrok HTTPS URL and update `CHAINHOOKS_WEBHOOK_URL` in `.env.local`:

```env
CHAINHOOKS_WEBHOOK_URL=https://abc123.ngrok.io/api/chainhooks/webhook
```

## Chainhooks Setup

The platform uses Hiro Chainhooks to listen for blockchain events in real-time.

### Register Platform Chainhooks

Run this script to register all necessary chainhooks:

```bash
curl -X POST http://localhost:3000/api/chainhooks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "campaign-created",
    "contractId": "SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.campaign",
    "functionName": "create-campaign",
    "eventType": "contract_call"
  }'
```

Or use the batch registration utility (create a script):

```typescript
import { registerPlatformChainhooks } from '@/lib/chainhooks/client';

async function setup() {
  const hooks = await registerPlatformChainhooks();
  console.log('Registered chainhooks:', hooks);
}

setup();
```

### Monitored Events

The platform automatically processes these blockchain events:

- **campaign-created** - New campaign creation
- **contribution-made** - STX contributions
- **funds-claimed** - Successful fund claims
- **refund-processed** - Refund transactions
- **vote-cast** - Milestone voting
- **milestone-released** - Milestone fund releases

## Database Schema

### Collections

- **campaigns** - Campaign metadata and status
- **contributions** - All contributions with amounts
- **milestones** - Milestone definitions and status
- **votes** - Milestone voting records
- **refunds** - Refund transaction records
- **eventlogs** - All blockchain events for debugging

## API Endpoints

### Campaigns

- `GET /api/campaigns` - List campaigns with filters
- `GET /api/campaigns/[id]` - Get specific campaign
- `GET /api/campaigns/[id]/contributions` - Campaign contributions
- `GET /api/campaigns/[id]/milestones` - Campaign milestones

### Users

- `GET /api/users/[address]/contributions` - User contribution history

### Chainhooks

- `GET /api/chainhooks` - List registered chainhooks
- `POST /api/chainhooks` - Register new chainhook
- `GET /api/chainhooks/[uuid]` - Get specific chainhook
- `PUT /api/chainhooks/[uuid]` - Update chainhook
- `DELETE /api/chainhooks/[uuid]` - Delete chainhook
- `POST /api/chainhooks/[uuid]/toggle` - Enable/disable chainhook
- `POST /api/chainhooks/webhook` - Webhook event receiver

## Deployment

### Vercel (Recommended)

1. **Connect to GitHub:**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. **Deploy to Vercel:**

- Import project on [vercel.com](https://vercel.com)
- Configure environment variables
- Deploy

3. **Update webhook URL:**

After deployment, update `CHAINHOOKS_WEBHOOK_URL` with your production URL:

```env
CHAINHOOKS_WEBHOOK_URL=https://your-app.vercel.app/api/chainhooks/webhook
```

### Manual Deployment

```bash
pnpm build
pnpm start
```

## Development

### Run in development mode:

```bash
pnpm dev
```

### Build for production:

```bash
pnpm build
```

### Start production server:

```bash
pnpm start
```

### Lint code:

```bash
pnpm lint
```

## Testing Chainhooks

### Test webhook endpoint:

```bash
curl http://localhost:3000/api/chainhooks/webhook
# Should return: {"status":"ok","message":"Chainhooks webhook endpoint is ready"}
```

### List registered chainhooks:

```bash
curl http://localhost:3000/api/chainhooks
```

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** MongoDB with Mongoose
- **Blockchain:** Stacks (Mainnet)
- **Smart Contracts:** Clarity
- **Blockchain Events:** Hiro Chainhooks
- **State Management:** SWR for data fetching
- **Deployment:** Vercel

## Contract Addresses

**Mainnet:**
- Campaign: `SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.campaign`
- Tracker: `SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.contribution-tracker`
- Milestone: `SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.milestone-manager`

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Stacks Documentation](https://docs.stacks.co)
- [Hiro Chainhooks](https://docs.hiro.so/stacks/chainhooks)
- [Clarity Language](https://docs.stacks.co/clarity)
- [Tailwind CSS](https://tailwindcss.com/docs)

## License

MIT

## Support

For issues and questions:
- GitHub Issues: [Create an issue]
- Email: support@crowdstack.io
- Discord: [Join our community]

---

Built with ❤️ on Stacks blockchain
