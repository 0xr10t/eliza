import { Plugin, Action, IAgentRuntime, Memory, State } from "@elizaos/core";

interface TweetAnalysis {
  tweetsAnalyzed: number;
  overallSentiment: string;
  alphaSignals: number;
  topKeywords: string[];
  sentimentScore: number;
}

interface AlphaSignal {
  signal: string;
  confidence: number;
  risk: 'low' | 'medium' | 'high';
}

const twitterSentimentPlugin: Plugin = {
  name: "twitter-sentiment",
  description: "Analyzes Twitter sentiment and detects alpha signals",

  actions: [
    {
      name: "fetch_tweets",
      description: "Fetch and analyze tweets for sentiment",
      similes: ["twitter sentiment", "analyze tweets", "social sentiment"],
      examples: [
        [
          {
            user: "user",
            content: { text: "Fetch tweets for ETH" }
          },
          {
            user: "TradeBot",
            content: { 
              text: "**Twitter Sentiment Analysis for ETH**\n\n**Tweets Analyzed:** 10\n**Overall Sentiment:** Bullish\n**Alpha Signals:** 3 high-confidence signals detected\n**Top Keywords:** adoption, institutional, momentum\n\n*Analysis based on recent Twitter activity.*",
              action: "FETCH_TWEETS"
            }
          }
        ]
      ],
      handler: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        const text = message.content.text?.toLowerCase() || "";
        const token = extractToken(text);
        const analysis = await analyzeTwitterSentiment(token);
        
        return {
          text: `**Twitter Sentiment Analysis for ${token}**\n\n**Tweets Analyzed:** ${analysis.tweetsAnalyzed}\n**Overall Sentiment:** ${analysis.overallSentiment}\n**Alpha Signals:** ${analysis.alphaSignals} high-confidence signals detected\n**Top Keywords:** ${analysis.topKeywords.join(', ')}\n\n*Analysis based on recent Twitter activity.*`,
          action: "FETCH_TWEETS",
          metadata: { analysis }
        };
      },
      validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        const text = message.content.text?.toLowerCase() || "";
        return text.includes("fetch tweets") || text.includes("twitter sentiment");
      }
    },
    {
      name: "find_alpha_signals",
      description: "Find alpha signals from social media analysis",
      similes: ["alpha signals", "find alpha", "detect signals"],
      examples: [
        [
          {
            user: "user",
            content: { text: "Find alpha signals for BTC" }
          },
          {
            user: "TradeBot",
            content: { 
              text: "**Alpha Signal Analysis for BTC**\n\n**High-Confidence Alphas:** 5 signals\n**Average Alpha Score:** 8.2\n**Risk Distribution:** Low: 3, Medium: 2, High: 0\n**Top Signals:** institutional, adoption, momentum\n\n*Alpha signals detected from social media analysis.*",
              action: "ALPHA_ANALYSIS"
            }
          }
        ]
      ],
      handler: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        const text = message.content.text?.toLowerCase() || "";
        const token = extractToken(text);
        const alphaAnalysis = await findAlphaSignals(token);
        
        return {
          text: `**Alpha Signal Analysis for ${token}**\n\n**High-Confidence Alphas:** ${alphaAnalysis.signals.length} signals\n**Average Alpha Score:** ${alphaAnalysis.averageScore}\n**Risk Distribution:** Low: ${alphaAnalysis.riskDistribution.low}, Medium: ${alphaAnalysis.riskDistribution.medium}, High: ${alphaAnalysis.riskDistribution.high}\n**Top Signals:** ${alphaAnalysis.topSignals.join(', ')}\n\n*Alpha signals detected from social media analysis.*`,
          action: "ALPHA_ANALYSIS",
          metadata: { alphaAnalysis }
        };
      },
      validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        const text = message.content.text?.toLowerCase() || "";
        return text.includes("alpha signals") || text.includes("find alpha");
      }
    }
  ]
};

function extractToken(text: string): string {
  if (text.includes("eth")) return "ETH";
  if (text.includes("btc")) return "BTC";
  if (text.includes("sol")) return "SOL";
  return "ETH"; // default
}

async function analyzeTwitterSentiment(token: string): Promise<TweetAnalysis> {
  // Mock Twitter sentiment analysis
  const tweetsAnalyzed = Math.floor(Math.random() * 20) + 10;
  const sentimentScore = Math.random() * 2 - 1; // -1 to 1
  const overallSentiment = sentimentScore > 0.3 ? "Bullish" : sentimentScore < -0.3 ? "Bearish" : "Neutral";
  const alphaSignals = Math.floor(Math.random() * 5) + 1;
  const topKeywords = ["adoption", "institutional", "momentum", "innovation", "growth"];

  return {
    tweetsAnalyzed,
    overallSentiment,
    alphaSignals,
    topKeywords,
    sentimentScore
  };
}

async function findAlphaSignals(token: string): Promise<{
  signals: AlphaSignal[];
  averageScore: number;
  riskDistribution: { low: number; medium: number; high: number };
  topSignals: string[];
}> {
  // Mock alpha signal detection
  const signals: AlphaSignal[] = [
    { signal: "institutional", confidence: 0.9, risk: "low" },
    { signal: "adoption", confidence: 0.8, risk: "low" },
    { signal: "momentum", confidence: 0.7, risk: "medium" },
    { signal: "partnership", confidence: 0.6, risk: "medium" },
    { signal: "innovation", confidence: 0.5, risk: "high" }
  ];

  const averageScore = signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length;
  const riskDistribution = {
    low: signals.filter(s => s.risk === "low").length,
    medium: signals.filter(s => s.risk === "medium").length,
    high: signals.filter(s => s.risk === "high").length
  };
  const topSignals = signals.slice(0, 3).map(s => s.signal);

  return {
    signals,
    averageScore: parseFloat(averageScore.toFixed(1)),
    riskDistribution,
    topSignals
  };
}

export default twitterSentimentPlugin; 