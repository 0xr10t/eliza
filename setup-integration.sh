#!/bin/bash

# AI Agent + Smart Contract Integration Setup Script
# This script sets up the complete integration between Eliza AI agent, smart contracts, and frontend

echo "🚀 Setting up AI Agent + Smart Contract Integration"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the eliza directory"
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p src/plugins
mkdir -p src/integration
mkdir -p contracts/script

# Copy smart contracts if they don't exist
if [ ! -d "contracts/src" ]; then
    echo "📋 Copying smart contracts..."
    if [ -d "../Chromion-Hack/contracts" ]; then
        cp -r ../Chromion-Hack/contracts .
    else
        echo "⚠️  Warning: Chromion-Hack contracts not found. Please ensure contracts are in place."
    fi
fi

# Copy frontend if it doesn't exist
if [ ! -d "frontend" ]; then
    echo "📋 Copying frontend..."
    if [ -d "../Chromion-Hack/frontend" ]; then
        cp -r ../Chromion-Hack/frontend .
    else
        echo "⚠️  Warning: Chromion-Hack frontend not found. Please ensure frontend is in place."
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install frontend dependencies
if [ -d "frontend" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

# Install Foundry dependencies
if [ -d "contracts" ]; then
    echo "📦 Installing Foundry dependencies..."
    cd contracts
    if command -v forge &> /dev/null; then
        forge install
    else
        echo "⚠️  Warning: Foundry not installed. Please install Foundry to compile smart contracts."
        echo "   Install with: curl -L https://foundry.paradigm.xyz | bash"
    fi
    cd ..
fi

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "🔧 Creating environment file..."
    cat > .env << EOF
# Blockchain Configuration
RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_private_key_here
CHAIN_ID=1

# Smart Contract Addresses (after deployment)
AGENT_FACTORY_ADDRESS=0x...
AGENT_CONTRACT_ADDRESS=0x...

# AI Agent Configuration
GEMINI_API_KEY=your_gemini_api_key_here
DISCORD_APPLICATION_ID=your_discord_application_id
DISCORD_API_TOKEN=your_discord_bot_token

# Optional: OpenAI API (fallback if Gemini fails)
OPENAI_API_KEY=your_openai_api_key_here

# Frontend Configuration
REACT_APP_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
REACT_APP_CHAIN_ID=1
REACT_APP_AGENT_FACTORY_ADDRESS=0x...
EOF
    echo "✅ Environment file created. Please edit .env with your actual values."
fi

# Create deployment script if it doesn't exist
if [ ! -f "contracts/script/Deploy.s.sol" ]; then
    echo "📝 Creating deployment script..."
    cat > contracts/script/Deploy.s.sol << 'EOF'
// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script} from "forge-std/Script.sol";
import {AgentFactory} from "../src/AgentFactory.sol";
import {Platform} from "../src/PlatformType.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        AgentFactory factory = new AgentFactory();
        
        vm.stopBroadcast();

        console.log("AgentFactory deployed to:", address(factory));
        console.log("Deployer address:", vm.addr(deployerPrivateKey));
        
        string memory deploymentInfo = string.concat(
            "AGENT_FACTORY_ADDRESS=",
            vm.toString(address(factory)),
            "\nDEPLOYER_ADDRESS=",
            vm.toString(vm.addr(deployerPrivateKey)),
            "\nDEPLOYMENT_BLOCK=",
            vm.toString(block.number),
            "\nCHAIN_ID=",
            vm.toString(block.chainid)
        );
        
        vm.writeFile("deployment.txt", deploymentInfo);
        console.log("Deployment info saved to deployment.txt");
    }
}
EOF
fi

# Create integration guide
echo "📚 Creating integration documentation..."
cat > INTEGRATION_GUIDE.md << 'EOF'
# AI Agent + Smart Contract Integration Guide

This guide explains how to connect your Eliza AI trading agent with the Chromion-Hack smart contracts and frontend for automated crypto trading.

## Quick Start

1. **Configure Environment**: Edit `.env` file with your API keys and contract addresses
2. **Deploy Smart Contracts**: Run `forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast`
3. **Start AI Agent**: Run `npm run dev`
4. **Start Frontend**: Run `cd frontend && npm run dev`

## Architecture

- **AI Agent**: Monitors social media, analyzes sentiment, generates trade signals
- **Smart Contracts**: Manages funds, executes trades securely with EIP-712 signatures
- **Frontend**: User interface for creating and monitoring trading agents

## Security Features

- EIP-712 signatures prevent replay attacks
- Only authorized signers can execute trades
- Owner controls for fund management
- Pause/resume functionality for emergency stops

For detailed documentation, see COMPLETE_INTEGRATION_SUMMARY.md
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your API keys and configuration"
echo "2. Deploy smart contracts: cd contracts && forge script script/Deploy.s.sol --rpc-url \$RPC_URL --broadcast"
echo "3. Start AI agent: npm run dev"
echo "4. Start frontend: cd frontend && npm run dev"
echo ""
echo "📚 Documentation:"
echo "- INTEGRATION_GUIDE.md - Quick setup guide"
echo "- COMPLETE_INTEGRATION_SUMMARY.md - Detailed architecture overview"
echo ""
echo "🔧 Configuration files:"
echo "- .env - Environment variables"
echo "- contracts/foundry.toml - Foundry configuration"
echo "- frontend/vite.config.js - Frontend configuration"
echo ""
echo "🚀 Happy trading!" 