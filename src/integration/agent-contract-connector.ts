import { ethers } from "ethers";

// Smart Contract ABIs
const AGENT_ABI = [
  "function executeSwap(tuple(address tokenOut, uint256 amountIn, uint256 minAmountOut, uint256 deadline, uint256 nonce) data, bytes signature) external",
  "function addFunds() external payable",
  "function withdrawFunds() external",
  "function pauseAgent() public",
  "function resumeAgent() public",
  "function getUserFunds() external view returns (uint256)",
  "function getPausedState() external view returns (bool)",
  "function getAuthorizedSigner() external view returns (address)",
  "function getOwner() external view returns (address)",
  "event Agent__TradeExecuted(address indexed user, address indexed tokenOut, uint256 amountIn)",
  "event Agent__FundsAdded(address indexed user, uint256 amountAdded)",
  "event Agent__FundsWithdrawan(address indexed user, uint256 amountWithdrawn)"
];

const FACTORY_ABI = [
  "function createAgent(address[] memory _tokens, uint8 _platformType, address authorizedSigner) external payable returns (address)",
  "function getAgentInfo(address user, uint256 index) external view returns (tuple(address agentAddress, address owner, address[] tokens, uint256 amountInvested, uint8 platformType))",
  "event Factory__AgentCreated(address indexed agentAddress, uint8 indexed platform, address[] indexed tokens)"
];

interface TradeData {
  tokenOut: string;
  amountIn: string;
  minAmountOut: string;
  deadline: number;
  nonce: number;
}

interface UserPreferences {
  walletAddress: string;
  investmentAmount: string;
  preferredTokens: string[];
  riskTolerance: 'low' | 'medium' | 'high';
  maxSlippage: number;
}

interface SentimentAnalysis {
  sentimentScore: number;
  recommendedAction: 'buy' | 'sell' | 'hold';
  tokenPair: string;
  amount: string;
  confidence: number;
}

export class AgentContractConnector {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private factoryContract: ethers.Contract;
  private agentContract: ethers.Contract | null = null;
  
  constructor(
    private rpcUrl: string,
    private privateKey: string,
    private factoryAddress: string,
    private agentAddress?: string
  ) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    
    this.factoryContract = new ethers.Contract(
      factoryAddress,
      FACTORY_ABI,
      this.wallet
    );
    
    if (agentAddress) {
      this.agentContract = new ethers.Contract(
        agentAddress,
        AGENT_ABI,
        this.wallet
      );
    }
  }

  // Create a new trading agent
  async createAgent(
    tokens: string[],
    platformType: number, // 0=Twitter, 1=Telegram, 2=Discord
    investmentAmount: string
  ): Promise<string> {
    try {
      const tx = await this.factoryContract.createAgent(
        tokens,
        platformType,
        this.wallet.address, // authorized signer
        { value: ethers.parseEther(investmentAmount) }
      );
      
      const receipt = await tx.wait();
      
      // Extract agent address from event
      const event = receipt.events?.find(e => e.event === 'Factory__AgentCreated');
      const agentAddress = event?.args?.agentAddress;
      
      if (agentAddress) {
        this.agentContract = new ethers.Contract(
          agentAddress,
          AGENT_ABI,
          this.wallet
        );
      }
      
      return agentAddress;
    } catch (error) {
      console.error("Error creating agent:", error);
      throw error;
    }
  }

  // Set agent contract address
  setAgentContract(agentAddress: string) {
    this.agentContract = new ethers.Contract(
      agentAddress,
      AGENT_ABI,
      this.wallet
    );
  }

  // Get user's agent information
  async getAgentInfo(userAddress: string, index: number = 0) {
    try {
      const info = await this.factoryContract.getAgentInfo(userAddress, index);
      return {
        agentAddress: info.agentAddress,
        owner: info.owner,
        tokens: info.tokens,
        amountInvested: ethers.formatEther(info.amountInvested),
        platformType: this.getPlatformName(info.platformType)
      };
    } catch (error) {
      console.error("Error getting agent info:", error);
      throw error;
    }
  }

  // Get agent balance
  async getAgentBalance(): Promise<string> {
    if (!this.agentContract) {
      throw new Error("Agent contract not set");
    }
    
    try {
      const balance = await this.agentContract.getUserFunds();
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("Error getting agent balance:", error);
      throw error;
    }
  }

  // Add funds to agent
  async addFunds(amount: string): Promise<string> {
    if (!this.agentContract) {
      throw new Error("Agent contract not set");
    }
    
    try {
      const tx = await this.agentContract.addFunds({
        value: ethers.parseEther(amount)
      });
      
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error) {
      console.error("Error adding funds:", error);
      throw error;
    }
  }

  // Withdraw funds from agent
  async withdrawFunds(): Promise<string> {
    if (!this.agentContract) {
      throw new Error("Agent contract not set");
    }
    
    try {
      const tx = await this.agentContract.withdrawFunds();
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      throw error;
    }
  }

  // Pause agent
  async pauseAgent(): Promise<string> {
    if (!this.agentContract) {
      throw new Error("Agent contract not set");
    }
    
    try {
      const tx = await this.agentContract.pauseAgent();
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error) {
      console.error("Error pausing agent:", error);
      throw error;
    }
  }

  // Resume agent
  async resumeAgent(): Promise<string> {
    if (!this.agentContract) {
      throw new Error("Agent contract not set");
    }
    
    try {
      const tx = await this.agentContract.resumeAgent();
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error) {
      console.error("Error resuming agent:", error);
      throw error;
    }
  }

  // Execute trade based on sentiment analysis
  async executeTradeFromSentiment(
    sentimentAnalysis: SentimentAnalysis,
    userPreferences: UserPreferences
  ): Promise<string> {
    if (!this.agentContract) {
      throw new Error("Agent contract not set");
    }
    
    try {
      // Create trade data
      const tradeData = this.createTradeData(sentimentAnalysis, userPreferences);
      
      // Create EIP-712 signature
      const signature = await this.createSignature(tradeData);
      
      // Execute trade
      const tx = await this.agentContract.executeSwap(tradeData, signature);
      const receipt = await tx.wait();
      
      return receipt.transactionHash;
    } catch (error) {
      console.error("Error executing trade:", error);
      throw error;
    }
  }

  // Create trade data from sentiment analysis
  private createTradeData(
    sentiment: SentimentAnalysis,
    preferences: UserPreferences
  ): TradeData {
    const [tokenIn, tokenOut] = sentiment.tokenPair.split('/');
    
    // Calculate amount based on sentiment confidence and user preferences
    const baseAmount = parseFloat(preferences.investmentAmount);
    const confidenceMultiplier = sentiment.confidence;
    const amountIn = baseAmount * confidenceMultiplier;
    
    // Calculate minimum output with slippage protection
    const slippageMultiplier = 1 - (preferences.maxSlippage / 100);
    const minAmountOut = amountIn * slippageMultiplier;
    
    return {
      tokenOut: this.getTokenAddress(tokenOut),
      amountIn: ethers.parseEther(amountIn.toString()).toString(),
      minAmountOut: ethers.parseEther(minAmountOut.toString()).toString(),
      deadline: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      nonce: Date.now()
    };
  }

  // Create EIP-712 signature for trade
  private async createSignature(tradeData: TradeData): Promise<string> {
    const domain = {
      name: 'Agent',
      version: '1',
      chainId: await this.provider.getNetwork().then(n => n.chainId),
      verifyingContract: await this.agentContract!.getAddress()
    };

    const types = {
      TradeData: [
        { name: 'tokenOut', type: 'address' },
        { name: 'amountIn', type: 'uint256' },
        { name: 'minAmountOut', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
        { name: 'nonce', type: 'uint256' }
      ]
    };

    const signature = await this.wallet.signTypedData(domain, types, tradeData);
    return signature;
  }

  // Get token address (mock implementation)
  private getTokenAddress(tokenSymbol: string): string {
    const tokenAddresses: { [key: string]: string } = {
      'USDC': '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8C',
      'ETH': '0x0000000000000000000000000000000000000000',
      'BTC': '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      'SOL': '0xD31a59c85aE9D8edEFeC411D448f90841571b89c'
    };
    
    return tokenAddresses[tokenSymbol] || tokenAddresses['USDC'];
  }

  // Get platform name
  private getPlatformName(platformType: number): string {
    const platforms = ['Twitter', 'Telegram', 'Discord'];
    return platforms[platformType] || 'Unknown';
  }

  // Monitor agent events
  async monitorAgentEvents(callback: (event: any) => void) {
    if (!this.agentContract) {
      throw new Error("Agent contract not set");
    }
    
    this.agentContract.on('Agent__TradeExecuted', callback);
    this.agentContract.on('Agent__FundsAdded', callback);
    this.agentContract.on('Agent__FundsWithdrawan', callback);
  }

  // Stop monitoring events
  async stopMonitoring() {
    if (!this.agentContract) {
      return;
    }
    
    this.agentContract.removeAllListeners();
  }
}

// Export for use in other modules
export default AgentContractConnector; 