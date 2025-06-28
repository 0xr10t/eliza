# Eliza Trading Bot

A specialized AI trading assistant built on the ElizaOS platform that analyzes market sentiment and generates trade plans.

## Features

- **Sentiment Analysis**: Analyzes social media posts and messages for trading sentiment
- **Trade Plan Generation**: Creates actionable trade plans based on sentiment analysis
- **Batch Analysis**: Processes multiple posts simultaneously for comprehensive market analysis
- **Real-time Processing**: Responds to crypto-related messages with trading insights

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Add your API keys
GEMINI_API_KEY=your_gemini_api_key_here
```

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key and add it to your `.env` file

**Note**: Gemini API has a generous free tier (15 requests per minute, 1500 requests per day), making it perfect for development and testing.

## Usage

### Starting the Simplified Trading Bot (Recommended)

```bash
npm run start:simple
```

This bypasses the complex ElizaOS initialization and provides a fast, interactive trading bot.

### Starting the Full ElizaOS Trading Bot

```bash
npm start
```

**Note**: The full version may take longer to initialize due to complex service dependencies.

### Example Interactions

#### Single Message Analysis
```
User: "ETH is going to moon!"
TradeBot: "strong bullish sentiment detected! generating trade plan..."
```

#### Batch Analysis
```
User: "batch"
TradeBot: "analyzing multiple posts for trading signals..."
```

## Supported Tokens

The bot currently analyzes sentiment for:
- ETH (Ethereum)
- USDC (USD Coin)
- SOL (Solana)
- BTC (Bitcoin)

## Trading Actions

### Single Message Analysis
- Triggers when crypto tokens are mentioned
- Analyzes sentiment and generates trade plans
- Provides buy/sell recommendations with price thresholds

### Batch Analysis
- Processes multiple social media posts
- Identifies strong trading signals across multiple sources
- Provides comprehensive market sentiment analysis

## Configuration

The bot can be customized by modifying `src/simple-trading-bot.ts`:

- **Sentiment Threshold**: Adjust the sensitivity (currently 0.3)
- **Trade Amounts**: Modify the default trade sizes
- **Price Thresholds**: Change the buy/sell price levels
- **Supported Tokens**: Add or remove tokens from analysis

## Plugin Architecture

The trading functionality is implemented as a plugin (`src/plugins/trade-planner.ts`) that includes:

- **Providers**: Sentiment analysis and trade plan generation
- **Actions**: Single and batch trading analysis
- **Services**: Market data integration (expandable)

## Development

### Adding New Features

1. **New Tokens**: Add to `supportedTokens` array in the plugin
2. **New Actions**: Create new action handlers in the plugin
3. **Enhanced Analysis**: Extend the sentiment analysis logic

### Testing

```bash
# Build the project
npm run build

# Start the simplified bot
npm run start:simple

# Start the full ElizaOS bot
npm start
```

## Troubleshooting

### Common Issues

1. **"GEMINI_API_KEY environment variable is required!"**
   - Make sure you have a `.env` file with your Gemini API key
   - Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. **Bot stuck on "Initializing LlamaService..."**
   - Use the simplified version: `npm run start:simple`
   - This bypasses complex ElizaOS initialization

3. **API Rate Limits**
   - Gemini API has generous limits (15 req/min, 1500 req/day)
   - If you hit limits, wait a minute and try again

## Disclaimer

This trading bot is for educational and research purposes. Always do your own research and consider the risks involved in cryptocurrency trading. The bot's recommendations should not be considered as financial advice.

## License

This project is licensed under the same terms as the ElizaOS platform.