import { Plugin, PluginContext } from "@elizaos/core";

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
  version: "1.0.0",

  async initialize(context: PluginContext) {
    console.log("Twitter Sentiment Plugin initialized");
  },

  async handleMessage(message: any, context: PluginContext) {
    const text = message.text?.toLowerCase() || "";

    // Handle tweet fetching requests
    if (text.includes("fetch tweets") || text.includes("twitter sentiment")) {
      const token = this.extractToken(text);
      const analysis = await this.analyzeTwitterSentiment(token);
      
      return {
        text: `**Twitter Sentiment Analysis for ${token}**\n\n**Tweets Analyzed:** ${analysis.tweetsAnalyzed}\n**Overall Sentiment:** ${analysis.overallSentiment}\n**Alpha Signals:** ${analysis.alphaSignals} high-confidence signals detected\n**Top Keywords:** ${analysis.topKeywords.join(', ')}\n\n*Analysis based on recent Twitter activity.*`,
        action: "FETCH_TWEETS",
        metadata: { analysis }
      };
    }

    // Handle alpha signal requests
    if (text.includes("alpha signals") || text.includes("find alpha")) {
      const token = this.extractToken(text);
      const alphaAnalysis = await this.findAlphaSignals(token);
      
      return {
        text: `**Alpha Signal Analysis for ${token}**\n\n**High-Confidence Alphas:** ${alphaAnalysis.signals.length} signals\n**Average Alpha Score:** ${alphaAnalysis.averageScore}\n**Risk Distribution:** Low: ${alphaAnalysis.riskDistribution.low}, Medium: ${alphaAnalysis.riskDistribution.medium}, High: ${alphaAnalysis.riskDistribution.high}\n**Top Signals:** ${alphaAnalysis.topSignals.join(', ')}\n\n*Alpha signals detected from social media analysis.*`,
        action: "ALPHA_ANALYSIS",
        metadata: { alphaAnalysis }
      };
    }

    return null;
  },

  extractToken(text: string): string {
    if (text.includes("eth")) return "ETH";
    if (text.includes("btc")) return "BTC";
    if (text.includes("sol")) return "SOL";
    return "ETH"; // default
  },

  async analyzeTwitterSentiment(token: string): Promise<TweetAnalysis> {
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
  },

  async findAlphaSignals(token: string): Promise<{
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
};

export default twitterSentimentPlugin; 