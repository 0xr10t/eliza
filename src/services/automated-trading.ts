import { ethers } from 'ethers';
import { Plugin, IAgentRuntime, Memory, State } from "@elizaos/core";

// Smart Contract ABI for Agent contract
const AGENT_ABI = [
  "function executeSwap(tuple(address tokenOut, uint256 amountIn, uint256 minAmountOut, uint256 deadline, uint256 nonce) data, bytes signature) external",
  "function getUserFunds() external view returns (uint256)",
  "function getAuthorizedSigner() external view returns (address)",
  "function getPausedState() external view returns (bool)",
  "function getDomainSeparator() external view returns (bytes32)",
  "function calculateDigest(tuple(address tokenOut, uint256 amountIn, uint256 minAmountOut, uint256 deadline, uint256 nonce) data) external view returns (bytes32)",
  "event Agent__TradeExecuted(address indexed user, address indexed tokenOut, uint256 amountIn, uint256 amountOut)"
];

// Mock AMM ABI
const MOCK_AMM_ABI = [
  "function getAmountOut(address tokenOut, uint256 ethAmount) external view returns (uint256)",
  "function swapETHForTokens(address tokenOut, uint256 minAmountOut) external payable returns (uint256)"
];

interface TradeData {
  tokenOut: string;
  amountIn: string;
  minAmountOut: string;
  deadline: number;
  nonce: number;
}

interface SentimentAnalysis {
  sentimentScore: number;
  confidence: number;
  keywords: string[];
  overallSentiment: 'bullish' | 'bearish' | 'neutral';
}

interface TradePlan {
  action: 'buy' | 'sell' | 'hold';
  tokenPair: string;
  amount: string;
  targetPrice: string;
  sentimentScore: number;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
}

interface TweetData {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
}

class AutomatedTradingService {
  private provider: ethers.Provider;
  private agentContract: ethers.Contract;
  private mockAMMContract: ethers.Contract;
  private wallet: ethers.Wallet;
  private nonceCounter: number = 0;

  constructor(
    private rpcUrl: string,
    private privateKey: string,
    private agentAddress: string,
    private mockAMMAddress: string
  ) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.agentContract = new ethers.Contract(agentAddress, AGENT_ABI, this.wallet);
    this.mockAMMContract = new ethers.Contract(mockAMMAddress, MOCK_AMM_ABI, this.wallet);
  }

  async processTradingRequest(userInput: string): Promise<{
    success: boolean;
    message: string;
    tradePlan?: TradePlan;
    transactionHash?: string;
    error?: string;
  }> {
    try {
      console.log('🤖 Starting automated trading process...');
      
      const token = this.extractTokenFromInput(userInput);
      console.log(`📊 Token identified: ${token}`);

      const tweetAnalysis = await this.fetchAndAnalyzeTweets(token);
      console.log(`📱 Tweet analysis completed. Sentiment: ${tweetAnalysis.overallSentiment}`);

      const tradePlan = await this.generateTradePlan(token, tweetAnalysis);
      console.log(`📈 Trade plan generated: ${tradePlan.action} ${tradePlan.amount} ${token}`);

      const isPaused = await this.agentContract.getPausedState();
      if (isPaused) {
        return {
          success: false,
          message: 'Agent is currently paused. Cannot execute trades.',
          tradePlan
        };
      }

      if (tradePlan.action !== 'hold') {
        const tradeResult = await this.executeTradeOnContract(tradePlan);
        console.log(`💱 Trade executed: ${tradeResult.transactionHash}`);
        
        return {
          success: true,
          message: `Trade executed successfully! ${tradePlan.action.toUpperCase()} ${tradePlan.amount} ${token}`,
          tradePlan,
          transactionHash: tradeResult.transactionHash
        };
      } else {
        return {
          success: true,
          message: `Hold recommendation based on ${tweetAnalysis.overallSentiment} sentiment`,
          tradePlan
        };
      }

    } catch (error) {
      console.error('❌ Error in automated trading process:', error);
      return {
        success: false,
        message: 'Failed to process trading request',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private extractTokenFromInput(input: string): string {
    const text = input.toLowerCase();
    if (text.includes('ethereum') || text.includes('eth')) return 'ETH';
    if (text.includes('bitcoin') || text.includes('btc')) return 'BTC';
    if (text.includes('solana') || text.includes('sol')) return 'SOL';
    if (text.includes('usdc') || text.includes('usd coin')) return 'USDC';
    if (text.includes('dai')) return 'DAI';
    if (text.includes('weth')) return 'WETH';
    return 'ETH';
  }

  private async fetchAndAnalyzeTweets(token: string): Promise<SentimentAnalysis> {
    console.log(`🐦 Fetching tweets for ${token}...`);
    
    const mockTweets: TweetData[] = this.generateMockTweets(token);
    const sentimentResults = await Promise.all(
      mockTweets.map(tweet => this.analyzeTweetSentiment(tweet.text))
    );
    
    const avgSentimentScore = sentimentResults.reduce((sum, result) => sum + result.sentimentScore, 0) / sentimentResults.length;
    const avgConfidence = sentimentResults.reduce((sum, result) => sum + result.confidence, 0) / sentimentResults.length;
    
    const allKeywords = sentimentResults.flatMap(result => result.keywords);
    const uniqueKeywords = [...new Set(allKeywords)].slice(0, 5);
    
    let overallSentiment: 'bullish' | 'bearish' | 'neutral';
    if (avgSentimentScore > 0.3) {
      overallSentiment = 'bullish';
    } else if (avgSentimentScore < -0.3) {
      overallSentiment = 'bearish';
    } else {
      overallSentiment = 'neutral';
    }
    
    return {
      sentimentScore: avgSentimentScore,
      confidence: avgConfidence,
      keywords: uniqueKeywords,
      overallSentiment
    };
  }

  private generateMockTweets(token: string): TweetData[] {
    const bullishTweets = [
      `${token} looking bullish! Institutional adoption is growing rapidly. This is just the beginning of the bull run! 🚀`,
      `${token} showing strong support. Volume spike indicates accumulation phase. Whales are buying!`,
      `${token} ecosystem is exploding! New partnerships and adoption metrics are off the charts. This is viral growth!`,
      `${token} adoption continues to grow. More merchants accepting ${token}. This is the future of payments!`,
      `${token} technical analysis shows breakout potential. RSI and MACD indicators are bullish!`
    ];
    
    const bearishTweets = [
      `${token} showing bearish signals. Support levels are being tested.`,
      `Be careful with ${token}. Looks like potential downside. Technical indicators are weak.`,
      `${token} facing resistance at key levels. Volume is declining.`,
      `${token} market sentiment is turning negative. Institutional selling pressure.`
    ];
    
    const neutralTweets = [
      `${token} trading sideways. Waiting for clear direction.`,
      `${token} consolidating at current levels. No clear trend yet.`,
      `${token} market is stable. No significant moves expected.`
    ];
    
    const allTweets = [...bullishTweets, ...bearishTweets, ...neutralTweets];
    const selectedTweets = allTweets.slice(0, 5);
    
    return selectedTweets.map((text, index) => ({
      id: `tweet_${index}`,
      text,
      author_id: `user_${index}`,
      created_at: new Date().toISOString(),
      public_metrics: {
        retweet_count: Math.floor(Math.random() * 200) + 10,
        reply_count: Math.floor(Math.random() * 50) + 5,
        like_count: Math.floor(Math.random() * 1000) + 100,
        quote_count: Math.floor(Math.random() * 30) + 2
      }
    }));
  }

  private async analyzeTweetSentiment(tweetText: string): Promise<{
    sentimentScore: number;
    confidence: number;
    keywords: string[];
  }> {
    const text = tweetText.toLowerCase();
    let sentimentScore = 0;
    let confidence = 0.5;
    const keywords: string[] = [];
    
    if (text.includes('bullish') || text.includes('bull run') || text.includes('🚀')) {
      sentimentScore += 0.8;
      confidence = Math.max(confidence, 0.8);
      keywords.push('bullish', 'momentum');
    }
    
    if (text.includes('adoption') || text.includes('institutional')) {
      sentimentScore += 0.7;
      confidence = Math.max(confidence, 0.7);
      keywords.push('adoption', 'institutional');
    }
    
    if (text.includes('viral') || text.includes('exploding')) {
      sentimentScore += 0.9;
      confidence = Math.max(confidence, 0.9);
      keywords.push('viral', 'growth');
    }
    
    if (text.includes('breakout') || text.includes('support')) {
      sentimentScore += 0.6;
      keywords.push('technical', 'breakout');
    }
    
    if (text.includes('bearish') || text.includes('resistance')) {
      sentimentScore -= 0.8;
      confidence = Math.max(confidence, 0.8);
      keywords.push('bearish', 'resistance');
    }
    
    if (text.includes('selling') || text.includes('decline')) {
      sentimentScore -= 0.6;
      keywords.push('selling', 'decline');
    }
    
    if (text.includes('sideways') || text.includes('consolidating')) {
      sentimentScore *= 0.5;
      keywords.push('sideways', 'consolidation');
    }
    
    sentimentScore = Math.max(-1, Math.min(1, sentimentScore));
    
    return {
      sentimentScore,
      confidence,
      keywords
    };
  }

  private async generateTradePlan(token: string, sentimentAnalysis: SentimentAnalysis): Promise<TradePlan> {
    const { sentimentScore, confidence, overallSentiment } = sentimentAnalysis;
    
    let action: 'buy' | 'sell' | 'hold';
    if (overallSentiment === 'bullish' && confidence > 0.6) {
      action = 'buy';
    } else if (overallSentiment === 'bearish' && confidence > 0.6) {
      action = 'sell';
    } else {
      action = 'hold';
    }
    
    const baseAmount = 0.1;
    const amountMultiplier = Math.abs(sentimentScore) * confidence;
    const amount = (baseAmount * amountMultiplier).toFixed(4);
    
    const basePrice = 3000;
    const priceChange = sentimentScore * 0.1;
    const targetPrice = (basePrice * (1 + priceChange)).toFixed(2);
    
    let riskLevel: 'low' | 'medium' | 'high';
    if (confidence > 0.8 && Math.abs(sentimentScore) > 0.7) {
      riskLevel = 'low';
    } else if (confidence > 0.6 && Math.abs(sentimentScore) > 0.5) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'high';
    }
    
    return {
      action,
      tokenPair: `${token}/USDC`,
      amount,
      targetPrice,
      sentimentScore,
      confidence,
      riskLevel
    };
  }

  private async executeTradeOnContract(tradePlan: TradePlan): Promise<{ transactionHash: string }> {
    console.log(`💱 Executing trade on smart contract: ${tradePlan.action} ${tradePlan.amount} ${tradePlan.tokenPair}`);
    
    const tokenAddresses: { [key: string]: string } = {
      'ETH': '0x0000000000000000000000000000000000000000',
      'WETH': '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      'USDC': '0xA0b86a33E6441b8C4C8C8C8C8C8C8C8C8C8C8C8C',
      'DAI': '0x6B175474E89094C44Da98b954EedeAC495271d0F'
    };
    
    const tokenOut = tokenAddresses[tradePlan.tokenPair.split('/')[0]] || tokenAddresses['USDC'];
    const amountIn = ethers.parseEther(tradePlan.amount);
    const minAmountOut = amountIn * BigInt(98) / BigInt(100);
    
    const tradeData: TradeData = {
      tokenOut,
      amountIn: amountIn.toString(),
      minAmountOut: minAmountOut.toString(),
      deadline: Math.floor(Date.now() / 1000) + 3600,
      nonce: ++this.nonceCounter
    };
    
    const domainSeparator = await this.agentContract.getDomainSeparator();
    const signature = await this.createEIP712Signature(tradeData, domainSeparator);
    
    const tx = await this.agentContract.executeSwap(tradeData, signature);
    const receipt = await tx.wait();
    
    return {
      transactionHash: receipt.hash
    };
  }

  private async createEIP712Signature(tradeData: TradeData, domainSeparator: string): Promise<string> {
    const types = {
      TradeData: [
        { name: 'tokenOut', type: 'address' },
        { name: 'amountIn', type: 'uint256' },
        { name: 'minAmountOut', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
        { name: 'nonce', type: 'uint256' }
      ]
    };
    
    const chainId = await this.provider.getNetwork().then(net => net.chainId);
    const contractAddress = typeof this.agentContract.target === 'string' 
      ? this.agentContract.target 
      : await this.agentContract.target.getAddress();
    
    const domain = {
      name: 'Agent',
      version: '1',
      chainId,
      verifyingContract: contractAddress
    };
    
    const message = {
      tokenOut: tradeData.tokenOut,
      amountIn: tradeData.amountIn,
      minAmountOut: tradeData.minAmountOut,
      deadline: tradeData.deadline,
      nonce: tradeData.nonce
    };
    
    const signature = await this.wallet.signTypedData(domain, types, message);
    return signature;
  }

  async getUserFunds(): Promise<string> {
    const funds = await this.agentContract.getUserFunds();
    return ethers.formatEther(funds);
  }

  async getAgentStatus(): Promise<{
    isPaused: boolean;
    userFunds: string;
    authorizedSigner: string;
  }> {
    const [isPaused, userFunds, authorizedSigner] = await Promise.all([
      this.agentContract.getPausedState(),
      this.agentContract.getUserFunds(),
      this.agentContract.getAuthorizedSigner()
    ]);
    
    return {
      isPaused,
      userFunds: ethers.formatEther(userFunds),
      authorizedSigner
    };
  }
}

let automatedTradingService: AutomatedTradingService;

const automatedTradingPlugin: Plugin = {
  name: "automated-trading",
  description: "Fully automated trading agent that analyzes tweets, generates trade plans, and executes trades on smart contracts",

  actions: [
    {
      name: "automated_trade",
      description: "Process trading request with full automation: tweet analysis -> trade plan -> smart contract execution",
      similes: ["trade", "analyze and trade", "automated trading", "smart trading"],
      examples: [
        [
          {
            user: "user",
            content: { text: "Analyze ETH and make a trade" }
          },
          {
            user: "TradeBot",
            content: { 
              text: "🤖 **Automated Trading Complete!**\n\n📊 **Token:** ETH\n📱 **Tweet Analysis:** 5 tweets analyzed, Bullish sentiment\n📈 **Trade Plan:** BUY 0.08 ETH/USDC\n💱 **Execution:** Trade executed on smart contract\n🔗 **Transaction:** 0x1234...\n\n*Full automation: Tweet analysis → Trade plan → Smart contract execution*",
              action: "AUTOMATED_TRADE"
            }
          }
        ]
      ],
      handler: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        const text = message.content.text || "";
        
        if (!automatedTradingService) {
          automatedTradingService = new AutomatedTradingService(
            process.env.RPC_URL || "http://localhost:8545",
            process.env.PRIVATE_KEY || "",
            process.env.AGENT_CONTRACT_ADDRESS || "",
            process.env.MOCK_AMM_ADDRESS || ""
          );
        }
        
        const result = await automatedTradingService.processTradingRequest(text);
        
        if (result.success) {
          return {
            text: result.message,
            action: "AUTOMATED_TRADE",
            metadata: {
              tradePlan: result.tradePlan,
              transactionHash: result.transactionHash
            }
          };
        } else {
          return {
            text: `❌ **Trading Failed:** ${result.message}`,
            action: "AUTOMATED_TRADE_ERROR",
            metadata: { error: result.error }
          };
        }
      },
      validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        const text = message.content.text?.toLowerCase() || "";
        const tradingKeywords = [
          'eth', 'btc', 'sol', 'usdc', 'trade', 'analyze', 'automated',
          'ethereum', 'bitcoin', 'solana', 'trading'
        ];
        return tradingKeywords.some(keyword => text.includes(keyword));
      }
    }
  ]
};

export default automatedTradingPlugin;
export { AutomatedTradingService };
