// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/*//////////////////////////////////////////////////////////////
                            IMPORTS
//////////////////////////////////////////////////////////////*/
import {Script, console} from "../lib/forge-std/src/Script.sol";
import {AgentFactory} from "../src/AgentFactory.sol";
import {Agent} from "../src/Agent.sol";
import {Platform} from "../src/PlatformType.sol";
import {DeployMocks} from "./DeployMocks.s.sol";
import {MockDAI} from "../src/mocks/MockDAI.sol";
import {MockMKR} from "../src/mocks/MockMKR.sol";
import {MockWETH} from "../src/mocks/MockWETH.sol";
import {MockAMM} from "../src/amm/MockAMM.sol";

contract DeployAgent is Script {
    /*//////////////////////////////////////////////////////////////
                           STATE VARIABLES
    //////////////////////////////////////////////////////////////*/
    address owner = makeAddr("owner");
    uint256 constant INITIAL_BALANCE = 1_000_000 ether;
    DeployMocks mockDeployer;
    MockDAI dai;
    MockMKR mkr;
    MockWETH weth;
    MockAMM mockAMM;
    uint256 signerPrivateKey = 0xA11CE;
    address authorizedSigner = vm.addr(signerPrivateKey);

    /*//////////////////////////////////////////////////////////////
                                FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /*//////////////////////////////////////////////////////////////
                            EXTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function run() external returns (AgentFactory, Agent) {
        vm.deal(owner, INITIAL_BALANCE);
        vm.startBroadcast(owner);

        mockDeployer = new DeployMocks();
        (dai, weth, mkr) = mockDeployer.run();

        mockAMM = new MockAMM();

        dai.mint(owner, 1_000_000 ether);
        mkr.mint(owner, 1_000_000 ether);
        weth.mint(owner, 1_000_000 ether);

        AgentFactory factory = new AgentFactory();
        address[] memory tokenArray = new address[](3);
        tokenArray[0] = address(dai);
        tokenArray[1] = address(weth);
        tokenArray[2] = address(mkr);

        // Create pool creation data for each token
        Agent.PoolCreationData[] memory poolData = new Agent.PoolCreationData[](3);
        poolData[0] = Agent.PoolCreationData({
            token: address(dai),
            initialLiquidity: 100_000 ether
        });
        poolData[1] = Agent.PoolCreationData({
            token: address(weth),
            initialLiquidity: 100_000 ether
        });
        poolData[2] = Agent.PoolCreationData({
            token: address(mkr),
            initialLiquidity: 100_000 ether
        });

        Agent agent = factory.createAgent{value: 1 ether}(
            tokenArray,
            Platform.Twitter,
            authorizedSigner,
            address(mockAMM)
        );

        // Mint tokens to the agent
        dai.mint(address(agent), 100_000 ether);
        weth.mint(address(agent), 100_000 ether);
        mkr.mint(address(agent), 100_000 ether);

        // Create pools
        agent.createPools(poolData);

        vm.stopBroadcast();
        return (factory, agent);
    }

    /*//////////////////////////////////////////////////////////////
                            INTERNAL FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function _createPoolsAndAddLiquidity() internal {
        dai.approve(address(mockAMM), type(uint256).max);
        mkr.approve(address(mockAMM), type(uint256).max);
        weth.approve(address(mockAMM), type(uint256).max);

        mockAMM.addLiquidity{value: 100_000 ether}(address(dai), 100_000 ether);

        mockAMM.addLiquidity{value: 100_000 ether}(address(mkr), 100_000 ether);

        mockAMM.addLiquidity{value: 100_000 ether}(
            address(weth),
            100_000 ether
        );
    }
}
