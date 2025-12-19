/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com', 'ipfs.io'],
  },
  env: {
    NEXT_PUBLIC_CONTRACT_ADDRESS: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F',
    NEXT_PUBLIC_CAMPAIGN_CONTRACT: 'campaign',
    NEXT_PUBLIC_TRACKER_CONTRACT: 'contribution-tracker',
    NEXT_PUBLIC_MILESTONE_CONTRACT: 'milestone-manager',
    NEXT_PUBLIC_STACKS_NETWORK: 'mainnet',
    NEXT_PUBLIC_API_URL: 'https://api.hiro.so',
  },
}

module.exports = nextConfig
