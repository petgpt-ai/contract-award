const {
    time,
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
  const { expect } = require("chai");
  
  describe("AWARD", function () {
    async function deployTokenFixture() {
      // Get the ContractFactory and Signers here.
      const Token = await ethers.getContractFactory("AWARD");
      
      const [owner, addr1, addr2,addr3,addr4,addr5] = await ethers.getSigners();
  
      // To deploy our contract, we just have to call Token.deploy() and await
      // for it to be deployed(), which happens onces its transaction has been
      // mined.
      const hardhatToken = await Token.deploy();
      await hardhatToken.deployed();
      // Fixtures can return anything you consider useful for your tests
      return { Token, hardhatToken, owner, addr1, addr2,addr3,addr4,addr5 };
    }
    
    async function transfer(ownerAddress,tokenAddress,signer,val){
      const nonce = await signer.getTransactionCount()
      const gasLimit = ethers.utils.hexlify(61000)
      const gasPrice = await signer.getGasPrice()
      const tx = {
        from: ownerAddress,//owner.address,
        to: tokenAddress,//hardhatToken.address,
        value: val,//ethers.utils.parseUnits('0.1'),
        nonce: nonce,
        gasLimit: gasLimit,
        gasPrice: gasPrice,
      }
      await signer.sendTransaction(tx)
    }
    describe("Deployment", function () {
      
      it("Should set the right owner", async function () {
        // We use loadFixture to setup our environment, and then assert that
        // things went well
        const { hardhatToken, owner } = await loadFixture(deployTokenFixture);
  
        // Expect receives a value and wraps it in an assertion object. These
        // objects have a lot of utility methods to assert values.
  
        // This test expects the owner variable stored in the contract to be
        // equal to our Signer's owner.
        expect(await hardhatToken.owner()).to.equal(owner.address);
      });
    });
  
  
    describe("function", function () {
      // it("setCacheAddress", async function () {
      //   const { hardhatToken, owner, addr1, addr2,addr3 } = await loadFixture(deployTokenFixture);
      //   // const tokenInfo1 = await hardhatToken.tokenURI(0);
      //   // console.log("tokenInfo1:%s",tokenInfo1)
      //   const cacheAddress1 =await hardhatToken.cacheAddress();
      //   console.log("cacheAddress1:%s",cacheAddress1)
      //   console.log("set address:%s %s",addr1.address,typeof addr1.address)
      //   await hardhatToken.setCacheAddress(addr1.address);
      //   const cacheAddress2 = await hardhatToken.cacheAddress();
      //   console.log("cacheAddress2:%s",cacheAddress2)
        
      // });
      it("transfer", async function () {
        const { hardhatToken, owner, addr1, addr2,addr3 } = await loadFixture(deployTokenFixture);
        const signer = await ethers.provider.getSigner()
        
        let blockNum = await ethers.provider.getBlockNumber();
        console.log("block:%d",blockNum)
        await hardhatToken.setStartAwardBlockNumber(1);
        await hardhatToken.setCycleAwardBlockNumber(4);
        await transfer(owner.address,hardhatToken.address,signer,ethers.utils.parseEther("1.0"))
        // let transactionHash = await owner.sendTransaction({
        //   to: hardhatToken.address,
        //   value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
        // });
        

        
        let receiveAwardValue = await hardhatToken.awardMap(0);
        console.log("receive 0:%d",receiveAwardValue)
        await transfer(owner.address,hardhatToken.address,signer,ethers.utils.parseEther("1.0"))
        // transactionHash = await owner.sendTransaction({
        //   to: hardhatToken.address,
        //   value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
        // });

        blockNum = await ethers.provider.getBlockNumber();
        console.log("block:%d",blockNum)
        receiveAwardValue = await hardhatToken.awardMap(1);
        console.log("receive 1:%d",receiveAwardValue)
        transactionHash = await owner.sendTransaction({
          to: hardhatToken.address,
          value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
        });
      });
      it("score",async function () {
        

        const { hardhatToken, owner, addr1, addr2,addr3,addr4,addr5 } = await loadFixture(deployTokenFixture);
        // const testValue = ethers.utils.solidityKeccak256( ['address', 'uint','uint256'], ['0x44ebBb1fcD24189B18114b03D300bF596186991B', 19,1980198019801980])
        // console.log("testValue",testValue);
        leafNodes =[];
        // const addr1Str = addr1.address
        // const addr2Str = addr2.address
        // console.log(addr1Str);
        
        // console.log(leafNodes[0]);
        
        leafNodes[0] = ethers.utils.solidityKeccak256( ['address', 'uint','uint256'], [addr1.address.toLowerCase(), 9,4210526315789473])
        leafNodes[1] = ethers.utils.solidityKeccak256( ['address', 'uint','uint256'], [addr1.address.toLowerCase(), 10,5789473684210526])
        leafNodes.push("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
        // leafNodes[2] = ethers.utils.solidityKeccak256( ['address', 'uint','uint256'], ['0x44ebBb1fcD24189B18114b03D300bF596186991B', 2,1980198019801980])
        // leafNodes[3] = ethers.utils.solidityKeccak256( ['address', 'uint','uint256'], ['0x44ebBb1fcD24189B18114b03D300bF596186991B', 9,1980198019801980])
        // leafNodes[4] = ethers.utils.solidityKeccak256( ['address', 'uint','uint256'], ['0x44ebBb1fcD24189B18114b03D300bF596186991B', 19,1980198019801980])
        // leafNodes[5] = ethers.utils.solidityKeccak256( ['address', 'uint','uint256'], ['0x44ebBb1fcD24189B18114b03D300bF596186991B', 4,99009900990099])
        // leafNodes[6] = ""

        // leafNodes[0] = "74cb6862ed38a5de7c1982993e675a8c691d559b6aa48c5bde6761de4083ddd8"
        // leafNodes[1] = "025a1b68d6f07ffc1d4a7226ca8533195ebdabc9684fc1d01a9479af1b3dd1db"
        // leafNodes.push("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
        // leafNodes[2] = "aab0cb813ea3a982d24bb893c50feb29fbb890bdc43109e3f8bd60bb69ac2671"
        // leafNodes[3] = "3a52ab2c900bbf9db719479f9fe997ac0104487435c811899b4a6f6c95aa7a6c"
        // leafNodes[4] = "3d3c7c0cdc5461ac8f695a97cd0a1fd26c2c22af6bfd3ab96207122b12fcb250"
        // leafNodes[5] = "536b6c9bd7fbb5ad5858adc23f6d0462a8fb995ddd8060a3b72c9134384ce0d2"
        // leafNodes[6] = ""
        // leafNodes[0] = ""
        console.log("leafNodes:",leafNodes)
        // 生成树根
        const tree = new (require('merkletreejs').MerkleTree)(leafNodes, require('keccak256'), {sortPairs: true});
        const data = tree.getHexRoot();
        console.log("root:",data)
        
        
        await hardhatToken.setStartAwardBlockNumber(1);
        await hardhatToken.setStartAwardBlockNumber(1);
        await hardhatToken.setStartAwardBlockNumber(1);
        await hardhatToken.setCycleAwardBlockNumber(2);
        await hardhatToken.setCycleAwardBlockNumber(2);
        const contractBalance = await ethers.provider.getBalance(hardhatToken.address);
        console.log("token balance:%s",contractBalance);
        // 
        const cycle = await hardhatToken.getCycle();
        console.log("cycle:%d",cycle);
        blockNum = await ethers.provider.getBlockNumber();
        console.log("block:%d",blockNum)
        
        await hardhatToken.score(data,cycle)
        
        const proof = tree.getHexProof(leafNodes[1])
        console.log("proof:"+proof)
        console.log("address:",addr1.address.toLowerCase())
        let verifyRet = tree.verify(proof,leafNodes[1],data)
        console.log(verifyRet)
        await hardhatToken.connect(addr1).claim(10,5789473684210526,proof)

      })
      // it("award0", async function () {
      //   const { hardhatToken, owner, addr1, addr2,addr3,addr4,addr5 } = await loadFixture(deployTokenFixture);
      //   await hardhatToken.setStartAwardBlockNumber(1);
      //   await hardhatToken.setCycleAwardBlockNumber(2);
      //   const contractBalance = await ethers.provider.getBalance(hardhatToken.address)
      //   console.log("token balance:%s",contractBalance);
      //   blockNum = await ethers.provider.getBlockNumber();
      //   console.log("block:%d",blockNum)
      //   let userAddrs = [[addr2.address,addr3.address],[addr4.address,addr5.address],[],[],[]];
      //   await hardhatToken.award(userAddrs);
      //   const cycle = await hardhatToken.cycle();
      //   console.log("cycle:%s",cycle);
      //   const awardMap = await hardhatToken.awardMap(0);
      //   console.log("awardMap 0:%s",awardMap);
      // });
      // it("award1", async function () {
      //   const { hardhatToken, owner, addr1, addr2,addr3,addr4,addr5 } = await loadFixture(deployTokenFixture);
      //   const signer = await ethers.provider.getSigner()
      //   // console.log("token address:%s",hardhatToken.address);
      //   const ownerBalance = await ethers.provider.getBalance(owner.address)
      //   // console.log("owner balance:%s",ownerBalance);


      //   const contractBalance1 = await ethers.provider.getBalance(hardhatToken.address)
      //   // console.log("token balance1:%s",contractBalance1);
      //   await ethers.provider.send("hardhat_setBalance", [
      //     addr2.address,
      //     "0x0",
      //   ]);
      //   await ethers.provider.send("hardhat_setBalance", [
      //     addr3.address,
      //     "0x0",
      //   ]);
      //   await ethers.provider.send("hardhat_setBalance", [
      //     addr4.address,
      //     "0x0",
      //   ]);
      //   await ethers.provider.send("hardhat_setBalance", [
      //     addr5.address,
      //     "0x0",
      //   ]);
      //   await hardhatToken.setStartAwardBlockNumber(1);
      //   await hardhatToken.setCycleAwardBlockNumber(4);
      //   // const transactionHash = await owner.sendTransaction({
      //   //   to: hardhatToken.address,
      //   //   value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
      //   // });
      //   await transfer(owner.address,hardhatToken.address,signer,ethers.utils.parseEther("1.0"))

      //   const contractBalance = await ethers.provider.getBalance(hardhatToken.address)
      //   console.log("token balance:%s",contractBalance);
      //   // await hardhatToken.setCacheAddress(addr1.address);
      //   let userAddrs = [[addr2.address,addr3.address],[addr4.address],[addr5.address],[],[]];
      //   await hardhatToken.award(userAddrs);

      //   const contractBalance2 = await ethers.provider.getBalance(addr2.address)
      //   console.log("addr2 balance:%s",contractBalance2);
      //   const contractBalance3 = await ethers.provider.getBalance(addr3.address)
      //   console.log("addr3 balance:%s",contractBalance3);
      //   const contractBalance4 = await ethers.provider.getBalance(addr4.address)
      //   console.log("addr4 balance:%s",contractBalance4);
      //   const contractBalance5 = await ethers.provider.getBalance(addr5.address)
      //   console.log("addr5 balance:%s",contractBalance5);
      //   const cycle = await hardhatToken.cycle() - 1;
      //   console.log("cycle:%s",cycle);
      //   const awardMap = await hardhatToken.awardMap(cycle);
      //   console.log("token balance:%s",awardMap);
      // });
      // it("award2", async function () {
      //   const { hardhatToken, owner, addr1, addr2,addr3 } = await loadFixture(deployTokenFixture);
      //   const signer = await ethers.provider.getSigner()
      //   await ethers.provider.send("hardhat_setBalance", [
      //     addr2.address,
      //     "0x0",
      //   ]);
      //   await ethers.provider.send("hardhat_setBalance", [
      //     addr3.address,
      //     "0x0",
      //   ]);
      //   await hardhatToken.setStartAwardBlockNumber(1);
      //   await hardhatToken.setCycleAwardBlockNumber(4);
      //   // let transactionHash = await owner.sendTransaction({
      //   //   to: hardhatToken.address,
      //   //   value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
      //   // });
      //   // transactionHash = await owner.sendTransaction({
      //   //   to: hardhatToken.address,
      //   //   value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
      //   // });
      //   // transactionHash = await owner.sendTransaction({
      //   //   to: hardhatToken.address,
      //   //   value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
      //   // });
      //   await transfer(owner.address,hardhatToken.address,signer,ethers.utils.parseEther("1.0"))
      //   await transfer(owner.address,hardhatToken.address,signer,ethers.utils.parseEther("1.0"))
      //   await transfer(owner.address,hardhatToken.address,signer,ethers.utils.parseEther("1.0"))
      //   let receiveAwardValue = await hardhatToken.awardMap(0);
      //   console.log("receive:%d",receiveAwardValue)
      //   blockNum = await ethers.provider.getBlockNumber();
      //   console.log("block:%d",blockNum)
      //   const contractBalance2 = await ethers.provider.getBalance(hardhatToken.address)
      //   console.log("token balance:%s",contractBalance2);
      //   // await hardhatToken.setCacheAddress(addr1.address);
      //   let userAddrs = [[addr2.address,addr3.address],[],[],[],[]];
      //   await hardhatToken.award(userAddrs);

      //   const contractBalance3 = await ethers.provider.getBalance(addr2.address)
      //   console.log("addr2  balance:%s",contractBalance3);
      //   const contractBalance4 = await ethers.provider.getBalance(addr3.address)
      //   console.log("addr3  balance:%s",contractBalance4);
      //   const cycle = await hardhatToken.cycle();
      //   let awardMap = await hardhatToken.awardMap(cycle-1);
      //   console.log("cycle:%s reward:%s",cycle-1,awardMap);
      //   awardMap = await hardhatToken.awardMap(cycle);
      //   console.log("cycle:%s reward:%s",cycle,awardMap);
      // });
      it("balance", async function () {
        const { hardhatToken, owner, addr1, addr2,addr3 } = await loadFixture(deployTokenFixture);
        let transactionHash = await owner.sendTransaction({
          to: hardhatToken.address,
          value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
        });
        transactionHash = await owner.sendTransaction({
          to: hardhatToken.address,
          value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
        });
        const balance = await hardhatToken.getContractsBalance();
        console.log("balance:%s",balance);
      });
    });
  });
  