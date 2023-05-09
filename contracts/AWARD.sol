// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "hardhat/console.sol";

contract AWARD is Initializable, OwnableUpgradeable   {
    uint public cycle;
    mapping(uint => uint256) public awardMap;

    struct AwardInfo {
        address userAddress;
        uint256 rate;
    }
    function initialize() public initializer  {        
        __Ownable_init();
        cycle = 0;
    }

    function award(AwardInfo[] calldata inputs)public onlyOwner{
        address contractsAddress = address(this);
        uint balance = contractsAddress.balance;
        require(balance != 0, "address balance is 0");
        
        for(uint i=0;i<inputs.length;i++){
            AwardInfo memory awardInfo = inputs[i];
            require(awardInfo.userAddress != address(0), "award from the zero address");
            require(awardInfo.rate != 0, "award rate can't zero");
            require(awardInfo.rate < 100, "award rate can't over 100");
            uint256 amount;
            unchecked {
                amount = balance * awardInfo.rate / 100;
            }
            payable(awardInfo.userAddress).transfer(amount);
        }
        cycle += 1;
        awardMap[cycle] = balance;
    }

    receive() payable external {}
}