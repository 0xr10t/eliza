# Eliza Trading Bot - AI-Powered Crypto Trading Assistant

## 🚀 What is Eliza Trading Bot?

Eliza Trading Bot is a sophisticated AI-powered cryptocurrency trading assistant that combines social media sentiment analysis with automated trading execution. Built on the ElizaOS platform, it monitors Discord, Twitter, and Telegram channels in real-time to detect market sentiment and execute trades based on AI-generated signals.

### 🎯 Core Features

- **🤖 AI Sentiment Analysis**: Analyzes social media messages using Gemini AI and OpenAI APIs to detect crypto trading sentiment
- **📊 Real-time Market Monitoring**: Monitors Discord channels, Twitter feeds, and Telegram groups for crypto-related discussions
- **💹 Automated Trading**: Executes trades on-chain using smart contracts with EIP-712 signature verification
- **📱 Discord Integration**: Responds to messages in real-time with trading signals and market analysis
- **🔒 Secure Trading**: Uses smart contracts for secure, transparent, and verifiable trade execution
- **📈 Portfolio Management**: Tracks balances, performance, and provides detailed analytics
- **🎛️ Risk Management**: Implements confidence thresholds and position sizing based on sentiment strength

### 🏗️ Architecture Overview

```
Social Media → AI Analysis → Trade Signals → Smart Contracts → Blockchain Execution
     ↓              ↓            ↓              ↓              ↓
  Discord      Gemini AI    Trade Plans    EIP-712 Sig    On-chain Trades
  Twitter      OpenAI       Risk Scoring   Validation     Portfolio Updates
  Telegram     Sentiment    Position Size  Gas Optimize   Real-time Results
```

## 🛠️ Technology Stack

- **Backend**: Node.js, TypeScript, ElizaOS Framework
- **AI/ML**: Google Gemini AI, OpenAI GPT-4
- **Blockchain**: Ethereum, Solidity, Foundry, Viem
- **Frontend**: React, Web3.js, MetaMask Integration
- **Database**: PostgreSQL, SQLite
- **Real-time**: Discord API, WebSocket connections
- **Deployment**: Docker, PM2 Process Manager

## 📋 Prerequisites

Before setting up Eliza Trading Bot, ensure you have:

- **Node.js 22+** installed on your system
- **Git** for version control
- **pnpm** package manager (recommended) or npm
- **MetaMask** or another Web3 wallet
- **Discord Developer Account** for bot integration
- **Google AI Studio Account** for Gemini API access
- **OpenAI Account** (optional, for fallback)

## 🚀 Installation & Setup

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd eliza

# Install dependencies using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### Step 2: Environment Configuration

```bash
# Copy the example environment file
cp env.example .env

# Edit the .env file with your API keys and configuration
nano .env
```

**Required Environment Variables:**

```bash
# AI APIs
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here  # Optional fallback

# Discord Bot Configuration
DISCORD_APPLICATION_ID=your_discord_application_id
DISCORD_API_TOKEN=your_discord_bot_token

# Blockchain Configuration
RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_private_key_here  # For contract deployment
AGENT_FACTORY_ADDRESS=0x...  # After smart contract deployment

# Database Configuration
DATABASE_URL=your_database_connection_string
```

### Step 3: Smart Contract Deployment

```bash
# Navigate to contracts directory
cd contracts

# Install Foundry dependencies
forge install

# Deploy to testnet (recommended for testing)
forge script script/Deploy.s.sol --rpc-url $TESTNET_RPC_URL --broadcast

# Deploy to mainnet (for production)
forge script script/Deploy.s.sol --rpc-url $MAINNET_RPC_URL --broadcast --verify

# Update your .env file with the deployed contract addresses
```

### Step 4: Discord Bot Setup

1. **Create Discord Application:**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Click "New Application" and name it (e.g., "Eliza Trading Bot")
   - Navigate to "Bot" section and click "Add Bot"
   - Copy the bot token and application ID

2. **Configure Bot Permissions:**
   - Go to "OAuth2" → "URL Generator"
   - Select scopes: `bot`, `applications.commands`
   - Select permissions:
     - Read Messages/View Channels
     - Send Messages
     - Use Slash Commands
     - Read Message History
   - Use the generated URL to invite the bot to your server

3. **Test Discord Integration:**
   ```bash
   npm run test:discord
   ```

### Step 5: Frontend Setup (Optional)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎮 Usage

### Starting the Bot

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start

# Simplified mode (console only, bypasses ElizaOS)
npm run start:simple
```

### Discord Interactions

The bot automatically monitors Discord channels and responds to crypto-related messages:

**Example 1: Bullish Sentiment**
```
User: "ETH is going to moon! 🚀"

Bot Response:
**Trading Signal Detected!**

Action: BUY
Pair: ETH/USDC
Amount: 0.1 ETH
Target: 3000 USD
Sentiment Score: 0.85
Confidence: High

Remember: This is analysis only, not financial advice.
```

**Example 2: Bearish Sentiment**
```
User: "BTC looking bearish today"

Bot Response:
**Trading Signal Detected!**

Action: SELL
Pair: BTC/USDC
Amount: 0.01 BTC
Target: 3500 USD
Sentiment Score: -0.72
Confidence: Medium

Remember: This is analysis only, not financial advice.
```

### Trading Commands

```bash
# Check wallet balance
User: "Check my ETH balance"

# Execute trade
User: "execute trade"

# Transfer assets
User: "Transfer 0.1 ETH to 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
```

### Testing Different Components

```bash
# Test Discord integration
npm run test:discord

# Test trading functionality
npm run test:trading

# Test trading actions
npm run test:actions

# Test Twitter sentiment analysis
npm run test:twitter

# Test Twitter scraper
npm run test:scraper
```

## 🔧 Configuration

### Bot Personality & Behavior

Edit `src/character.ts` to customize:
- Bot personality and response style
- Discord channel restrictions
- Sentiment analysis thresholds
- Trading parameters

### Trading Logic

Modify `src/plugins/trade-planner.ts` to adjust:
- Supported cryptocurrencies
- Position sizing algorithms
- Risk management rules
- Signal confidence thresholds

### Smart Contract Integration

Update `src/integration/` files to:
- Connect to different blockchain networks
- Modify gas optimization settings
- Adjust slippage protection
- Configure trade execution parameters

## 🚨 Challenges & Solutions During Development

### 1. **Discord API Rate Limiting**
**Challenge**: Discord's API has strict rate limits that caused bot disconnections during high message volume.

**Solution**: 
- Implemented exponential backoff retry logic
- Added message queuing system
- Created connection pooling for multiple channels
- Used Discord's gateway intents for efficient message handling

### 2. **AI API Reliability & Cost Management**
**Challenge**: OpenAI API costs were high, and single API dependency created reliability issues.

**Solution**:
- Integrated Google Gemini AI as primary API (generous free tier)
- Implemented automatic fallback to OpenAI when Gemini fails
- Added request caching to reduce API calls
- Created sentiment analysis batching for cost optimization

### 3. **Smart Contract Security & Gas Optimization**
**Challenge**: Ensuring secure trade execution while minimizing gas costs and preventing attacks.

**Solution**:
- Implemented EIP-712 signatures for secure transaction validation
- Added nonce-based protection against replay attacks
- Created gas optimization strategies for trade execution
- Implemented emergency pause functionality for risk management

### 4. **Real-time Data Synchronization**
**Challenge**: Keeping frontend, smart contracts, and AI agent in sync across multiple platforms.

**Solution**:
- Implemented WebSocket connections for real-time updates
- Created event-driven architecture for blockchain events
- Added comprehensive error handling and retry mechanisms
- Built state management system for consistent data across components

### 5. **Sentiment Analysis Accuracy**
**Challenge**: False positive signals and low accuracy in sentiment detection.

**Solution**:
- Implemented confidence scoring system
- Added keyword filtering for crypto-specific terms
- Created multi-source sentiment aggregation
- Built signal validation pipeline with historical data analysis

### 6. **Cross-Platform Compatibility**
**Challenge**: Ensuring consistent behavior across Discord, Twitter, and Telegram.

**Solution**:
- Created unified message processing interface
- Implemented platform-specific adapters
- Added message format normalization
- Built cross-platform testing suite

### 7. **Deployment & Infrastructure**
**Challenge**: Complex deployment process with multiple components and dependencies.

**Solution**:
- Created Docker containers for each component
- Implemented PM2 process management for production
- Built automated deployment scripts
- Added comprehensive logging and monitoring

## 🔒 Security Features

### Smart Contract Security
- **EIP-712 Signatures**: Prevents replay attacks and ensures transaction authenticity
- **Access Control**: Only authorized signers can execute trades
- **Reentrancy Protection**: Prevents common smart contract vulnerabilities
- **Owner Controls**: Users maintain full control over their funds
- **Emergency Pause**: Ability to stop trading immediately if needed

### AI Agent Security
- **Signature Validation**: All trades require valid cryptographic signatures
- **Rate Limiting**: Prevents excessive trading and API abuse
- **Confidence Thresholds**: Only high-confidence signals trigger trades
- **Error Handling**: Graceful handling of failed transactions and API errors

### Frontend Security
- **Wallet Integration**: Secure Web3 wallet connection
- **Transaction Confirmation**: User approval for all blockchain transactions
- **Input Validation**: Comprehensive client-side and server-side validation
- **Error Recovery**: Clear error messages and recovery mechanisms

## 📊 Performance & Monitoring

### Key Metrics
- **Signal Accuracy**: Track sentiment analysis accuracy over time
- **Trade Success Rate**: Monitor successful vs failed trades
- **API Response Times**: Track AI API performance and reliability
- **Gas Usage**: Optimize transaction costs
- **Uptime**: Monitor bot availability and performance

### Monitoring Tools
```bash
# Check bot status
pm2 status

# View logs
pm2 logs

# Monitor performance
pm2 monit
```

## 🚀 Future Enhancements

### Planned Features
- **Machine Learning Model**: Custom sentiment analysis model trained on crypto data
- **Advanced Risk Management**: Dynamic position sizing and stop-loss mechanisms
- **Multi-Chain Support**: Integration with Solana, Polygon, and other blockchains
- **Mobile App**: React Native mobile application for on-the-go monitoring
- **Social Trading**: Copy successful traders and share strategies
- **Advanced Analytics**: Portfolio performance, risk metrics, and backtesting

### Technical Improvements
- **Microservices Architecture**: Break down into smaller, scalable services
- **Real-time Analytics**: Live dashboard with trading performance metrics
- **API Rate Limiting**: Advanced rate limiting and cost optimization
- **Automated Testing**: Comprehensive test suite for all components

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the same terms as the ElizaOS platform. See the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

**Important**: Eliza Trading Bot is for educational and research purposes only. Cryptocurrency trading involves significant risk, and you should never invest more than you can afford to lose. The bot's recommendations should not be considered as financial advice. Always do your own research and consider consulting with a financial advisor before making investment decisions.

## 📞 Support

- **Documentation**: See [COMPLETE_INTEGRATION_SUMMARY.md](./COMPLETE_INTEGRATION_SUMMARY.md) for detailed technical documentation
- **Discord Setup**: See [DISCORD_SETUP.md](./DISCORD_SETUP.md) for Discord-specific setup instructions
- **Trading Actions**: See [TRADING_ACTIONS.md](./TRADING_ACTIONS.md) for detailed trading functionality
- **Issues**: Report bugs and feature requests through GitHub issues

---

**Built with ❤️ using ElizaOS, AI, and Blockchain Technology**