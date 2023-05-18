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
    uint256 public perServiceCharge;
    uint256 public sumServiceCharge;
    mapping(uint256 => uint256) public awardMap;
    mapping(uint => uint) public rankMap;

    function initialize() public initializer  {        
        __Ownable_init();
        cycle = 0;
        awardSize = 100;
        cycleAwardBlockNumber = 0;
        startAwardBlockNumber = 0;
        sumServiceCharge = 0;
        perServiceCharge = 1000; //设置每笔手续费
        rankMap[1] = 35;
        rankMap[2] = 25;
        rankMap[3] = 20;
        rankMap[4] = 10;
        rankMap[5] = 10;
    }

    function setPerServiceCharge(uint charge)public onlyOwner{
        require(perServiceCharge != 0, "service charge number not 0");
        perServiceCharge = charge;
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
    /*加入名次对应百分比 转账给owner */
    function award(address[] calldata userAddrs,uint rankNumber)public onlyOwner{
        require(userAddrs.length > 0,"user address length is 0");
        require(userAddrs.length < awardSize,"awards not over num");

        address contractsAddress = address(this);
        uint256 balance = contractsAddress.balance;
        require(balance != 0, "address balance is 0");
        uint256 receiveAwardValue = awardMap[cycle];
        require(receiveAwardValue != 0, "receive award is 0");
        require(balance >= receiveAwardValue, "balance < award amount");
        
        require(rankNumber > 0,"rank is 0");
        require(rankNumber < 6,"rank over 5");
        uint rankRate = rankMap[rankNumber];
        require(rankRate > 0,"rate is 0");
        uint256 sumAmount = 0;
        uint256 perAmount = 0;
        unchecked {
            sumAmount = receiveAwardValue * rankRate / 100;
            perAmount = sumAmount / userAddrs.length;
        }
        require(sumAmount > 0,"sumAmount is 0");
        require(perAmount > 0,"perAmount is 0");

        for(uint i=0;i<userAddrs.length;i++){
            address userAddr = userAddrs[i];
            require(userAddr != address(0), "award from the zero address");
            payable(userAddr).transfer(perAmount);
        }
        /* 转手续费到创建者 */
        address ownerAddr = owner(); 
        payable(ownerAddr).transfer(sumServiceCharge);
        sumServiceCharge = 0;
        cycle += 1;
    }

    function getContractsBalance()public view onlyOwner returns(uint256){
        address contractsAddress = address(this);
        uint256 balance = contractsAddress.balance;
        return balance;
    }

    receive() payable external {
        require(msg.value >= 0, "receive is 0");
        require(msg.value >= perServiceCharge, "transfer value less service charge");
        if(startAwardBlockNumber == 0||cycleAwardBlockNumber ==0){
            awardMap[cycle] += msg.value - perServiceCharge;
        }else{
            uint256 tmpAwardBlockNumber = block.number - startAwardBlockNumber;
            uint256 cycleNum = tmpAwardBlockNumber / cycleAwardBlockNumber;
            awardMap[cycleNum] += msg.value - perServiceCharge;
        }
        sumServiceCharge += perServiceCharge;
    }
}