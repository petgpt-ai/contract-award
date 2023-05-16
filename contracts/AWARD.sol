// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "hardhat/console.sol";

contract AWARD is Initializable, OwnableUpgradeable   {
    uint public cycle;
    uint public awardSize;
    uint256 public cycleAwardBlockNumber;
    uint256 public startAwardBlockNumber;
    mapping(uint256 => uint256) public awardMap;

    function initialize() public initializer  {        
        __Ownable_init();
        cycle = 0;
        awardSize = 5;
        cycleAwardBlockNumber = 0;
        startAwardBlockNumber = 0;
    }
    function setAwardSize(uint inAwardSize)public onlyOwner{
        require(inAwardSize != 0, "award size number not 0");
        awardSize = inAwardSize;
    }

    function setStartAwardBlockNumber(uint256 blockNumber)public onlyOwner{
        require(blockNumber != 0, "award block number not 0");
        // console.log("b:%d b:%d",blockNumber,block.number);
        require(blockNumber > block.number, "award block <= cur block number");
        
        startAwardBlockNumber = blockNumber;
    }

    function setCycleAwardBlockNumber(uint256 blockNumber)public onlyOwner{
        require(blockNumber != 0, "award block number not 0");
        cycleAwardBlockNumber = blockNumber;
    }

    function award(address[] calldata userAddrs,uint[] calldata rates)public onlyOwner{
        require(userAddrs.length == rates.length,"param length not match");
        require(userAddrs.length < awardSize,"awards not over num");

        address contractsAddress = address(this);
        uint256 balance = contractsAddress.balance;
        require(balance != 0, "address balance is 0");
        uint256 receiveAwardValue = awardMap[cycle];
        require(receiveAwardValue != 0, "receive award is 0");
        require(balance >= receiveAwardValue, "balance < award amount");
        
        for(uint i=0;i<userAddrs.length;i++){
            address userAddr = userAddrs[i];
            uint rate = rates[i];
            require(userAddr != address(0), "award from the zero address");
            require(rate != 0, "award rate can't zero");
            require(rate < 100, "award rate can't over 100");
            uint256 amount;
            unchecked {
                amount = receiveAwardValue * rate / 100;
            }
            payable(userAddr).transfer(amount);
        }
        cycle += 1;
    }

    function getContractsBalance()public view onlyOwner returns(uint256){
        address contractsAddress = address(this);
        uint256 balance = contractsAddress.balance;
        return balance;
    }

    receive() payable external {
        require(msg.value >= 0, "receive is 0");
        if(startAwardBlockNumber == 0||cycleAwardBlockNumber ==0){
            awardMap[cycle] += msg.value;
        }else{
            uint256 tmpAwardBlockNumber = block.number - startAwardBlockNumber;
            uint256 cycleNum = tmpAwardBlockNumber / cycleAwardBlockNumber;
            awardMap[cycleNum] += msg.value;
        }
    }
}