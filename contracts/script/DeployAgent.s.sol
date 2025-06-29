// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/*//////////////////////////////////////////////////////////////
                            IMPORTS
//////////////////////////////////////////////////////////////*/
import {Script} from "../lib/forge-std/src/Script.sol";
import {AgentFactory} from "../src/AgentFactory.sol";
import {Agent} from "../src/Agent.sol";
import {Platform} from "../src/PlatformType.sol";
import {DeployMocks} from "./DeployMocks.s.sol";
import {MockDAI} from "../src/mocks/MockDAI.sol";
import {MockMKR} from "../src/mocks/MockMKR.sol";
import {MockWETH} from "../src/mocks/MockWETH.sol";

contract DeployAgent is Script {
    /*//////////////////////////////////////////////////////////////
                           STATE VARIABLES
    //////////////////////////////////////////////////////////////*/
    address owner = makeAddr("owner");
    uint256 constant INITIAL_BALANCE = 10 ether;
    DeployMocks mockDeployer;
    MockDAI dai;
    MockMKR mkr;
    MockWETH weth;
    uint256 signerPrivateKey = 0xA11CE;
    address authorizedSigner = vm.addr(signerPrivateKey);

    /*//////////////////////////////////////////////////////////////
                                FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function run() external returns (AgentFactory, Agent) {
        vm.deal(owner, INITIAL_BALANCE);
        vm.startBroadcast(owner);
        mockDeployer = new DeployMocks();
        (dai, weth, mkr) = mockDeployer.run();
        AgentFactory factory = new AgentFactory();
        address[] memory tokenArray = new address[](3);
        tokenArray[0] = address(dai);
        tokenArray[1] = address(weth);
        tokenArray[2] = address(mkr);
        Agent agent = factory.createAgent{value: 1 ether}(
            tokenArray,
            Platform.Twitter,
            authorizedSigner
        );
        vm.stopBroadcast();
        return (factory, agent);
    }
}
