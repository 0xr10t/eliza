# Eliza Contracts - Remix Deployment Guide (Sepolia Testnet)

This guide explains how to deploy the Eliza trading agent system to **Sepolia testnet** through Remix IDE.

## 🚀 Quick Start (Recommended)

### Step 1: Get Sepolia ETH
1. Go to [Sepolia Faucet](https://sepoliafaucet.com/)
2. Connect your wallet and get test ETH (you'll need ~0.5 ETH)

### Step 2: Deploy in Remix
1. **Open Remix IDE**: https://remix.ethereum.org/
2. **Connect to Sepolia**: 
   - Go to "Deploy & Run Transactions"
   - Select "Sepolia" from the Environment dropdown
   - Connect your wallet (MetaMask)
3. **Upload Contract**:
   - Copy the entire `RemixDeploy.sol` file content
   - Create a new file in Remix and paste the content
   - Compile the contract (Ctrl+S or click Compile)
4. **Deploy**:
   - Click "Deploy" on the RemixDeploy contract
   - Wait for deployment confirmation

### Step 3: Deploy the System
1. **Call `deploySystem`** with these parameters:
   - `authorizedSigner`: Your wallet address (for testing)
   - `platformType`: `0` (Twitter)
   - **Value**: `0.4 ether` (400000000000000000 wei)
2. **Wait for completion** - you'll see deployment events in the logs

### Step 4: Get Contract Addresses
Call `getDeployedAddresses()` to get all contract addresses for your demo.

---

## 📋 Detailed Steps

### Prerequisites
- MetaMask wallet with Sepolia testnet configured
- At least 0.5 Sepolia ETH
- Remix IDE access

### Deployment Parameters
- **Agent Initial Funds**: 0.1 ETH
- **Pool Liquidity per Token**: 10 ETH
- **Total Deployment Cost**: ~0.4 ETH
- **Platform Types**: 0=Twitter, 1=Telegram, 2=Discord

### What Gets Deployed
1. **MockDAI** - Mock DAI token
2. **MockMKR** - Mock MKR token  
3. **MockWETH** - Mock WETH token
4. **MockAMM** - Automated Market Maker
5. **AgentFactory** - Factory for creating agents
6. **Agent** - Trading agent with pools

### Deployment Events
The contract emits events for each step:
- `DeploymentStep` - Shows progress
- `SystemDeployed` - Final confirmation

---

## 🔧 Testing Your Deployment

### 1. Check Pools
```solidity
// Call on MockAMM contract
getPool(tokenAddress) // Returns pool info
```

### 2. Check Agent
```solidity
// Call on Agent contract
getOwner() // Should return your address
getUserFunds() // Should return 0.1 ETH
getPausedState() // Should return false
```

### 3. Test Token Balances
```solidity
// Call on token contracts
balanceOf(agentAddress) // Should return 0 (all used for pools)
```

---

## 🛠️ Troubleshooting

### Common Issues
1. **"Insufficient funds"**: Send more ETH (at least 0.4 ETH)
2. **"Invalid authorized signer"**: Use a valid address (your wallet)
3. **Transaction fails**: Check gas limit (set to 10M+ for deployment)
4. **Contract not found**: Make sure you're on Sepolia testnet

### Gas Optimization
- **Deployment**: ~5-8M gas
- **Pool Creation**: ~2-3M gas per pool
- **Total**: ~15-20M gas

### Cost Breakdown
- Agent creation: 0.1 ETH
- Pool liquidity: 0.3 ETH (3 × 0.1 ETH)
- **Total**: 0.4 ETH

---

## 🎯 Demo Script

1. **Deploy the system** (see Quick Start)
2. **Show contract addresses** using `getDeployedAddresses()`
3. **Demonstrate pools** by calling `getPool()` on MockAMM
4. **Show agent state** using getter functions
5. **Optional**: Test a swap through the agent

---

## 📞 Support

If you encounter issues:
1. Check the deployment events in Remix logs
2. Verify you have enough Sepolia ETH
3. Ensure you're on Sepolia testnet
4. Check gas limits are sufficient

**Happy Deploying! 🚀** 