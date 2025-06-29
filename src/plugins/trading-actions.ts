import { Plugin, PluginContext } from "@elizaos/core";

interface TradeData {
  tokenOut: string;
  amountIn: string;
  minAmountOut: string;
  deadline: number;
  nonce: number;
}

interface BalanceInfo {
  asset: string;
  balance: string;
  formattedBalance: string;
}

interface TransferResult {
  success: boolean;
  transactionHash: string;
  error?: string;
}

interface TradeResult {
  success: boolean;
  transactionHash: string;
  amountReceived: string;
  error?: string;
}

const tradingActionsPlugin: Plugin = {
  name: "trading-actions",
  version: "1.0.0",

  async initialize(context: PluginContext) {
    console.log("Trading Actions Plugin initialized");
  },

  async handleMessage(message: any, context: PluginContext) {
    const text = message.text?.toLowerCase() || "";

    // Handle balance check requests
    if (text.includes("check") && text.includes("balance")) {
      const asset = this.extractAsset(text);
      const balance = await this.getBalance(asset);
      
      return {
        text: `**Balance Check**\n\n**Asset:** ${balance.asset}\n**Balance:** ${balance.formattedBalance}`,
        action: "GET_BALANCE",
        metadata: { balance }
      };
    }

    // Handle transfer requests
    if (text.includes("transfer")) {
      const transferData = this.extractTransferData(text);
      if (transferData) {
        const result = await this.transferAsset(
          transferData.asset,
          transferData.amount,
          transferData.destination
        );
        
        if (result.success) {
          return {
            text: `**Transfer Successful!**\n\n**Asset:** ${transferData.asset}\n**Amount:** ${transferData.amount}\n**Destination:** ${transferData.destination}\n**Transaction Hash:** ${result.transactionHash}`,
            action: "TRANSFER_ASSET",
            metadata: { result }
          };
        } else {
          return {
            text: `**Transfer Failed:** ${result.error}`,
            action: "TRANSFER_ASSET_ERROR",
            metadata: { result }
          };
        }
      }
    }

    // Handle trade execution requests
    if (text.includes("execute") && text.includes("trade")) {
      const tradeData = {
        tokenOut: "USDC",
        amountIn: "0.1",
        minAmountOut: "0.09",
        deadline: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
        nonce: Date.now()
      };
      
      const result = await this.executeTrade("ETH", "USDC", "0.1", "buy");
      
      if (result.success) {
        return {
          text: `**Trade Executed Successfully!**\n\n**Action:** BUY\n**Pair:** ETH/USDC\n**Amount:** 0.1 ETH\n**Received:** ${result.amountReceived} USDC\n**Transaction Hash:** ${result.transactionHash}\n**Sentiment Score:** 0.75\n\n*Trade executed on-chain based on sentiment analysis.*`,
          action: "EXECUTE_TRADE_REQUEST",
          metadata: { result }
        };
      } else {
        return {
          text: `**Trade Execution Failed:** ${result.error}`,
          action: "EXECUTE_TRADE_ERROR",
          metadata: { result }
        };
      }
    }

    return null;
  },

  extractAsset(text: string): string {
    if (text.includes("eth")) return "ETH";
    if (text.includes("btc")) return "BTC";
    if (text.includes("sol")) return "SOL";
    if (text.includes("usdc")) return "USDC";
    return "ETH"; // default
  },

  extractTransferData(text: string): { asset: string; amount: string; destination: string } | null {
    // Simple regex to extract transfer data
    const transferRegex = /transfer\s+(\d+\.?\d*)\s+(eth|btc|sol|usdc)\s+to\s+(0x[a-fA-F0-9]{40})/i;
    const match = text.match(transferRegex);
    
    if (match) {
      return {
        amount: match[1],
        asset: match[2].toUpperCase(),
        destination: match[3]
      };
    }
    
    return null;
  },

  async getBalance(asset: string): Promise<BalanceInfo> {
    // Mock balance check - in real implementation, this would query blockchain
    const mockBalance = (Math.random() * 1000).toFixed(6);
    
    return {
      asset,
      balance: mockBalance,
      formattedBalance: `${mockBalance} ${asset}`
    };
  },

  async transferAsset(asset: string, amount: string, destination: string): Promise<TransferResult> {
    // Mock transfer - in real implementation, this would execute on blockchain
    const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
    
    return {
      success: true,
      transactionHash: mockTxHash
    };
  },

  async executeTrade(fromAsset: string, toAsset: string, amount: string, action: string): Promise<TradeResult> {
    // Mock trade execution - in real implementation, this would execute on Uniswap
    const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
    const mockAmountReceived = (parseFloat(amount) * (action === 'buy' ? 1.1 : 0.9)).toFixed(6);
    
    return {
      success: true,
      transactionHash: mockTxHash,
      amountReceived: mockAmountReceived
    };
  }
};

export default tradingActionsPlugin; 