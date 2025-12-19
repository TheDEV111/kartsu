# CrowdStack - System Architecture

## Overview

CrowdStack is a full-stack blockchain crowdfunding platform built on the Stacks blockchain with real-time event monitoring, milestone-based funding, and democratic governance.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Homepage   │  │  Campaigns   │  │  Dashboard   │         │
│  │              │  │    Browse    │  │    User      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │            Next.js 14 (App Router)                    │      │
│  │  - Server-side rendering                              │      │
│  │  - React Server Components                            │      │
│  │  - Client Components with hooks                       │      │
│  └──────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       API LAYER (Next.js)                        │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │   Campaigns    │  │   Chainhooks   │  │     Users      │   │
│  │   /api/        │  │   /api/        │  │   /api/users/  │   │
│  │   campaigns    │  │   chainhooks   │  │   [address]    │   │
│  └────────────────┘  └────────────────┘  └────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
         │                       │                       │
         │                       │                       │
         ↓                       ↓                       ↓
┌─────────────────┐   ┌──────────────────┐   ┌─────────────────┐
│    MongoDB      │   │ Hiro Chainhooks  │   │  Stacks RPC     │
│                 │   │                  │   │                 │
│  - campaigns    │   │  Event Router    │   │  Read-only      │
│  - contributions│   │  Webhook Sender  │   │  Contract Calls │
│  - milestones   │   │                  │   │                 │
│  - votes        │   └──────────────────┘   └─────────────────┘
│  - refunds      │            │
│  - eventlogs    │            │ Webhook POST
│                 │            ↓
└─────────────────┘   ┌──────────────────────────────┐
                      │  /api/chainhooks/webhook     │
                      │                              │
                      │  - Verify signature          │
                      │  - Process events            │
                      │  - Update database           │
                      └──────────────────────────────┘
                                 ↑
                                 │ Blockchain Events
                                 │
┌─────────────────────────────────────────────────────────────────┐
│                    STACKS BLOCKCHAIN (Mainnet)                   │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │   campaign     │  │contribution-   │  │  milestone-    │   │
│  │                │  │   tracker      │  │   manager      │   │
│  │ - create       │  │ - record       │  │ - add-milestone│   │
│  │ - contribute   │  │ - claim-refund │  │ - vote         │   │
│  │ - claim-funds  │  │ - get-stats    │  │ - release      │   │
│  │ - refund       │  │ - tiers        │  │ - finalize     │   │
│  └────────────────┘  └────────────────┘  └────────────────┘   │
│                                                                  │
│  Contract Address: SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Layers

### 1. Frontend Layer (Next.js 14)

**Technology Stack:**
- Next.js 14 with App Router
- React 18 with Server Components
- TypeScript for type safety
- Tailwind CSS for styling
- SWR for data fetching

**Key Components:**
- `app/page.tsx` - Homepage with hero and featured campaigns
- `app/campaigns/` - Campaign browsing and detail pages
- `app/create/` - Campaign creation flow
- `app/dashboard/` - User dashboard
- `components/` - Reusable UI components (Header, Footer, Cards, etc.)

**Hooks:**
- `useChainhooks` - Manage chainhook lifecycle
- `useCampaigns` - Fetch campaign data with caching
- `useContributions` - Track user contributions
- `useMilestones` - Monitor milestone status

### 2. API Layer (Next.js API Routes)

**Endpoints:**

**Campaign APIs:**
```
GET    /api/campaigns              - List all campaigns
GET    /api/campaigns/[id]         - Get campaign details
GET    /api/campaigns/[id]/contributions - Get contributions
GET    /api/campaigns/[id]/milestones    - Get milestones
```

**User APIs:**
```
GET    /api/users/[address]/contributions - User contribution history
```

**Chainhook APIs:**
```
GET    /api/chainhooks             - List registered hooks
POST   /api/chainhooks             - Register new hook
GET    /api/chainhooks/[uuid]      - Get specific hook
PUT    /api/chainhooks/[uuid]      - Update hook
DELETE /api/chainhooks/[uuid]      - Delete hook
POST   /api/chainhooks/[uuid]/toggle - Enable/disable hook
POST   /api/chainhooks/webhook     - Receive blockchain events
```

### 3. Event Processing Layer

**Webhook Handler:**
- Location: `app/api/chainhooks/webhook/route.ts`
- Functionality:
  - Verify webhook signature with HMAC-SHA256
  - Parse blockchain transaction data
  - Extract function arguments from contract calls
  - Update MongoDB with event data
  - Handle rollbacks for chain reorganizations

**Event Types Processed:**
1. **campaign-created** → Create campaign record
2. **contribution-made** → Record contribution, update raised amount
3. **funds-claimed** → Mark campaign as successful
4. **refund-processed** → Create refund record, mark contribution as refunded
5. **vote-cast** → Record vote, update milestone vote counts
6. **milestone-released** → Mark milestone as released

### 4. Database Layer (MongoDB)

**Collections:**

**campaigns:**
```javascript
{
  campaignId: Number,
  creator: String,
  title: String,
  description: String,
  goal: Number,
  raised: Number,
  deadline: Number,
  status: Number,
  milestoneEnabled: Boolean,
  backerCount: Number,
  createdAt: Number,
  updatedAt: Number
}
```

**contributions:**
```javascript
{
  campaignId: Number,
  contributor: String,
  amount: Number,
  timestamp: Number,
  txId: String,
  blockHeight: Number,
  rewardTier: Number,
  refunded: Boolean
}
```

**milestones:**
```javascript
{
  campaignId: Number,
  milestoneId: Number,
  title: String,
  description: String,
  amount: Number,
  status: Number,
  yesVotes: Number,
  noVotes: Number,
  totalVoters: Number,
  approved: Boolean,
  releasedAt: Number
}
```

**votes:**
```javascript
{
  campaignId: Number,
  milestoneId: Number,
  voter: String,
  vote: Boolean,
  votingPower: Number,
  timestamp: Number,
  txId: String
}
```

**refunds:**
```javascript
{
  campaignId: Number,
  contributor: String,
  amount: Number,
  timestamp: Number,
  txId: String,
  blockHeight: Number
}
```

**eventlogs:**
```javascript
{
  eventType: String,
  campaignId: Number,
  txId: String,
  blockHeight: Number,
  sender: String,
  data: Mixed,
  processedAt: Date
}
```

### 5. Blockchain Layer (Stacks)

**Smart Contracts:**

**campaign.clar:**
- Campaign creation and lifecycle management
- Contribution acceptance with STX transfers
- All-or-nothing funding model
- Fund claiming for successful campaigns
- Refund processing for failed campaigns
- Campaign status management

**contribution-tracker.clar:**
- Enhanced contribution tracking
- Reward tier calculation (Bronze/Silver/Gold/Platinum)
- Contribution history per user
- Platform-wide analytics
- Refund claim processing

**milestone-manager.clar:**
- Milestone creation and management
- Democratic voting system
- Linear voting power (1 STX = 1 vote)
- 51% approval threshold
- Progressive fund releases
- Deliverable tracking

## Data Flow

### Campaign Creation Flow

```
User → Frontend → Stacks Wallet → Blockchain
                                       ↓
                            create-campaign transaction
                                       ↓
                              Hiro Chainhooks detects
                                       ↓
                            Webhook POST to /api/chainhooks/webhook
                                       ↓
                            MongoDB campaigns.create()
                                       ↓
                            Frontend updates via SWR
```

### Contribution Flow

```
User → Frontend → Stacks Wallet → Blockchain
                                       ↓
                            contribute(campaign-id, amount)
                                       ↓
                              STX transfer executed
                                       ↓
                              Hiro Chainhooks detects
                                       ↓
                            Webhook POST with transaction data
                                       ↓
                            MongoDB:
                              - contributions.create()
                              - campaigns.update({ $inc: { raised, backerCount } })
                                       ↓
                            Frontend updates via SWR
```

### Milestone Voting Flow

```
Backer → Frontend → Stacks Wallet → Blockchain
                                       ↓
                            vote-on-milestone(campaign-id, milestone-id, vote)
                                       ↓
                              Hiro Chainhooks detects
                                       ↓
                            Webhook POST with vote data
                                       ↓
                            MongoDB:
                              - votes.create()
                              - milestones.update({ $inc: { yesVotes/noVotes } })
                                       ↓
                            Frontend updates vote count
                                       ↓
                            If votes >= threshold:
                              Creator can release funds
```

## Security Architecture

### Authentication & Authorization

**Blockchain-based Auth:**
- Users authenticate via Stacks wallet
- No password management required
- Principal (wallet address) is identity

**Authorization Checks:**
- Smart contracts verify caller is campaign creator
- Only contributors can vote on milestones
- Voting power based on contribution amount

### Data Integrity

**Webhook Security:**
```javascript
// Verify HMAC signature
const signature = request.headers.get('x-chainhook-signature');
const hmac = crypto.createHmac('sha256', SECRET_KEY);
hmac.update(rawBody);
const expectedSignature = hmac.digest('hex');
```

**Smart Contract Security:**
- Input validation on all parameters
- Authorization checks (asserts!)
- Reentrancy protection
- Integer overflow prevention
- Comprehensive error handling

### Network Security

**Environment Variables:**
- All sensitive data in `.env.local`
- Never committed to git
- Different values for dev/staging/prod

**HTTPS Only:**
- Webhook endpoint requires HTTPS
- API endpoints served over HTTPS
- ngrok provides SSL for local dev

## Scalability Considerations

### Database Indexing

```javascript
// Indexed fields for fast queries
campaigns: { campaignId: 1 } // unique index
contributions: { campaignId: 1, contributor: 1 }
milestones: { campaignId: 1, milestoneId: 1 }
votes: { campaignId: 1, milestoneId: 1, voter: 1 }
eventlogs: { eventType: 1, txId: 1 }
```

### Caching Strategy

**SWR Client-side Caching:**
- Automatic revalidation
- Optimistic UI updates
- Stale-while-revalidate pattern
- 30-second cache duration

**API Response Caching:**
- Next.js automatic response caching
- Static generation for public pages
- Incremental Static Regeneration (ISR)

### Performance Optimizations

- **Pagination** on campaign listings
- **Lazy loading** for images
- **Server Components** for data fetching
- **Parallel data fetching** with Promise.all
- **Database connection pooling** with Mongoose

## Monitoring & Observability

### Logging

**Webhook Processing:**
```javascript
console.log(`Processing: ${function_name} on ${contract_id}`);
console.log(`✓ Campaign ${campaignId} created`);
console.error('Webhook processing error:', error);
```

**Chainhook Registration:**
```javascript
console.log(`✓ Registered: ${hook.name}`);
console.error(`✗ Failed to register: ${hook.name}`, error);
```

### Error Handling

**API Endpoints:**
- Try-catch blocks on all async operations
- Meaningful error messages
- Proper HTTP status codes (400, 404, 500)

**Webhook Handler:**
- Graceful error handling
- Continue processing on non-fatal errors
- Log all errors for debugging

## Deployment Architecture

### Development Environment

```
Local Machine
├── Next.js (localhost:3000)
├── MongoDB (localhost:27017)
├── ngrok (public HTTPS endpoint)
└── Stacks Mainnet (read-only)
```

### Production Environment

```
Vercel (Next.js)
     │
     ├── Serverless Functions (API Routes)
     ├── Edge Network (Static Assets)
     └── Environment Variables
            │
            ├── MongoDB Atlas (Database)
            ├── Hiro API (Chainhooks)
            └── Stacks Mainnet (Blockchain)
```

## Technology Stack Summary

**Frontend:**
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- SWR

**Backend:**
- Next.js API Routes
- MongoDB + Mongoose
- Hiro Chainhooks Client

**Blockchain:**
- Stacks Blockchain (Mainnet)
- Clarity Smart Contracts
- @stacks/transactions

**DevOps:**
- Vercel (Hosting)
- MongoDB Atlas (Database)
- ngrok (Local webhooks)
- Git + GitHub (Version control)

## Integration Points

### External Services

**Hiro Platform:**
- API Key authentication
- Chainhooks service
- Event webhooks
- Rate limiting: 100 requests/minute

**Stacks RPC:**
- Read-only contract calls
- Transaction broadcasting
- Block data queries
- Network: api.hiro.so

**MongoDB Atlas:**
- Database hosting
- Automatic backups
- Monitoring & alerts
- Connection pooling

## Future Enhancements

### Phase 2
- [ ] NFT rewards for backers
- [ ] Quadratic voting mechanism
- [ ] Multi-signature releases
- [ ] Campaign templates
- [ ] Social sharing

### Phase 3
- [ ] Mobile applications
- [ ] Cross-chain support
- [ ] DAO governance
- [ ] Insurance fund
- [ ] Advanced analytics

---

**Last Updated:** December 19, 2025
**Version:** 1.0.0
