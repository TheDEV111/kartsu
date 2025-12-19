#!/usr/bin/env node

/**
 * CrowdStack Chainhooks Setup Script
 * 
 * This script registers all necessary chainhooks for the crowdfunding platform.
 * Run after deploying the frontend and setting up environment variables.
 * 
 * Usage:
 *   node scripts/setup-chainhooks.js
 */

const CONTRACTS = {
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F',
  campaign: process.env.NEXT_PUBLIC_CAMPAIGN_CONTRACT || 'campaign',
  tracker: process.env.NEXT_PUBLIC_TRACKER_CONTRACT || 'contribution-tracker',
  milestone: process.env.NEXT_PUBLIC_MILESTONE_CONTRACT || 'milestone-manager',
};

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

const chainhooks = [
  {
    name: 'campaign-created',
    contractId: `${CONTRACTS.address}.${CONTRACTS.campaign}`,
    functionName: 'create-campaign',
    eventType: 'contract_call',
    description: 'Listen for new campaign creation',
  },
  {
    name: 'contribution-made',
    contractId: `${CONTRACTS.address}.${CONTRACTS.campaign}`,
    functionName: 'contribute',
    eventType: 'contract_call',
    description: 'Listen for campaign contributions',
  },
  {
    name: 'funds-claimed',
    contractId: `${CONTRACTS.address}.${CONTRACTS.campaign}`,
    functionName: 'claim-funds',
    eventType: 'contract_call',
    description: 'Listen for successful fund claims',
  },
  {
    name: 'refund-processed',
    contractId: `${CONTRACTS.address}.${CONTRACTS.campaign}`,
    functionName: 'refund',
    eventType: 'contract_call',
    description: 'Listen for refund transactions',
  },
  {
    name: 'milestone-vote',
    contractId: `${CONTRACTS.address}.${CONTRACTS.milestone}`,
    functionName: 'vote-on-milestone',
    eventType: 'contract_call',
    description: 'Listen for milestone voting',
  },
  {
    name: 'milestone-released',
    contractId: `${CONTRACTS.address}.${CONTRACTS.milestone}`,
    functionName: 'release-milestone-funds',
    eventType: 'contract_call',
    description: 'Listen for milestone fund releases',
  },
];

async function registerChainhook(hook) {
  try {
    const response = await fetch(`${API_URL}/api/chainhooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(hook),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const result = await response.json();
    console.log(`✓ Registered: ${hook.name}`);
    console.log(`  UUID: ${result.uuid}`);
    return result;
  } catch (error) {
    console.error(`✗ Failed: ${hook.name}`);
    console.error(`  Error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('CrowdStack Chainhooks Setup');
  console.log('='.repeat(50));
  console.log(`API URL: ${API_URL}`);
  console.log(`Contract: ${CONTRACTS.address}`);
  console.log('='.repeat(50));
  console.log('');

  const results = [];

  for (const hook of chainhooks) {
    console.log(`Registering: ${hook.name}`);
    console.log(`  ${hook.description}`);
    const result = await registerChainhook(hook);
    results.push({ hook: hook.name, success: !!result, uuid: result?.uuid });
    console.log('');
  }

  console.log('='.repeat(50));
  console.log('Summary:');
  console.log(`  Total: ${results.length}`);
  console.log(`  Success: ${results.filter(r => r.success).length}`);
  console.log(`  Failed: ${results.filter(r => !r.success).length}`);
  console.log('='.repeat(50));

  if (results.some(r => !r.success)) {
    process.exit(1);
  }
}

main().catch(console.error);
