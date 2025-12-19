// Crowdfunding Platform Integration Examples
// Complete examples for interacting with deployed mainnet contracts

import {
  makeContractCall,
  makeContractSTXPostCondition,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  FungibleConditionCode,
  uintCV,
  stringAsciiCV,
  stringUtf8CV,
  principalCV,
  noneCV,
  someCV,
  trueCV,
  falseCV,
  cvToJSON,
  callReadOnlyFunction
} from '@stacks/transactions';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

// Contract addresses on mainnet
const CONTRACTS = {
  CAMPAIGN: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.campaign',
  TRACKER: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.contribution-tracker',
  MILESTONE: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.milestone-manager'
};

const network = new StacksMainnet();

// ========================================
// CAMPAIGN OPERATIONS
// ========================================

/**
 * Create a new crowdfunding campaign
 */
export async function createCampaign({
  senderKey,
  title,
  description,
  goal,
  duration,
  imageUrl,
  category,
  videoUrl = null,
  milestoneEnabled = false
}) {
  const txOptions = {
    contractAddress: CONTRACTS.CAMPAIGN.split('.')[0],
    contractName: 'campaign',
    functionName: 'create-campaign',
    functionArgs: [
      stringAsciiCV(title),
      stringUtf8CV(description),
      uintCV(goal),
      uintCV(duration),
      stringUtf8CV(imageUrl),
      stringAsciiCV(category),
      videoUrl ? someCV(stringUtf8CV(videoUrl)) : noneCV(),
      milestoneEnabled ? trueCV() : falseCV()
    ],
    senderKey,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow
  };

  const transaction = await makeContractCall(txOptions);
  const result = await broadcastTransaction(transaction, network);
  return result;
}

/**
 * Contribute STX to a campaign
 */
export async function contributeToCampaign({
  senderKey,
  senderAddress,
  campaignId,
  amount
}) {
  // Add post condition to ensure STX is transferred
  const postConditions = [
    makeContractSTXPostCondition(
      senderAddress,
      FungibleConditionCode.Equal,
      amount
    )
  ];

  const txOptions = {
    contractAddress: CONTRACTS.CAMPAIGN.split('.')[0],
    contractName: 'campaign',
    functionName: 'contribute',
    functionArgs: [
      uintCV(campaignId),
      uintCV(amount)
    ],
    senderKey,
    network,
    anchorMode: AnchorMode.Any,
    postConditions,
    postConditionMode: PostConditionMode.Deny
  };

  const transaction = await makeContractCall(txOptions);
  return await broadcastTransaction(transaction, network);
}

/**
 * Claim funds from successful campaign (creator only)
 */
export async function claimCampaignFunds({
  senderKey,
  campaignId
}) {
  const txOptions = {
    contractAddress: CONTRACTS.CAMPAIGN.split('.')[0],
    contractName: 'campaign',
    functionName: 'claim-funds',
    functionArgs: [uintCV(campaignId)],
    senderKey,
    network,
    anchorMode: AnchorMode.Any
  };

  const transaction = await makeContractCall(txOptions);
  return await broadcastTransaction(transaction, network);
}

/**
 * Request refund from failed campaign
 */
export async function requestRefund({
  senderKey,
  campaignId
}) {
  const txOptions = {
    contractAddress: CONTRACTS.CAMPAIGN.split('.')[0],
    contractName: 'campaign',
    functionName: 'refund',
    functionArgs: [uintCV(campaignId)],
    senderKey,
    network,
    anchorMode: AnchorMode.Any
  };

  const transaction = await makeContractCall(txOptions);
  return await broadcastTransaction(transaction, network);
}

// ========================================
// READ-ONLY QUERIES
// ========================================

/**
 * Get campaign details
 */
export async function getCampaign(campaignId) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACTS.CAMPAIGN.split('.')[0],
    contractName: 'campaign',
    functionName: 'get-campaign',
    functionArgs: [uintCV(campaignId)],
    network,
    senderAddress: CONTRACTS.CAMPAIGN.split('.')[0]
  });

  return cvToJSON(result);
}

/**
 * Get campaign funding progress
 */
export async function getFundingProgress(campaignId) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACTS.CAMPAIGN.split('.')[0],
    contractName: 'campaign',
    functionName: 'get-funding-progress',
    functionArgs: [uintCV(campaignId)],
    network,
    senderAddress: CONTRACTS.CAMPAIGN.split('.')[0]
  });

  return cvToJSON(result);
}

/**
 * Get time remaining for campaign
 */
export async function getTimeRemaining(campaignId) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACTS.CAMPAIGN.split('.')[0],
    contractName: 'campaign',
    functionName: 'get-time-remaining',
    functionArgs: [uintCV(campaignId)],
    network,
    senderAddress: CONTRACTS.CAMPAIGN.split('.')[0]
  });

  return cvToJSON(result);
}

// ========================================
// MILESTONE OPERATIONS
// ========================================

/**
 * Initialize milestone tracking for campaign
 */
export async function initializeMilestoneCampaign({
  senderKey,
  campaignId
}) {
  const txOptions = {
    contractAddress: CONTRACTS.MILESTONE.split('.')[0],
    contractName: 'milestone-manager',
    functionName: 'initialize-milestone-campaign',
    functionArgs: [uintCV(campaignId)],
    senderKey,
    network,
    anchorMode: AnchorMode.Any
  };

  const transaction = await makeContractCall(txOptions);
  return await broadcastTransaction(transaction, network);
}

/**
 * Add a milestone to campaign
 */
export async function addMilestone({
  senderKey,
  campaignId,
  title,
  description,
  amount,
  votingDuration
}) {
  const txOptions = {
    contractAddress: CONTRACTS.MILESTONE.split('.')[0],
    contractName: 'milestone-manager',
    functionName: 'add-milestone',
    functionArgs: [
      uintCV(campaignId),
      stringAsciiCV(title),
      stringUtf8CV(description),
      uintCV(amount),
      uintCV(votingDuration)
    ],
    senderKey,
    network,
    anchorMode: AnchorMode.Any
  };

  const transaction = await makeContractCall(txOptions);
  return await broadcastTransaction(transaction, network);
}

/**
 * Start voting on a milestone
 */
export async function startMilestoneVoting({
  senderKey,
  campaignId,
  milestoneId,
  votingDuration
}) {
  const txOptions = {
    contractAddress: CONTRACTS.MILESTONE.split('.')[0],
    contractName: 'milestone-manager',
    functionName: 'start-milestone-voting',
    functionArgs: [
      uintCV(campaignId),
      uintCV(milestoneId),
      uintCV(votingDuration)
    ],
    senderKey,
    network,
    anchorMode: AnchorMode.Any
  };

  const transaction = await makeContractCall(txOptions);
  return await broadcastTransaction(transaction, network);
}

/**
 * Vote on a milestone (backers only)
 */
export async function voteOnMilestone({
  senderKey,
  campaignId,
  milestoneId,
  vote, // 1 for YES, 2 for NO
  contributionAmount
}) {
  const txOptions = {
    contractAddress: CONTRACTS.MILESTONE.split('.')[0],
    contractName: 'milestone-manager',
    functionName: 'vote-on-milestone',
    functionArgs: [
      uintCV(campaignId),
      uintCV(milestoneId),
      uintCV(vote),
      uintCV(contributionAmount)
    ],
    senderKey,
    network,
    anchorMode: AnchorMode.Any
  };

  const transaction = await makeContractCall(txOptions);
  return await broadcastTransaction(transaction, network);
}

/**
 * Finalize milestone vote
 */
export async function finalizeMilestoneVote({
  senderKey,
  campaignId,
  milestoneId
}) {
  const txOptions = {
    contractAddress: CONTRACTS.MILESTONE.split('.')[0],
    contractName: 'milestone-manager',
    functionName: 'finalize-milestone-vote',
    functionArgs: [
      uintCV(campaignId),
      uintCV(milestoneId)
    ],
    senderKey,
    network,
    anchorMode: AnchorMode.Any
  };

  const transaction = await makeContractCall(txOptions);
  return await broadcastTransaction(transaction, network);
}

/**
 * Release milestone funds
 */
export async function releaseMilestoneFunds({
  senderKey,
  campaignId,
  milestoneId,
  recipient
}) {
  const txOptions = {
    contractAddress: CONTRACTS.MILESTONE.split('.')[0],
    contractName: 'milestone-manager',
    functionName: 'release-milestone-funds',
    functionArgs: [
      uintCV(campaignId),
      uintCV(milestoneId),
      principalCV(recipient)
    ],
    senderKey,
    network,
    anchorMode: AnchorMode.Any
  };

  const transaction = await makeContractCall(txOptions);
  return await broadcastTransaction(transaction, network);
}

/**
 * Get milestone voting results
 */
export async function getVotingResults(campaignId, milestoneId) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACTS.MILESTONE.split('.')[0],
    contractName: 'milestone-manager',
    functionName: 'get-voting-results',
    functionArgs: [
      uintCV(campaignId),
      uintCV(milestoneId)
    ],
    network,
    senderAddress: CONTRACTS.MILESTONE.split('.')[0]
  });

  return cvToJSON(result);
}

/**
 * Get campaign progress (milestones)
 */
export async function getCampaignProgress(campaignId) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACTS.MILESTONE.split('.')[0],
    contractName: 'milestone-manager',
    functionName: 'get-campaign-progress',
    functionArgs: [uintCV(campaignId)],
    network,
    senderAddress: CONTRACTS.MILESTONE.split('.')[0]
  });

  return cvToJSON(result);
}

// ========================================
// CONTRIBUTION TRACKER OPERATIONS
// ========================================

/**
 * Get contributor statistics
 */
export async function getContributorStats(contributorAddress) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACTS.TRACKER.split('.')[0],
    contractName: 'contribution-tracker',
    functionName: 'get-contributor-stats',
    functionArgs: [principalCV(contributorAddress)],
    network,
    senderAddress: CONTRACTS.TRACKER.split('.')[0]
  });

  return cvToJSON(result);
}

/**
 * Get campaign contribution summary
 */
export async function getCampaignContributionSummary(campaignId) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACTS.TRACKER.split('.')[0],
    contractName: 'contribution-tracker',
    functionName: 'get-campaign-contribution-summary',
    functionArgs: [uintCV(campaignId)],
    network,
    senderAddress: CONTRACTS.TRACKER.split('.')[0]
  });

  return cvToJSON(result);
}

/**
 * Get contributor tier
 */
export async function getContributorTier(campaignId, contributorAddress) {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACTS.TRACKER.split('.')[0],
    contractName: 'contribution-tracker',
    functionName: 'get-contributor-tier',
    functionArgs: [
      uintCV(campaignId),
      principalCV(contributorAddress)
    ],
    network,
    senderAddress: CONTRACTS.TRACKER.split('.')[0]
  });

  return cvToJSON(result);
}

/**
 * Get platform statistics
 */
export async function getPlatformStats() {
  const result = await callReadOnlyFunction({
    contractAddress: CONTRACTS.TRACKER.split('.')[0],
    contractName: 'contribution-tracker',
    functionName: 'get-platform-stats',
    functionArgs: [],
    network,
    senderAddress: CONTRACTS.TRACKER.split('.')[0]
  });

  return cvToJSON(result);
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Convert STX microunits to STX
 */
export function microStxToStx(microStx) {
  return microStx / 1000000;
}

/**
 * Convert STX to microunits
 */
export function stxToMicroStx(stx) {
  return stx * 1000000;
}

/**
 * Convert blocks to approximate time
 * (Assuming ~10 minute block times)
 */
export function blocksToTime(blocks) {
  const minutes = blocks * 10;
  const hours = minutes / 60;
  const days = hours / 24;
  
  if (days >= 1) return `${Math.floor(days)} days`;
  if (hours >= 1) return `${Math.floor(hours)} hours`;
  return `${Math.floor(minutes)} minutes`;
}

/**
 * Get tier name from tier number
 */
export function getTierName(tierNumber) {
  const tiers = {
    1: 'Bronze',
    2: 'Silver',
    3: 'Gold',
    4: 'Platinum'
  };
  return tiers[tierNumber] || 'Unknown';
}

/**
 * Get campaign status name
 */
export function getCampaignStatusName(statusNumber) {
  const statuses = {
    1: 'Active',
    2: 'Successful',
    3: 'Failed',
    4: 'Cancelled'
  };
  return statuses[statusNumber] || 'Unknown';
}

// ========================================
// EXAMPLE USAGE
// ========================================

// Example: Create a campaign
async function exampleCreateCampaign() {
  const result = await createCampaign({
    senderKey: 'your-private-key',
    title: 'Awesome DeFi Project',
    description: 'Building the future of decentralized finance',
    goal: stxToMicroStx(1000), // 1000 STX
    duration: 1440, // ~10 days
    imageUrl: 'https://example.com/image.jpg',
    category: 'Technology',
    videoUrl: 'https://youtube.com/watch?v=123',
    milestoneEnabled: true
  });
  
  console.log('Campaign created:', result.txid);
}

// Example: Contribute to campaign
async function exampleContribute() {
  const result = await contributeToCampaign({
    senderKey: 'your-private-key',
    senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    campaignId: 1,
    amount: stxToMicroStx(100) // 100 STX
  });
  
  console.log('Contribution sent:', result.txid);
}

// Example: Query campaign
async function exampleQueryCampaign() {
  const campaign = await getCampaign(1);
  const progress = await getFundingProgress(1);
  const timeLeft = await getTimeRemaining(1);
  
  console.log('Campaign:', campaign);
  console.log('Progress:', progress);
  console.log('Time remaining:', blocksToTime(timeLeft.value));
}

export default {
  // Campaign operations
  createCampaign,
  contributeToCampaign,
  claimCampaignFunds,
  requestRefund,
  
  // Campaign queries
  getCampaign,
  getFundingProgress,
  getTimeRemaining,
  
  // Milestone operations
  initializeMilestoneCampaign,
  addMilestone,
  startMilestoneVoting,
  voteOnMilestone,
  finalizeMilestoneVote,
  releaseMilestoneFunds,
  
  // Milestone queries
  getVotingResults,
  getCampaignProgress,
  
  // Tracker queries
  getContributorStats,
  getCampaignContributionSummary,
  getContributorTier,
  getPlatformStats,
  
  // Utilities
  microStxToStx,
  stxToMicroStx,
  blocksToTime,
  getTierName,
  getCampaignStatusName,
  
  // Constants
  CONTRACTS
};
