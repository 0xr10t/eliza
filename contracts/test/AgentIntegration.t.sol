// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test} from "forge-std/Test.sol";
import {AgentFactory} from "../src/AgentFactory.sol";
import {Agent} from "../src/Agent.sol";
import {Platform} from "../src/PlatformType.sol";
import {MockDAI} from "../src/mocks/MockDAI.sol";
import {MockMKR} from "../src/mocks/MockMKR.sol";
import {MockWETH} from "../src/mocks/MockWETH.sol";
import {MockAMM} from "../src/amm/MockAMM.sol";
import {IMockAMM} from "../src/amm/IMockAMM.sol";

contract AgentIntegrationTest is Test {
    MockDAI dai;
    MockMKR mkr;
    MockWETH weth;
    MockAMM mockAMM;
    AgentFactory factory;
    Agent agent;
    address owner;
    address authorizedSigner;
    uint256 constant INITIAL_LIQUIDITY = 100_000 ether;
    uint256 constant AGENT_INITIAL_FUNDS = 1 ether;

    function setUp() public {
        owner = address(this);
        authorizedSigner = address(0x1234);
        dai = new MockDAI();
        mkr = new MockMKR();
        weth = new MockWETH();
        mockAMM = new MockAMM();
        factory = new AgentFactory();
    }

    function testSimpleAgentDeployment() public {
        address[] memory tokens = new address[](3);
        tokens[0] = address(dai);
        tokens[1] = address(weth);
        tokens[2] = address(mkr);

        // Deploy the agent first
        agent = factory.createAgent{value: AGENT_INITIAL_FUNDS}(
            tokens,
            Platform.Twitter,
            authorizedSigner,
            address(mockAMM)
        );

        // Basic checks
        assertEq(agent.getOwner(), address(this), "Owner should be correct");
        assertEq(agent.getAuthorizedSigner(), authorizedSigner, "Authorized signer should be correct");
        assertEq(agent.getUserFunds(), AGENT_INITIAL_FUNDS, "User funds should be correct");
        assertEq(agent.getMockAMM(), address(mockAMM), "MockAMM should be correct");
    }

    function testTokenMintingToAgent() public {
        address[] memory tokens = new address[](3);
        tokens[0] = address(dai);
        tokens[1] = address(weth);
        tokens[2] = address(mkr);

        // Deploy the agent first
        agent = factory.createAgent{value: AGENT_INITIAL_FUNDS}(
            tokens,
            Platform.Twitter,
            authorizedSigner,
            address(mockAMM)
        );

        // Mint tokens to the agent
        dai.mint(address(agent), INITIAL_LIQUIDITY);
        weth.mint(address(agent), INITIAL_LIQUIDITY);
        mkr.mint(address(agent), INITIAL_LIQUIDITY);

        // Check token balances
        assertEq(dai.balanceOf(address(agent)), INITIAL_LIQUIDITY, "Agent should have DAI");
        assertEq(weth.balanceOf(address(agent)), INITIAL_LIQUIDITY, "Agent should have WETH");
        assertEq(mkr.balanceOf(address(agent)), INITIAL_LIQUIDITY, "Agent should have MKR");
    }

    function testETHTransferToAgent() public {
        address[] memory tokens = new address[](3);
        tokens[0] = address(dai);
        tokens[1] = address(weth);
        tokens[2] = address(mkr);

        // Deploy the agent first
        agent = factory.createAgent{value: AGENT_INITIAL_FUNDS}(
            tokens,
            Platform.Twitter,
            authorizedSigner,
            address(mockAMM)
        );

        // Send ETH to the agent for pool creation
        payable(address(agent)).transfer(3 * INITIAL_LIQUIDITY);

        // Check ETH balance
        assertEq(address(agent).balance, AGENT_INITIAL_FUNDS + 3 * INITIAL_LIQUIDITY, "Agent should have ETH");
    }

    function testAgentDeploymentAndPoolCreation() public {
        address[] memory tokens = new address[](3);
        tokens[0] = address(dai);
        tokens[1] = address(weth);
        tokens[2] = address(mkr);

        // Deploy the agent first
        agent = factory.createAgent{value: AGENT_INITIAL_FUNDS}(
            tokens,
            Platform.Twitter,
            authorizedSigner,
            address(mockAMM)
        );

        // Mint tokens to the agent
        dai.mint(address(agent), INITIAL_LIQUIDITY);
        weth.mint(address(agent), INITIAL_LIQUIDITY);
        mkr.mint(address(agent), INITIAL_LIQUIDITY);

        // Send ETH to the agent for pool creation (3 * INITIAL_LIQUIDITY for 3 pools)
        payable(address(agent)).transfer(3 * INITIAL_LIQUIDITY);

        // Create pool creation data
        Agent.PoolCreationData[] memory poolData = new Agent.PoolCreationData[](3);
        poolData[0] = Agent.PoolCreationData({token: address(dai), initialLiquidity: INITIAL_LIQUIDITY});
        poolData[1] = Agent.PoolCreationData({token: address(weth), initialLiquidity: INITIAL_LIQUIDITY});
        poolData[2] = Agent.PoolCreationData({token: address(mkr), initialLiquidity: INITIAL_LIQUIDITY});

        // Create pools
        agent.createPools(poolData);

        // Check that pools are created in the AMM
        IMockAMM.Pool memory daiPool = mockAMM.getPool(address(dai));
        IMockAMM.Pool memory wethPool = mockAMM.getPool(address(weth));
        IMockAMM.Pool memory mkrPool = mockAMM.getPool(address(mkr));
        assertEq(daiPool.ethReserve, INITIAL_LIQUIDITY, "DAI pool ETH reserve");
        assertEq(daiPool.tokenReserve, INITIAL_LIQUIDITY, "DAI pool token reserve");
        assertEq(wethPool.ethReserve, INITIAL_LIQUIDITY, "WETH pool ETH reserve");
        assertEq(wethPool.tokenReserve, INITIAL_LIQUIDITY, "WETH pool token reserve");
        assertEq(mkrPool.ethReserve, INITIAL_LIQUIDITY, "MKR pool ETH reserve");
        assertEq(mkrPool.tokenReserve, INITIAL_LIQUIDITY, "MKR pool token reserve");
    }

    function testAgentOwnsNoTokensAfterPoolCreation() public {
        address[] memory tokens = new address[](3);
        tokens[0] = address(dai);
        tokens[1] = address(weth);
        tokens[2] = address(mkr);

        // Deploy the agent first
        agent = factory.createAgent{value: AGENT_INITIAL_FUNDS}(
            tokens,
            Platform.Twitter,
            authorizedSigner,
            address(mockAMM)
        );

        // Mint tokens to the agent
        dai.mint(address(agent), INITIAL_LIQUIDITY);
        weth.mint(address(agent), INITIAL_LIQUIDITY);
        mkr.mint(address(agent), INITIAL_LIQUIDITY);

        // Send ETH to the agent for pool creation (3 * INITIAL_LIQUIDITY for 3 pools)
        payable(address(agent)).transfer(3 * INITIAL_LIQUIDITY);

        // Create pool creation data
        Agent.PoolCreationData[] memory poolData = new Agent.PoolCreationData[](3);
        poolData[0] = Agent.PoolCreationData({token: address(dai), initialLiquidity: INITIAL_LIQUIDITY});
        poolData[1] = Agent.PoolCreationData({token: address(weth), initialLiquidity: INITIAL_LIQUIDITY});
        poolData[2] = Agent.PoolCreationData({token: address(mkr), initialLiquidity: INITIAL_LIQUIDITY});

        // Create pools
        agent.createPools(poolData);

        assertEq(dai.balanceOf(address(agent)), 0, "Agent should have no DAI after pool creation");
        assertEq(weth.balanceOf(address(agent)), 0, "Agent should have no WETH after pool creation");
        assertEq(mkr.balanceOf(address(agent)), 0, "Agent should have no MKR after pool creation");
    }
} 