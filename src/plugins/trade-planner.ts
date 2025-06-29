import { Plugin, Action, Handler, Validator, IAgentRuntime, Memory, State } from "@elizaos/core";

interface TradePlan {
  action: 'buy' | 'sell' | 'hold';
  tokenPair: string;
  amount: string;
  targetPrice: string;
  sentimentScore: number;
  confidence: number;
}

interface SentimentAnalysis {
  sentimentScore: number;
  recommendedAction: 'buy' | 'sell' | 'hold';
  tokenPair: string;
  amount: string;
  confidence: number;
}

const tradePlannerPlugin: Plugin = {
  name: "trade-planner",
  description: "Analyzes trading sentiment and generates trade plans",

  actions: [
    {
      name: "generate_trade_plan",
      description: "Analyzes market sentiment and generates trading recommendations",
      similes: ["analyze sentiment", "create trade plan", "trading analysis"],
      examples: [
        [
          {
            user: "user",
            content: { text: "What do you think about ETH right now?" }
          },
          {
            user: "TradeBot",
            content: { 
              text: "**Trading Signal Detected!**\n\nAction: BUY\nPair: ETH/USDC\nAmount: 0.1 ETH\nTarget: 3200.00 USD\nSentiment Score: 0.75\n\nRemember: This is analysis only, not financial advice.",
              action: "GENERATE_TRADE_PLAN"
            }
          }
        ]
      ],
      handler: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        const text = message.content.text?.toLowerCase() || "";
        
        // Check if message contains trading-related keywords
        const tradingKeywords = [
          'eth', 'btc', 'sol', 'usdc', 'moon', 'pump', 'dump', 'bull', 'bear',
          'hodl', 'fomo', 'fud', 'trading', 'crypto', 'token', 'price'
        ];

        const hasTradingContent = tradingKeywords.some(keyword => 
          text.includes(keyword)
        );

        if (!hasTradingContent) {
          return null;
        }

        // Analyze sentiment
        const sentimentAnalysis = await analyzeSentiment(text);
        
        // Generate trade plan
        const tradePlan = generateTradePlan(sentimentAnalysis);

        // Format response
        const response = formatTradeResponse(tradePlan);

        return {
          text: response,
          action: "GENERATE_TRADE_PLAN",
          metadata: {
            sentimentAnalysis,
            tradePlan
          }
        };
      },
      validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        const text = message.content.text?.toLowerCase() || "";
        const tradingKeywords = [
          'eth', 'btc', 'sol', 'usdc', 'moon', 'pump', 'dump', 'bull', 'bear',
          'hodl', 'fomo', 'fud', 'trading', 'crypto', 'token', 'price'
        ];
        return tradingKeywords.some(keyword => text.includes(keyword));
      }
    }
  ]
};

async function analyzeSentiment(text: string): Promise<SentimentAnalysis> {
  // Mock sentiment analysis - in real implementation, this would use AI APIs
  const sentimentScore = Math.random() * 2 - 1; // -1 to 1
  
  let recommendedAction: 'buy' | 'sell' | 'hold';
  if (sentimentScore > 0.3) {
    recommendedAction = 'buy';
  } else if (sentimentScore < -0.3) {
    recommendedAction = 'sell';
  } else {
    recommendedAction = 'hold';
  }

  // Extract token from text
  let tokenPair = 'ETH/USDC';
  if (text.includes('btc')) tokenPair = 'BTC/USDC';
  if (text.includes('sol')) tokenPair = 'SOL/USDC';

  return {
    sentimentScore,
    recommendedAction,
    tokenPair,
    amount: '0.1',
    confidence: Math.abs(sentimentScore)
  };
}

function generateTradePlan(sentimentAnalysis: SentimentAnalysis): TradePlan {
  const { sentimentScore, recommendedAction, tokenPair, amount, confidence } = sentimentAnalysis;
  
  // Calculate target price based on sentiment
  const basePrice = 3000; // Mock base price
  const targetPrice = sentimentScore > 0 
    ? basePrice * (1 + Math.abs(sentimentScore) * 0.1)
    : basePrice * (1 - Math.abs(sentimentScore) * 0.1);

  return {
    action: recommendedAction,
    tokenPair,
    amount,
    targetPrice: targetPrice.toFixed(2),
    sentimentScore,
    confidence
  };
}

function formatTradeResponse(tradePlan: TradePlan): string {
  const { action, tokenPair, amount, targetPrice, sentimentScore } = tradePlan;
  
  return `**Trading Signal Detected!**

Action: ${action.toUpperCase()}
Pair: ${tokenPair}
Amount: ${amount} ${tokenPair.split('/')[0]}
Target: ${targetPrice} USD
Sentiment Score: ${sentimentScore.toFixed(2)}

Remember: This is analysis only, not financial advice.`;
}

export default tradePlannerPlugin; 