import { ethers } from "ethers";
import AgentFactoryABI from "../abis/AgentFactory.json";

const CONTRACT_ADDRESS = "0x5Aa3260FdFA1eB19737a0092B7C40467721DC620";

const tokenMap = {
  DAI: "0xC7f2Cf4845C6db0e1a1e91ED41Bcd0FcC1b0E141",
  WETH: '0xdaE97900D4B184c5D2012dcdB658c008966466DD',
  MKR: "0x238213078DbD09f2D15F4c14c02300FA1b2A81BB",
};

const platformEnumMap = {
  Telegram: 0,
  Twitter: 1,
  Discord: 2,
};

export const deployAgent = async ({
  platformType,
  agentName,
  description,
  maxSpend,
  selectedTokens,
}) => {
  try {
    if (!window.ethereum) throw new Error("MetaMask not detected");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    const contract = new ethers.Contract(CONTRACT_ADDRESS, AgentFactoryABI.abi, signer);

    const tokenAddresses = selectedTokens.map((symbol) => tokenMap[symbol]);
    const platformEnum = platformEnumMap[platformType];

    const valueInWei = ethers.parseUnits(maxSpend.toString(), "ether");


    const tx = await contract.createAgent(
      tokenAddresses,
      platformEnum,
      userAddress,
      { value: valueInWei }
    );

    const receipt = await tx.wait();
    console.log(" Agent Deployed:", receipt);
    return receipt;
  } catch (err) {
    console.error(" Deployment failed:", err);
    throw err;
  }
};
