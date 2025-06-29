// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "forge-std/console.sol";
import {Script} from "forge-std/Script.sol";
import {AgentFactory} from "../src/AgentFactory.sol";
import {Platform} from "../src/PlatformType.sol";

/// @title Deploy Script
/// @notice Script to deploy the AgentFactory contract
contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the AgentFactory contract
        AgentFactory factory = new AgentFactory();
        
        vm.stopBroadcast();

        // Log deployment information
        console.log("AgentFactory deployed to:", address(factory));
        console.log("Deployer address:", vm.addr(deployerPrivateKey));
        
        // Save deployment addresses to a file
        string memory deploymentInfo = string.concat(
            "AGENT_FACTORY_ADDRESS=",
            vm.toString(address(factory)),
            "\nDEPLOYER_ADDRESS=",
            vm.toString(vm.addr(deployerPrivateKey)),
            "\nDEPLOYMENT_BLOCK=",
            vm.toString(block.number),
            "\nCHAIN_ID=",
            vm.toString(block.chainid)
        );
        
        vm.writeFile("deployment.txt", deploymentInfo);
        console.log("Deployment info saved to deployment.txt");
    }
} 