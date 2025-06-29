// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/*//////////////////////////////////////////////////////////////
                            IMPORTS
//////////////////////////////////////////////////////////////*/
import {AgentFactory} from "./src/AgentFactory.sol";
import {Agent} from "./src/Agent.sol";
import {Platform} from "./src/PlatformType.sol";
import {MockDAI} from "./src/mocks/MockDAI.sol";
import {MockMKR} from "./src/mocks/MockMKR.sol";
import {MockWETH} from "./src/mocks/MockWETH.sol";
import {MockAMM} from "./src/amm/MockAMM.sol";

/// @title RemixDeploy
/// @notice Contract to deploy the entire Eliza system through Remix on Sepolia
/// @dev This contract contains all the deployment logic optimized for Remix
contract RemixDeploy {
    /*//////////////////////////////////////////////////////////////
                           STATE VARIABLES
    //////////////////////////////////////////////////////////////*/
    AgentFactory public factory;
    MockDAI public dai;
    MockMKR public mkr;
    MockWETH public weth;
    MockAMM public mockAMM;
    Agent public agent;
    
    uint256 public constant INITIAL_LIQUIDITY = 10 ether; // Reduced for testnet
    uint256 public constant AGENT_INITIAL_FUNDS = 0.1 ether; // Reduced for testnet

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/
    event SystemDeployed(
        address indexed factory,
        address indexed mockAMM,
        address indexed agent,
        address[] tokens
    );

    event DeploymentStep(string step, address contractAddress);

    /*//////////////////////////////////////////////////////////////
                               FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /*//////////////////////////////////////////////////////////////
                           EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    /// @notice Deploys the entire Eliza system (Step 1)
    /// @param authorizedSigner The address authorized to execute trades
    /// @param platformType The platform type (0=Twitter, 1=Telegram, 2=Discord)
    /// @return deployedAddresses Array containing [factory, mockAMM, agent, dai, mkr, weth]
    function deploySystem(
        address authorizedSigner,
        uint8 platformType
    ) external payable returns (address[] memory deployedAddresses) {
        require(msg.value >= AGENT_INITIAL_FUNDS + (3 * INITIAL_LIQUIDITY), "Insufficient funds");
        require(authorizedSigner != address(0), "Invalid authorized signer");
        require(platformType <= 2, "Invalid platform type");

        // Step 1: Deploy mock tokens
        emit DeploymentStep("Deploying MockDAI", address(0));
        dai = new MockDAI();
        emit DeploymentStep("MockDAI deployed", address(dai));

        emit DeploymentStep("Deploying MockMKR", address(0));
        mkr = new MockMKR();
        emit DeploymentStep("MockMKR deployed", address(mkr));

        emit DeploymentStep("Deploying MockWETH", address(0));
        weth = new MockWETH();
        emit DeploymentStep("MockWETH deployed", address(weth));

        // Step 2: Deploy MockAMM
        emit DeploymentStep("Deploying MockAMM", address(0));
        mockAMM = new MockAMM();
        emit DeploymentStep("MockAMM deployed", address(mockAMM));

        // Step 3: Deploy AgentFactory
        emit DeploymentStep("Deploying AgentFactory", address(0));
        factory = new AgentFactory();
        emit DeploymentStep("AgentFactory deployed", address(factory));

        // Step 4: Create token array
        address[] memory tokens = new address[](3);
        tokens[0] = address(dai);
        tokens[1] = address(weth);
        tokens[2] = address(mkr);

        // Step 5: Convert platform type to enum
        Platform platform;
        if (platformType == 0) platform = Platform.Twitter;
        else if (platformType == 1) platform = Platform.Telegram;
        else platform = Platform.Discord;

        // Step 6: Create agent
        emit DeploymentStep("Creating Agent", address(0));
        agent = factory.createAgent{value: AGENT_INITIAL_FUNDS}(
            tokens,
            platform,
            authorizedSigner,
            address(mockAMM)
        );
        emit DeploymentStep("Agent created", address(agent));

        // Step 7: Mint tokens to the agent
        emit DeploymentStep("Minting tokens to Agent", address(agent));
        dai.mint(address(agent), INITIAL_LIQUIDITY);
        weth.mint(address(agent), INITIAL_LIQUIDITY);
        mkr.mint(address(agent), INITIAL_LIQUIDITY);

        // Step 8: Create pool creation data
        Agent.PoolCreationData[] memory poolData = new Agent.PoolCreationData[](3);
        poolData[0] = Agent.PoolCreationData({token: address(dai), initialLiquidity: INITIAL_LIQUIDITY});
        poolData[1] = Agent.PoolCreationData({token: address(weth), initialLiquidity: INITIAL_LIQUIDITY});
        poolData[2] = Agent.PoolCreationData({token: address(mkr), initialLiquidity: INITIAL_LIQUIDITY});

        // Step 9: Create pools
        emit DeploymentStep("Creating pools", address(agent));
        agent.createPools(poolData);
        emit DeploymentStep("Pools created successfully", address(agent));

        // Return deployed addresses
        deployedAddresses = new address[](6);
        deployedAddresses[0] = address(factory);
        deployedAddresses[1] = address(mockAMM);
        deployedAddresses[2] = address(agent);
        deployedAddresses[3] = address(dai);
        deployedAddresses[4] = address(mkr);
        deployedAddresses[5] = address(weth);

        emit SystemDeployed(address(factory), address(mockAMM), address(agent), tokens);

        // Return excess funds to deployer
        uint256 totalCost = AGENT_INITIAL_FUNDS + (3 * INITIAL_LIQUIDITY);
        uint256 excess = msg.value - totalCost;
        if (excess > 0) {
            (bool success, ) = payable(msg.sender).call{value: excess}("");
            require(success, "Failed to return excess funds");
        }
    }

    /// @notice Deploys only the mock tokens and MockAMM (for testing)
    /// @return deployedAddresses Array containing [mockAMM, dai, mkr, weth]
    function deployMocksOnly() external returns (address[] memory deployedAddresses) {
        // Deploy mock tokens
        dai = new MockDAI();
        mkr = new MockMKR();
        weth = new MockWETH();

        // Deploy MockAMM
        mockAMM = new MockAMM();

        // Return deployed addresses
        deployedAddresses = new address[](4);
        deployedAddresses[0] = address(mockAMM);
        deployedAddresses[1] = address(dai);
        deployedAddresses[2] = address(mkr);
        deployedAddresses[3] = address(weth);
    }

    /// @notice Creates an agent using existing deployed contracts
    /// @param _factory The AgentFactory address
    /// @param _mockAMM The MockAMM address
    /// @param _tokens Array of token addresses
    /// @param authorizedSigner The address authorized to execute trades
    /// @param platformType The platform type (0=Twitter, 1=Telegram, 2=Discord)
    /// @param defaultLiquidity Default liquidity amount for each token pool
    /// @return agentAddress The address of the created agent
    function createAgentWithExistingContracts(
        address _factory,
        address _mockAMM,
        address[] memory _tokens,
        address authorizedSigner,
        uint8 platformType,
        uint256 defaultLiquidity
    ) external payable returns (address agentAddress) {
        require(msg.value > 0, "Must send funds for agent");
        require(authorizedSigner != address(0), "Invalid authorized signer");
        require(platformType <= 2, "Invalid platform type");

        // Convert platform type to enum
        Platform platform;
        if (platformType == 0) platform = Platform.Twitter;
        else if (platformType == 1) platform = Platform.Telegram;
        else platform = Platform.Discord;

        // Create agent using the factory
        AgentFactory factoryContract = AgentFactory(_factory);
        Agent newAgent = factoryContract.createAgent{value: msg.value}(
            _tokens,
            platform,
            authorizedSigner,
            _mockAMM
        );

        return address(newAgent);
    }

    /*//////////////////////////////////////////////////////////////
                           GETTER FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    /// @notice Returns the deployed contract addresses
    /// @return factoryAddress The AgentFactory address
    /// @return mockAMMAddress The MockAMM address
    /// @return agentAddress The Agent address
    /// @return daiAddress The MockDAI address
    /// @return mkrAddress The MockMKR address
    /// @return wethAddress The MockWETH address
    function getDeployedAddresses() external view returns (
        address factoryAddress,
        address mockAMMAddress,
        address agentAddress,
        address daiAddress,
        address mkrAddress,
        address wethAddress
    ) {
        return (
            address(factory),
            address(mockAMM),
            address(agent),
            address(dai),
            address(mkr),
            address(weth)
        );
    }

    /// @notice Returns deployment cost for planning
    /// @return totalCost Total cost in wei for full deployment
    function getDeploymentCost() external pure returns (uint256 totalCost) {
        return AGENT_INITIAL_FUNDS + (3 * INITIAL_LIQUIDITY);
    }
} 