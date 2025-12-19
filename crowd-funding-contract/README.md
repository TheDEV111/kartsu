# Crowdfunding Platform - Smart Contracts

A professional blockchain-based crowdfunding platform built on Stacks with milestone-based fund releases and transparent contribution tracking.

## 🎯 Overview

This crowdfunding platform implements a complete solution for creating and managing fundraising campaigns with built-in governance, milestone tracking, and contributor rewards. The system uses three interconnected smart contracts to handle all aspects of crowdfunding operations.

## 📋 Features

### Core Functionality
- ✅ **Campaign Creation**: Create campaigns with goals, deadlines, and optional milestone tracking
- ✅ **All-or-Nothing Funding**: Automatic refunds if campaign goals aren't met
- ✅ **Milestone-Based Releases**: Optional staged fund release with backer voting
- ✅ **Contribution Tracking**: Comprehensive tracking of all contributions and contributors
- ✅ **Reward Tiers**: Bronze, Silver, Gold, and Platinum tiers based on contribution amounts
- ✅ **Governance Voting**: Backers vote on milestone completion before fund release
- ✅ **Refund Mechanism**: Automatic refunds for failed campaigns
- ✅ **Campaign Management**: Extend deadlines, cancel campaigns, submit deliverables

### Advanced Features
- 🔒 **Security**: Comprehensive input validation and authorization checks
- 📊 **Analytics**: Platform-wide statistics and contributor tracking
- 🎁 **Rewards System**: Customizable reward tiers for backers
- 🗳️ **Democratic Governance**: Voting power based on contribution amounts
- 📈 **Progress Tracking**: Real-time campaign and milestone progress
- 💰 **Fund Protection**: Milestone-based fund release protects backers

## 🏗️ Architecture

The platform consists of three smart contracts:

### 1. Campaign Contract (`campaign.clar`)
**Primary Functions:**
- `create-campaign`: Create new crowdfunding campaigns
- `contribute`: Make contributions to active campaigns
- `claim-funds`: Creators claim funds from successful campaigns
- `refund`: Contributors claim refunds from failed campaigns
- `cancel-campaign`: Cancel active campaigns
- `extend-deadline`: Extend campaign deadlines

**Key Features:**
- Campaign status management (Active, Successful, Failed, Cancelled)
- Automatic deadline enforcement
- Goal tracking and validation
- Milestone-enabled campaign support
- Campaign metadata storage

### 2. Contribution Tracker Contract (`contribution-tracker.clar`)
**Primary Functions:**
- `record-contribution`: Track all contributions
- `claim-refund`: Process refund claims
- `add-reward-tier`: Create reward tiers for campaigns
- `increment-successful-campaigns`: Update contributor stats
- `get-contribution-details`: Retrieve contributor information

**Key Features:**
- Detailed contribution history per campaign
- Global contributor statistics
- Automatic tier calculation (Bronze/Silver/Gold/Platinum)
- Transaction-level tracking
- Platform-wide analytics

### 3. Milestone Manager Contract (`milestone-manager.clar`)
**Primary Functions:**
- `initialize-milestone-campaign`: Enable milestone tracking
- `add-milestone`: Create campaign milestones
- `start-milestone-voting`: Begin voting on milestones
- `vote-on-milestone`: Backers vote on milestone completion
- `finalize-milestone-vote`: Complete voting and determine approval
- `release-milestone-funds`: Release funds for approved milestones
- `submit-milestone-deliverables`: Submit proof of milestone completion

**Key Features:**
- Democratic milestone approval (51% threshold)
- Voting power based on contribution amounts
- Deliverable submission and tracking
- Progressive fund release
- Milestone status management

## 📊 Smart Contract Details

### Campaign Status Types
```clarity
STATUS-ACTIVE (u1)       // Campaign is accepting contributions
STATUS-SUCCESSFUL (u2)   // Goal met, funds claimable
STATUS-FAILED (u3)       // Goal not met, refunds available
STATUS-CANCELLED (u4)    // Cancelled by creator
```

### Milestone Status Types
```clarity
STATUS-PENDING (u1)      // Milestone created, not yet voting
STATUS-VOTING (u2)       // Voting in progress
STATUS-APPROVED (u3)     // Approved by backers
STATUS-REJECTED (u4)     // Rejected by backers
STATUS-RELEASED (u5)     // Funds released
STATUS-CANCELLED (u6)    // Cancelled
```

### Reward Tiers
```clarity
TIER-BRONZE (u1)    // < 100 STX contribution
TIER-SILVER (u2)    // >= 100 STX contribution
TIER-GOLD (u3)      // >= 1,000 STX contribution
TIER-PLATINUM (u4)  // >= 10,000 STX contribution
```

## 🚀 Getting Started

### Prerequisites
- [Clarinet](https://github.com/hirosystems/clarinet) v2.0 or higher
- Node.js v18 or higher (for tests)

### Installation

1. Clone the repository:
```bash
cd crowd-funding-contract
```

2. Install dependencies:
```bash
npm install
```

3. Check contracts:
```bash
clarinet check
```

4. Run tests:
```bash
npm test
```

## 🧪 Testing

The project includes comprehensive test coverage for all three contracts:

### Running Tests
```bash
# Run all tests
npm test

# Run specific contract tests
npm test campaign.test.ts
npm test contribution-tracker.test.ts
npm test milestone-manager.test.ts
```

### Test Coverage
- ✅ **Campaign Tests**: 50+ test cases covering all campaign operations
- ✅ **Contribution Tracker Tests**: 40+ test cases for contribution tracking
- ✅ **Milestone Manager Tests**: 45+ test cases for milestone management

### Test Categories
- Campaign creation and validation
- Contribution handling
- Fund claiming and refunds
- Milestone creation and voting
- Governance and authorization
- Edge cases and error handling

## 📖 Usage Examples

### Creating a Campaign

```clarity
(contract-call? .campaign create-campaign
    "DeFi Innovation Project"
    "Building next-gen decentralized finance"
    u1000000000  ;; 1000 STX goal
    u1440        ;; ~10 days duration
    "https://example.com/image.jpg"
    "Technology"
    (some "https://youtube.com/video")
    true         ;; Milestone-enabled
)
```

### Contributing to a Campaign

```clarity
(contract-call? .campaign contribute
    u1           ;; Campaign ID
    u100000000   ;; 100 STX contribution
)
```

### Creating and Voting on Milestones

```clarity
;; Add milestone
(contract-call? .milestone-manager add-milestone
    u1                                  ;; Campaign ID
    "MVP Development"
    "Complete core features"
    u200000000                          ;; 200 STX release
    u720                                ;; Voting duration
)

;; Start voting
(contract-call? .milestone-manager start-milestone-voting
    u1           ;; Campaign ID
    u1           ;; Milestone ID
    u720         ;; Voting period
)

;; Vote on milestone
(contract-call? .milestone-manager vote-on-milestone
    u1           ;; Campaign ID
    u1           ;; Milestone ID
    u1           ;; Vote YES
    u100000000   ;; Voting power (contribution amount)
)
```

## 🔒 Security Considerations

### Authorization
- Only campaign creators can claim funds, cancel campaigns, and manage milestones
- Only contributors can claim refunds and vote on milestones
- Voting power proportional to contribution amount

### Validation
- Input validation on all public functions
- Campaign status checks before operations
- Deadline enforcement for contributions and voting
- Goal verification before fund claims

### Fund Protection
- Funds held in contract until goal met
- Automatic refunds for failed campaigns
- Milestone-based releases require backer approval
- No double-claiming or double-refunding

## 📈 Contract Statistics

### Campaign Contract
- **Lines of Code**: ~360
- **Public Functions**: 7
- **Read-Only Functions**: 8
- **Error Codes**: 13

### Contribution Tracker Contract
- **Lines of Code**: ~420
- **Public Functions**: 8
- **Read-Only Functions**: 9
- **Error Codes**: 7

### Milestone Manager Contract
- **Lines of Code**: ~500
- **Public Functions**: 11
- **Read-Only Functions**: 9
- **Error Codes**: 15

## 🎨 Frontend Integration Guidelines

Based on the PRD design specifications:

### Key UI Components Needed
1. **Campaign Hero Section**: Display image, title, creator info
2. **Funding Progress Ring**: Circular progress with percentage
3. **Contribution Tiers**: Reward cards showing benefits per tier
4. **Milestone Timeline**: Vertical timeline for milestone progress
5. **Vote Interface**: Voting buttons for milestone approval
6. **Update Feed**: Chronological campaign updates

### Recommended Tech Stack
- **Framework**: React/Next.js
- **Stacks Integration**: @stacks/connect, @stacks/transactions
- **UI Library**: Tailwind CSS with optimistic orange theme (#F97316)
- **Typography**: Nunito font family
- **State Management**: Zustand or React Query

### Chainhooks Events to Monitor
- `campaign-created`: New campaign launches
- `contribution-made`: Track contributions in real-time
- `goal-reached`: Campaign reaches funding goal
- `milestone-released`: Funds released for milestone
- `refund-processed`: Refund claimed by contributor

## 🛠️ Development

### Code Structure
```
crowd-funding-contract/
├── contracts/
│   ├── campaign.clar                    # Main campaign logic
│   ├── contribution-tracker.clar        # Contribution tracking
│   └── milestone-manager.clar           # Milestone management
├── tests/
│   ├── campaign.test.ts                 # Campaign tests
│   ├── contribution-tracker.test.ts     # Tracker tests
│   └── milestone-manager.test.ts        # Milestone tests
├── settings/
│   ├── Devnet.toml
│   ├── Testnet.toml
│   └── Mainnet.toml
├── Clarinet.toml                        # Clarinet configuration
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

### Best Practices
- Always validate inputs before processing
- Use descriptive error codes
- Implement comprehensive tests for all functions
- Document complex logic with comments
- Follow Clarity best practices for gas optimization

## 📝 License

This project is part of a crowdfunding platform implementation. Please ensure proper licensing before deployment.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass with `npm test`
5. Run `clarinet check` to validate contracts
6. Submit a pull request

## 📞 Support

For issues, questions, or contributions, please open an issue in the repository.

## 🎯 Next Steps

1. **Frontend Development**: Implement UI based on design specifications
2. **Chainhooks Setup**: Configure event monitoring for real-time updates
3. **Testing**: Deploy to testnet and conduct thorough testing
4. **Security Audit**: Perform comprehensive security review
5. **Documentation**: Create user guides and API documentation
6. **Mainnet Deployment**: Deploy to Stacks mainnet after testing

---

**Built with ❤️ using Clarity and Stacks Blockchain**
