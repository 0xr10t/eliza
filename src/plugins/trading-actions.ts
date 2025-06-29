import { Plugin, Action, IAgentRuntime, Memory, State } from "@elizaos/core";

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
  description: "Handles trading actions like balance checks, transfers, and trade execution",

  actions: [
    {
      name: "check_balance",
      description: "Check the balance of a specific asset",
      similes: ["get balance", "show balance", "balance check"],
      examples: [
        [
          {
            user: "user",
            content: { text: "Check my ETH balance" }
          },
          {
            user: "TradeBot",
            content: { 
              text: "**Balance Check**\n\n**Asset:** ETH\n**Balance:** 1.234567 ETH",
              action: "GET_BALANCE"
            }
          }
        ]
      ],
      handler: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        const text = message.content.text?.toLowerCase() || "";
        const asset = extractAsset(text);
        const balance = await getBalance(asset);
        
        return {
          text: `**Balance Check**\n\n**Asset:** ${balance.asset}\n**Balance:** ${balance.formattedBalance}`,
          action: "GET_BALANCE",
          metadata: { balance }
        };
      },
      validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        const text = message.content.text?.toLowerCase() || "";
        return text.includes("check") && text.includes("balance");
      }
    },
    {
      name: "transfer_asset",
      description: "Transfer assets to another address",
      similes: ["send", "transfer", "move assets"],
      examples: [
        [
          {
            user: "user",
            content: { text: "Transfer 0.1 ETH to 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6" }
          },
          {
            user: "TradeBot",
            content: { 
              text: "**Transfer Successful!**\n\n**Asset:** ETH\n**Amount:** 0.1\n**Destination:** 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6\n**Transaction Hash:** 0x1234...",
              action: "TRANSFER_ASSET"
            }
          }
        ]
      ],
      handler: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        const text = message.content.text?.toLowerCase() || "";
        const transferData = extractTransferData(text);
        
        if (transferData) {
          const result = await transferAsset(
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
        
        return null;
      },
      validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        const text = message.content.text?.toLowerCase() || "";
        return text.includes("transfer");
      }
    },
    {
      name: "execute_trade",
      description: "Execute a trade on-chain",
      similes: ["execute trade", "make trade", "swap tokens"],
      examples: [
        [
          {
            user: "user",
            content: { text: "execute trade" }
          },
          {
            user: "TradeBot",
            content: { 
              text: "**Trade Executed Successfully!**\n\n**Action:** BUY\n**Pair:** ETH/USDC\n**Amount:** 0.1 ETH\n**Received:** 0.11 USDC\n**Transaction Hash:** 0x1234...\n**Sentiment Score:** 0.75\n\n*Trade executed on-chain based on sentiment analysis.*",
              action: "EXECUTE_TRADE_REQUEST"
            }
          }
        ]
      ],
      handler: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        const text = message.content.text?.toLowerCase() || "";
        
        if (text.includes("execute") && text.includes("trade")) {
          const result = await executeTrade("ETH", "USDC", "0.1", "buy");
          
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
      validate: async (runtime: IAgentRuntime, message: Memory, state?: State) => {
        const text = message.content.text?.toLowerCase() || "";
        return text.includes("execute") && text.includes("trade");
      }
    }
  ]
};

function extractAsset(text: string): string {
  if (text.includes("eth")) return "ETH";
  if (text.includes("btc")) return "BTC";
  if (text.includes("sol")) return "SOL";
  if (text.includes("usdc")) return "USDC";
  return "ETH"; // default
}

function extractTransferData(text: string): { asset: string; amount: string; destination: string } | null {
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
}

async function getBalance(asset: string): Promise<BalanceInfo> {
  // Mock balance check - in real implementation, this would query blockchain
  const mockBalance = (Math.random() * 1000).toFixed(6);
  
  return {
    asset,
    balance: mockBalance,
    formattedBalance: `${mockBalance} ${asset}`
  };
}

async function transferAsset(asset: string, amount: string, destination: string): Promise<TransferResult> {
  // Mock transfer - in real implementation, this would execute on blockchain
  const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
  
  return {
    success: true,
    transactionHash: mockTxHash
  };
}

async function executeTrade(fromAsset: string, toAsset: string, amount: string, action: string): Promise<TradeResult> {
  // Mock trade execution - in real implementation, this would execute on Uniswap
  const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
  const mockAmountReceived = (parseFloat(amount) * (action === 'buy' ? 1.1 : 0.9)).toFixed(6);
  
  return {
    success: true,
    transactionHash: mockTxHash,
    amountReceived: mockAmountReceived
  };
}

export default tradingActionsPlugin; 