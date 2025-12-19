# Crowdfunding Platform - Product Requirements Document (PRD)

## Executive Summary

A blockchain-based crowdfunding platform with milestone-based fund releases and transparent contribution tracking, built on the Stacks blockchain using Clarity smart contracts.

---

## Product Overview

### Vision
Create a trustless, transparent crowdfunding platform where creators can raise funds and backers have democratic control over milestone-based fund releases through governance voting.

### Mission
Enable secure, transparent crowdfunding with backer protection through milestone-based releases and community governance.

### Target Users
1. **Project Creators**: Entrepreneurs, developers, artists seeking funding
2. **Backers**: Investors and supporters who want transparency and control
3. **Platform Administrators**: Monitors and analytics users

---

## Core Features

### 1. Campaign Management

#### Create Funding Campaigns
- **Goal Setting**: Define funding targets in STX
- **Deadline Management**: Set campaign duration (max 1 year)
- **Rich Content**: Title, description, image, video, category
- **Milestone Option**: Enable/disable milestone-based releases
- **Metadata Storage**: Store campaign information on-chain

#### Campaign Lifecycle
- **Active State**: Accept contributions until deadline
- **Success State**: Goal met, funds claimable
- **Failed State**: Goal not met, refunds available
- **Cancelled State**: Creator cancellation with refunds

### 2. Contribution System

#### Make Contributions
- **Flexible Amounts**: Contribute any amount to active campaigns
- **Multiple Contributions**: Same user can contribute multiple times
- **Real-time Tracking**: Instant contribution recording
- **Contribution History**: Complete transaction history per user

#### Reward Tiers
- **Bronze Tier**: < 100 STX contributions
- **Silver Tier**: 100+ STX contributions
- **Gold Tier**: 1,000+ STX contributions
- **Platinum Tier**: 10,000+ STX contributions

#### Contribution Analytics
- **Per Campaign**: Total raised, contributor count, average contribution
- **Per Contributor**: Total contributed, campaigns backed, success rate
- **Platform-wide**: Total contributions, total backers

### 3. Milestone-Based Fund Release

#### Milestone Creation
- **Title & Description**: Detailed milestone information
- **Amount Allocation**: Define fund amount per milestone
- **Voting Duration**: Set voting period for approval
- **Deliverables**: Submit proof of completion

#### Democratic Voting
- **Voting Power**: Based on contribution amount (linear)
- **Approval Threshold**: 51% yes votes required
- **Voting Period**: Time-limited voting window
- **Vote Recording**: Immutable vote tracking
- **Results**: Transparent vote tallies

#### Fund Release
- **Conditional Release**: Only after approval
- **Progressive Distribution**: Stage-by-stage fund release
- **Completion Tracking**: Monitor milestone progress
- **Deliverable Submission**: Creators submit proof

### 4. Refund Mechanism

#### Automatic Refunds
- **Failed Campaigns**: Goal not met by deadline
- **Cancelled Campaigns**: Creator cancellation
- **Individual Claims**: Each backer claims their refund
- **Refund Tracking**: Record all refund transactions

#### Refund Protection
- **No Double Refunds**: Prevent duplicate claims
- **Amount Verification**: Match contribution amounts
- **Status Checking**: Only for eligible campaigns

### 5. Campaign Updates & Communication

#### Update System
- **Progress Updates**: Creator posts to backers
- **Milestone Updates**: Status changes and completions
- **Deliverable Submissions**: Proof of work
- **Deadline Extensions**: Notify of timeline changes

---

## Smart Contracts Architecture

### 1. Campaign Contract (`campaign.clar`)

#### Responsibilities
- Campaign creation and management
- Contribution acceptance
- Fund claiming for successful campaigns
- Refund processing for failed campaigns
- Campaign status management

#### Key Data Structures
```clarity
campaigns: {
    creator: principal,
    title: string-ascii,
    description: string-utf8,
    goal: uint,
    raised: uint,
    deadline: uint,
    status: uint,
    created-at: uint,
    claimed: bool,
    milestone-enabled: bool
}
```

#### Public Functions
- `create-campaign`: Launch new campaign
- `contribute`: Make contribution
- `claim-funds`: Claim successful campaign funds
- `refund`: Claim refund for failed campaign
- `cancel-campaign`: Cancel active campaign
- `extend-deadline`: Extend campaign deadline

### 2. Contribution Tracker Contract (`contribution-tracker.clar`)

#### Responsibilities
- Detailed contribution tracking
- Contributor statistics
- Reward tier management
- Refund claim processing
- Platform analytics

#### Key Data Structures
```clarity
contribution-details: {
    total-amount: uint,
    contribution-count: uint,
    first-contribution: uint,
    last-contribution: uint,
    refunded: bool,
    reward-tier: uint
}

campaign-contributions: {
    total-raised: uint,
    contributor-count: uint,
    contribution-count: uint,
    average-contribution: uint,
    largest-contribution: uint,
    largest-contributor: optional principal
}
```

#### Public Functions
- `record-contribution`: Track contributions
- `claim-refund`: Process refunds
- `add-reward-tier`: Create reward tiers
- `increment-successful-campaigns`: Update stats
- `get-contribution-details`: Query contributions

### 3. Milestone Manager Contract (`milestone-manager.clar`)

#### Responsibilities
- Milestone creation and management
- Voting system implementation
- Vote tallying and approval
- Fund release control
- Deliverable tracking

#### Key Data Structures
```clarity
milestones: {
    title: string-ascii,
    description: string-utf8,
    amount: uint,
    status: uint,
    created-at: uint,
    voting-deadline: uint,
    released-at: optional uint,
    creator: principal
}

milestone-votes: {
    yes-votes: uint,
    no-votes: uint,
    total-voters: uint,
    total-voting-power: uint,
    voting-start: uint,
    voting-end: uint,
    approved: bool
}
```

#### Public Functions
- `initialize-milestone-campaign`: Enable milestones
- `add-milestone`: Create milestone
- `start-milestone-voting`: Begin voting
- `vote-on-milestone`: Cast vote
- `finalize-milestone-vote`: Complete voting
- `release-milestone-funds`: Release approved funds
- `submit-milestone-deliverables`: Submit proof

---

## Frontend Design Guide

### Design System

#### Color Palette
- **Primary**: Optimistic Orange (#F97316)
- **Success**: Green (#10B981) for funded campaigns
- **Warning**: Yellow (#F59E0B) for ending soon
- **Danger**: Red (#EF4444) for failed/cancelled
- **Background**: Light gray (#F9FAFB)
- **Text**: Dark gray (#111827)

#### Typography
- **Font Family**: Nunito (friendly, approachable)
- **Headings**: Bold weights (700-800)
- **Body**: Regular weight (400)
- **Captions**: Light weight (300)

#### Spacing & Layout
- **Container**: Max-width 1280px
- **Grid**: 12-column responsive grid
- **Padding**: 16px mobile, 24px tablet, 32px desktop
- **Border Radius**: 8px for cards, 16px for modals

### Page Layouts

#### 1. Homepage
**Components:**
- Hero section with featured campaign
- Campaign categories (Technology, Art, Games, etc.)
- Trending campaigns grid
- Recently funded campaigns
- Platform statistics banner
- Footer with links

**Layout:**
```
[Hero Featured Campaign]
[Categories Filter Bar]
[Campaign Grid - 3 columns]
[Platform Stats]
[Footer]
```

#### 2. Campaign Page
**Components:**
- Campaign hero (image, video)
- Funding progress ring
- Campaign details
- Contribution tiers/rewards
- Milestone timeline
- Contribute button/modal
- Update feed
- Creator information

**Layout:**
```
[Hero Image/Video]
[Progress Ring]  [Campaign Info]
[Rewards Tiers]
[Milestone Timeline]
[Updates Feed]
[Creator Profile]
```

#### 3. Create Campaign Page
**Components:**
- Multi-step form (4 steps)
  1. Basic info (title, description, goal)
  2. Media (image, video)
  3. Rewards (optional tiers)
  4. Milestones (optional)
- Progress indicator
- Save draft functionality
- Preview button

#### 4. Creator Dashboard
**Components:**
- Campaign overview cards
- Funding progress charts
- Backer list with stats
- Milestone management
- Update posting interface
- Analytics dashboard

#### 5. Backer Portal
**Components:**
- Contribution history
- Backed campaigns list
- Voting dashboard (pending votes)
- Refund claims
- Statistics (total backed, success rate)

### Key UI Elements

#### Campaign Hero
```
[Large Campaign Image]
[Campaign Title - 32px bold]
[Creator Avatar + Name]
[Category Badge]
```

#### Funding Progress Ring
```
  ┌─────────┐
  │  ╱█████╲ │
  │ █   75% █│
  │  ╲█████╱ │
  └─────────┘
  $7,500 of $10,000
  123 backers
```

#### Contribution Tiers Card
```
┌─────────────────────┐
│ 🥉 Bronze - 10 STX │
│                     │
│ • Digital thank you │
│ • Name in credits   │
│                     │
│ [Select Tier]       │
└─────────────────────┘
```

#### Milestone Timeline
```
✓ Phase 1: Complete
│ $2,000 released
│
● Phase 2: Voting
│ Vote ends in 3 days
│ 65% approved
│
○ Phase 3: Pending
│ $3,000
```

#### Contribute Modal
```
┌─────────────────────────┐
│ Support this project    │
│                         │
│ Amount: [___] STX       │
│                         │
│ Select Reward:          │
│ ○ Bronze (10+ STX)      │
│ ○ Silver (100+ STX)     │
│ ○ Gold (1,000+ STX)     │
│                         │
│ [Cancel] [Contribute]   │
└─────────────────────────┘
```

---

## Chainhooks Integration

### Event Monitoring

#### Campaign Events
```typescript
{
  "campaign-created": {
    campaign_id: uint,
    creator: principal,
    goal: uint,
    deadline: uint,
    milestone_enabled: bool
  },
  
  "contribution-made": {
    campaign_id: uint,
    contributor: principal,
    amount: uint,
    timestamp: uint
  },
  
  "goal-reached": {
    campaign_id: uint,
    final_amount: uint,
    backer_count: uint
  },
  
  "campaign-completed": {
    campaign_id: uint,
    status: "successful" | "failed",
    total_raised: uint
  }
}
```

#### Milestone Events
```typescript
{
  "milestone-created": {
    campaign_id: uint,
    milestone_id: uint,
    amount: uint
  },
  
  "voting-started": {
    campaign_id: uint,
    milestone_id: uint,
    voting_end: uint
  },
  
  "vote-cast": {
    campaign_id: uint,
    milestone_id: uint,
    voter: principal,
    vote: "yes" | "no",
    voting_power: uint
  },
  
  "milestone-released": {
    campaign_id: uint,
    milestone_id: uint,
    amount: uint,
    recipient: principal
  }
}
```

#### Refund Events
```typescript
{
  "refund-processed": {
    campaign_id: uint,
    contributor: principal,
    amount: uint,
    timestamp: uint
  }
}
```

### Real-time Updates

#### WebSocket Integration
```typescript
// Connect to Chainhooks WebSocket
const ws = new WebSocket('wss://api.hiro.so/chainhooks');

// Subscribe to campaign events
ws.send({
  action: 'subscribe',
  events: ['contribution-made', 'goal-reached']
});

// Handle incoming events
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateFundingProgress(data);
};
```

#### Frontend State Updates
- Update funding progress bar on contribution
- Refresh milestone status on vote
- Show notification on goal reached
- Update campaign status on completion
- Display refund availability

---

## User Flows

### Flow 1: Create and Fund Campaign

```mermaid
Creator → Create Campaign → Set Goal & Deadline → Add Milestones (optional)
                                                            ↓
Backer → Browse Campaigns → Select Campaign → Choose Reward Tier → Contribute
                                                            ↓
Platform → Track Progress → Goal Reached → Notify Creator & Backers
```

### Flow 2: Milestone Voting and Release

```mermaid
Creator → Complete Milestone → Submit Deliverables → Start Voting
                                                            ↓
Backers → Review Deliverables → Cast Votes → Voting Period Ends
                                                            ↓
Platform → Tally Votes → Milestone Approved → Release Funds → Creator Receives
```

### Flow 3: Failed Campaign Refund

```mermaid
Campaign → Deadline Passes → Goal Not Met → Status: Failed
                                                    ↓
Backer → Check Campaign → Claim Refund → Receive STX Back
```

---

## Technical Specifications

### Blockchain
- **Network**: Stacks Blockchain
- **Language**: Clarity
- **Epoch**: 3.0
- **Token**: STX

### Performance Requirements
- **Transaction Confirmation**: < 10 minutes
- **Contract Execution**: < 5 seconds
- **Read Operations**: < 1 second
- **Concurrent Users**: Support 1000+ simultaneous

### Security Requirements
- Input validation on all functions
- Authorization checks on sensitive operations
- Reentrancy protection
- Integer overflow prevention
- Comprehensive error handling

### Scalability Considerations
- Efficient data structures
- Minimal storage usage
- Optimized contract calls
- Event-driven architecture

---

## Success Metrics

### Platform KPIs
- Total campaigns created
- Total funds raised
- Success rate (funded / total)
- Active backers
- Average contribution amount

### User Engagement
- Campaign views
- Contribution rate
- Voting participation
- Creator retention
- Backer return rate

### Technical Metrics
- Contract execution time
- Gas costs
- Error rate
- System uptime

---

## Future Enhancements

### Phase 2 Features
- NFT rewards for backers
- Quadratic voting mechanism
- Multi-signature milestone releases
- Campaign templates
- Social sharing integration

### Phase 3 Features
- Cross-chain compatibility
- DAO governance for platform
- Automated market maker for liquidity
- Insurance fund for backers
- Mobile applications (iOS/Android)

---

## Compliance & Legal

### Considerations
- Securities regulations compliance
- KYC/AML requirements (jurisdiction dependent)
- Terms of service
- Privacy policy
- Intellectual property rights
- Dispute resolution mechanism

---

## Deployment Plan

### Phase 1: Development (Current)
- ✅ Smart contract development
- ✅ Comprehensive testing
- ✅ Security review
- ✅ Documentation

### Phase 2: Testing
- Testnet deployment
- Frontend integration
- User acceptance testing
- Bug fixes and optimization

### Phase 3: Launch
- Mainnet deployment
- Marketing campaign
- User onboarding
- Community building
- Support infrastructure

---

## Conclusion

This crowdfunding platform provides a complete, secure, and user-friendly solution for blockchain-based fundraising with unique features like milestone-based releases and democratic governance that set it apart from traditional platforms.

The combination of three specialized smart contracts ensures modularity, security, and scalability while providing comprehensive functionality for both creators and backers.

---

**Document Version**: 1.0  
**Last Updated**: December 19, 2025  
**Status**: Implementation Complete
