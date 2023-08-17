// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract AWARD is AccessControl  {
    uint256 public cycleAwardBlockNumber;
    uint256 public startAwardBlockNumber;
    mapping(uint256 => uint256) public awardMap;
    mapping(uint => bytes32) public merkleRootMap;
    mapping(uint => mapping(uint => uint256)) public catAwardMap;

    bytes32 public constant SCORE_ROLE = keccak256("SCORE_ROLE");

    constructor() {      
        // __Ownable_init();
        cycleAwardBlockNumber = 0;
        startAwardBlockNumber = 0;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }


    function setStartAwardBlockNumber(uint256 blockNumber)public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(blockNumber != 0, "award block number not 0");
        startAwardBlockNumber = blockNumber;
    }

    function setCycleAwardBlockNumber(uint256 blockNumber)public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(blockNumber != 0, "award block number not 0");
        cycleAwardBlockNumber = blockNumber;
    }

    function score(bytes32 tmerkleRoot,uint cycle)public onlyRole(SCORE_ROLE) {
        require(startAwardBlockNumber > 0 ,"startAwardBlockNumber is 0");
        require(cycleAwardBlockNumber > 0 ,"cycleAwardBlockNumber is 0");
        require(block.number >= startAwardBlockNumber + (cycle +1) * cycleAwardBlockNumber,"awards block not reach");
        merkleRootMap[cycle] = tmerkleRoot;
    }

    function claim(uint catId,uint256 amount,bytes32[] memory proof)public returns(bool){
        uint curCycle = getCycle()-1;
        bytes32 merkleRoot_ = merkleRootMap[curCycle];
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, catId, amount));
        require(MerkleProof.verify(proof, merkleRoot_ , leaf),"merkle proof verify error");
        uint256 awardAmount = catAwardMap[curCycle][catId];
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

    function withdraw() external onlyRole(DEFAULT_ADMIN_ROLE) {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success, "Transfer failed.");
    }
}