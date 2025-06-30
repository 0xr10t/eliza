# 🤖 Automated Trading Agent Guide

## Overview

This automated trading agent provides a complete end-to-end solution for cryptocurrency trading based on social media sentiment analysis. The agent can:

1. **Extract tokens** from user input (Ethereum, Bitcoin, Solana, etc.)
2. **Fetch and analyze tweets** for sentiment
3. **Generate trade plans** based on sentiment analysis
4. **Execute trades** on smart contracts using EIP-712 signatures
5. **Provide real-time feedback** on trading decisions

## 🚀 Quick Start

### 1. Setup Environment Variables

Create a `.env` file in the root directory:

```bash
# Blockchain Configuration
RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_private_key_here
AGENT_CONTRACT_ADDRESS=deployed_agent_contract_address
MOCK_AMM_ADDRESS=deployed_mock_amm_address

# Twitter API (for real tweet fetching)
TWITTER_BEARER_TOKEN=your_twitter_bearer_token

# Model Provider
OPENAI_API_KEY=your_openai_api_key
```

### 2. Deploy Smart Contracts

```bash
cd contracts
forge build
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast
```

### 3. Start the Agent

```bash
npm run dev
```

### 4. Test the Agent

```bash
node test-automated-trading.js
```

## 📋 How It Works

### Step 1: Input Processing
The agent accepts natural language input and extracts cryptocurrency tokens:

**Examples:**
- "Analyze Ethereum and make a trade"
- "What do you think about Bitcoin? Should I trade?"
- "Solana looks interesting, analyze and trade"
- "Check USDC sentiment and execute trade"

### Step 2: Tweet Analysis
The agent fetches recent tweets about the identified token and performs sentiment analysis:

```javascript
// Mock tweet analysis (real implementation uses Twitter API)
const tweetAnalysis = await fetchAndAnalyzeTweets(token);
// Returns: { sentimentScore: 0.75, confidence: 0.8, overallSentiment: 'bullish' }
```

### Step 3: Trade Plan Generation
Based on sentiment analysis, the agent generates a comprehensive trade plan:

```javascript
const tradePlan = {
  action: 'buy',           // 'buy', 'sell', or 'hold'
  tokenPair: 'ETH/USDC',
  amount: '0.08',
  targetPrice: '3200.00',
  sentimentScore: 0.75,
  confidence: 0.8,
  riskLevel: 'medium'
};
```

### Step 4: Smart Contract Execution
If the trade plan recommends action (not hold), the agent:

1. **Creates EIP-712 signature** for the trade data
2. **Calls the smart contract** with proper authorization
3. **Executes the swap** through the MockAMM
4. **Returns transaction hash** for verification

## 🔧 Smart Contract Integration

### Agent Contract Functions

The agent interacts with the deployed smart contract using these functions:

```solidity
// Execute a trade with EIP-712 signature
function executeSwap(
    TradeData memory data,
    bytes calldata signature
) external nonReentrant onlyAuthorized

// Check agent status
function getPausedState() external view returns (bool)
function getUserFunds() external view returns (uint256)
function getAuthorizedSigner() external view returns (address)
```

### Trade Data Structure

```solidity
struct TradeData {
    address tokenOut;      // Token to receive
    uint256 amountIn;      // ETH amount to trade
    uint256 minAmountOut;  // Minimum tokens to receive
    uint256 deadline;      // Transaction deadline
    uint256 nonce;         // Unique nonce for replay protection
}
```

## 📊 Sentiment Analysis

### Tweet Processing Pipeline

1. **Fetch Tweets**: Get recent tweets mentioning the token
2. **Text Analysis**: Extract keywords and sentiment indicators
3. **Engagement Scoring**: Consider retweets, likes, replies
4. **Sentiment Classification**: Bullish, Bearish, or Neutral
5. **Confidence Calculation**: Measure analysis reliability

### Sentiment Indicators

**Bullish Indicators:**
- 🚀 (rocket emoji)
- "bullish", "bull run", "moon"
- "adoption", "institutional"
- "viral", "exploding", "breakout"
- "support", "accumulation"

**Bearish Indicators:**
- "bearish", "resistance"
- "selling", "decline"
- "scam", "rug pull"
- "red flags"

**Neutral Indicators:**
- "sideways", "consolidating"
- "stable", "waiting"

## 🎯 Trade Plan Logic

### Action Decision Matrix

| Sentiment | Confidence | Action |
|-----------|------------|--------|
| Bullish   | > 0.6      | BUY    |
| Bearish   | > 0.6      | SELL   |
| Neutral   | Any        | HOLD   |
| Any       | < 0.6      | HOLD   |

### Risk Assessment

- **Low Risk**: High confidence (>0.8) + strong sentiment (>0.7)
- **Medium Risk**: Moderate confidence (>0.6) + moderate sentiment (>0.5)
- **High Risk**: Low confidence or weak sentiment

### Position Sizing

```javascript
const baseAmount = 0.1; // Base trade amount in ETH
const amountMultiplier = Math.abs(sentimentScore) * confidence;
const amount = (baseAmount * amountMultiplier).toFixed(4);
```

## 🔐 Security Features

### EIP-712 Signatures
All trades are signed using EIP-712 for secure, typed data signing:

```javascript
const signature = await wallet.signTypedData(domain, types, message);
```

### Replay Protection
Each trade uses a unique nonce to prevent replay attacks.

### Authorization
Only the authorized signer can execute trades on behalf of the agent.

### Slippage Protection
Trades include minimum output amounts to protect against slippage.

## 🧪 Testing

### Run All Tests
```bash
node test-automated-trading.js
```

### Test Individual Components
```bash
# Test trading actions
npm run test:actions

# Test Twitter sentiment
npm run test:twitter

# Test smart contract integration
npm run test:trading
```

### Mock vs Real Data
The test suite uses mock data for demonstration. For production:

1. Replace mock tweet fetching with Twitter API
2. Use real price feeds for calculations
3. Deploy contracts to mainnet
4. Configure real RPC endpoints

## 📈 Example Usage

### Chat Interface
```
User: "Analyze ETH and make a trade"

Agent: 🤖 **Automated Trading Complete!**

📊 **Token:** ETH
📱 **Tweet Analysis:** 5 tweets analyzed, Bullish sentiment
📈 **Trade Plan:** BUY 0.08 ETH/USDC
💱 **Execution:** Trade executed on smart contract
🔗 **Transaction:** 0x1234...

*Full automation: Tweet analysis → Trade plan → Smart contract execution*
```

### API Response
```json
{
  "success": true,
  "message": "Trade executed successfully!",
  "tradePlan": {
    "action": "buy",
    "tokenPair": "ETH/USDC",
    "amount": "0.0800",
    "targetPrice": "3200.00",
    "sentimentScore": 0.75,
    "confidence": 0.8,
    "riskLevel": "medium"
  },
  "transactionHash": "0x1234..."
}
```

## 🚨 Risk Management

### Built-in Protections
- **Hold Recommendations**: Low confidence trades are held
- **Slippage Limits**: 2% maximum slippage tolerance
- **Deadline Protection**: Trades expire after 1 hour
- **Nonce Replay Protection**: Each trade is unique

### Best Practices
1. **Start Small**: Begin with small trade amounts
2. **Monitor Performance**: Track success rates
3. **Set Limits**: Configure maximum trade sizes
4. **Regular Reviews**: Periodically assess strategy
5. **Backup Plans**: Have manual override capabilities

## 🔄 Integration Points

### Twitter API
Replace mock tweet fetching with real Twitter API:

```javascript
// Real implementation
const tweets = await twitterClient.searchTweets({
  query: `${token} -is:retweet`,
  max_results: 10
});
```

### Price Feeds
Integrate with price oracle services:

```javascript
// Real price feed
const price = await priceOracle.getPrice(token);
```

### Portfolio Tracking
Add portfolio management:

```javascript
// Track positions
const portfolio = await portfolioManager.getPositions();
```

## 🛠️ Customization

### Adding New Tokens
1. Update `extractTokenFromInput()` function
2. Add token addresses to `tokenAddresses` mapping
3. Configure MockAMM pools for new tokens

### Modifying Sentiment Analysis
1. Update `analyzeTweetSentiment()` function
2. Add new sentiment indicators
3. Adjust confidence calculation logic

### Custom Trade Logic
1. Modify `generateTradePlan()` function
2. Implement custom risk models
3. Add technical analysis indicators

## 📞 Support

For questions or issues:
1. Check the test files for examples
2. Review smart contract documentation
3. Examine the plugin structure
4. Run tests to verify functionality

## 🎯 Next Steps

1. **Deploy to Testnet**: Test with real contracts
2. **Add Real APIs**: Integrate Twitter and price feeds
3. **Implement Monitoring**: Add performance tracking
4. **Enhance Security**: Add additional safety checks
5. **Scale Up**: Optimize for higher volume trading

---

**Disclaimer**: This is experimental software. Use at your own risk. Never trade more than you can afford to lose. 