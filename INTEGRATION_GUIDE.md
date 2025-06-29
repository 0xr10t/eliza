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
