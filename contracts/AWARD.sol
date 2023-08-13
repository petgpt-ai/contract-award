// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

// import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
// import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "hardhat/console.sol";

contract AWARD is  Ownable   {
    uint256 public cycleAwardBlockNumber;
    uint256 public startAwardBlockNumber;
    mapping(uint256 => uint256) public awardMap;
    mapping(uint => bytes32) public merkleRootMap;
    mapping(uint => mapping(uint => uint256)) public catAwardMap;

    constructor() {      
        // __Ownable_init();
        cycleAwardBlockNumber = 0;
        startAwardBlockNumber = 0;
    }


    function setStartAwardBlockNumber(uint256 blockNumber)public onlyOwner{
        require(blockNumber != 0, "award block number not 0");
        // console.log("b:%d b:%d",blockNumber,block.number);
        // require(blockNumber > block.number, "award block <= cur block number");
        startAwardBlockNumber = blockNumber;
    }

    function setCycleAwardBlockNumber(uint256 blockNumber)public onlyOwner{
        require(blockNumber != 0, "award block number not 0");
        cycleAwardBlockNumber = blockNumber;
    }

    function score(bytes32 tmerkleRoot,uint cycle)public onlyOwner{
        require(startAwardBlockNumber > 0 ,"startAwardBlockNumber is 0");
        require(cycleAwardBlockNumber > 0 ,"cycleAwardBlockNumber is 0");
        // console.log("%d %d %d",block.number,startAwardBlockNumber,cycleAwardBlockNumber);
        require(block.number >= startAwardBlockNumber + (cycle +1) * cycleAwardBlockNumber,"awards block not reach");
        merkleRootMap[cycle] = tmerkleRoot;
    }

    function claim(uint catId,uint256 amount,bytes32[] memory proof)public returns(bool){
        uint curCycle = getCycle()-1;
        bytes32 merkleRoot_ = merkleRootMap[curCycle];
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, catId, amount));
        require(MerkleProof.verify(proof, merkleRoot_ , leaf),"merkle proof verify error");
        uint256 awardAmount = catAwardMap[curCycle][catId];
        // console.logBytes32(merkleRoot_);
        // console.logBytes32(leaf);
        if (MerkleProof.verify(proof, merkleRoot_, leaf) && awardAmount == 0){
            uint256 receiveAwardValue = awardMap[curCycle];
            address contractsAddress = address(this);
            uint256 balance = contractsAddress.balance;
            require(balance != 0, "address balance is 0");
            require(balance >= receiveAwardValue, "balance < award amount");

            payable(msg.sender).transfer(amount);
            catAwardMap[curCycle][catId] = amount;
            return true;
        }
        return false;
    }
    

    function getContractsBalance()public view virtual returns(uint256){
        address contractsAddress = address(this);
        uint256 balance = contractsAddress.balance;
        return balance;
    }

    function getBlockNumber()public view returns(uint256){
        return block.number;
    }
    

    function getCycle()public view returns(uint256){
         if(startAwardBlockNumber == 0||cycleAwardBlockNumber ==0){
            return 0;
        }else{
            uint256 tmpAwardBlockNumber = block.number - startAwardBlockNumber;
            if(tmpAwardBlockNumber < 0){
                return 0;
            }
            uint256 cycleNum = tmpAwardBlockNumber / cycleAwardBlockNumber;
            return cycleNum;
        }
    }

    receive() external payable{
        require(msg.value >= 0, "receive is 0");
        uint256 curCycle = getCycle();
        awardMap[curCycle] += msg.value;
    }

    fallback() external payable{}

    function withdraw() external onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success, "Transfer failed.");
    }
}