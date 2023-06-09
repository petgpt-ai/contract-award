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
      it("setCycle", async function () {
        const { hardhatToken, owner, addr1, addr2,addr3 } = await loadFixture(deployTokenFixture);
        const cycle =await hardhatToken.cycle();
        console.log("cycle:%s",cycle)
      });
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
      it("award0", async function () {
        const { hardhatToken, owner, addr1, addr2,addr3,addr4,addr5 } = await loadFixture(deployTokenFixture);
        await hardhatToken.setStartAwardBlockNumber(1);
        await hardhatToken.setCycleAwardBlockNumber(2);
        const contractBalance = await ethers.provider.getBalance(hardhatToken.address)
        console.log("token balance:%s",contractBalance);
        blockNum = await ethers.provider.getBlockNumber();
        console.log("block:%d",blockNum)
        let userAddrs = [[addr2.address,addr3.address],[addr4.address,addr5.address],[],[],[]];
        await hardhatToken.award(userAddrs);
        const cycle = await hardhatToken.cycle();
        console.log("cycle:%s",cycle);
        const awardMap = await hardhatToken.awardMap(0);
        console.log("awardMap 0:%s",awardMap);
      });
      it("award1", async function () {
        const { hardhatToken, owner, addr1, addr2,addr3,addr4,addr5 } = await loadFixture(deployTokenFixture);
        const signer = await ethers.provider.getSigner()
        // console.log("token address:%s",hardhatToken.address);
        const ownerBalance = await ethers.provider.getBalance(owner.address)
        // console.log("owner balance:%s",ownerBalance);


        const contractBalance1 = await ethers.provider.getBalance(hardhatToken.address)
        // console.log("token balance1:%s",contractBalance1);
        await ethers.provider.send("hardhat_setBalance", [
          addr2.address,
          "0x0",
        ]);
        await ethers.provider.send("hardhat_setBalance", [
          addr3.address,
          "0x0",
        ]);
        await ethers.provider.send("hardhat_setBalance", [
          addr4.address,
          "0x0",
        ]);
        await ethers.provider.send("hardhat_setBalance", [
          addr5.address,
          "0x0",
        ]);
        await hardhatToken.setStartAwardBlockNumber(1);
        await hardhatToken.setCycleAwardBlockNumber(4);
        // const transactionHash = await owner.sendTransaction({
        //   to: hardhatToken.address,
        //   value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
        // });
        await transfer(owner.address,hardhatToken.address,signer,ethers.utils.parseEther("1.0"))

        const contractBalance = await ethers.provider.getBalance(hardhatToken.address)
        console.log("token balance:%s",contractBalance);
        // await hardhatToken.setCacheAddress(addr1.address);
        let userAddrs = [[addr2.address,addr3.address],[addr4.address],[addr5.address],[],[]];
        await hardhatToken.award(userAddrs);

        const contractBalance2 = await ethers.provider.getBalance(addr2.address)
        console.log("addr2 balance:%s",contractBalance2);
        const contractBalance3 = await ethers.provider.getBalance(addr3.address)
        console.log("addr3 balance:%s",contractBalance3);
        const contractBalance4 = await ethers.provider.getBalance(addr4.address)
        console.log("addr4 balance:%s",contractBalance4);
        const contractBalance5 = await ethers.provider.getBalance(addr5.address)
        console.log("addr5 balance:%s",contractBalance5);
        const cycle = await hardhatToken.cycle() - 1;
        console.log("cycle:%s",cycle);
        const awardMap = await hardhatToken.awardMap(cycle);
        console.log("token balance:%s",awardMap);
      });
      it("award2", async function () {
        const { hardhatToken, owner, addr1, addr2,addr3 } = await loadFixture(deployTokenFixture);
        const signer = await ethers.provider.getSigner()
        await ethers.provider.send("hardhat_setBalance", [
          addr2.address,
          "0x0",
        ]);
        await ethers.provider.send("hardhat_setBalance", [
          addr3.address,
          "0x0",
        ]);
        await hardhatToken.setStartAwardBlockNumber(1);
        await hardhatToken.setCycleAwardBlockNumber(4);
        // let transactionHash = await owner.sendTransaction({
        //   to: hardhatToken.address,
        //   value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
        // });
        // transactionHash = await owner.sendTransaction({
        //   to: hardhatToken.address,
        //   value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
        // });
        // transactionHash = await owner.sendTransaction({
        //   to: hardhatToken.address,
        //   value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
        // });
        await transfer(owner.address,hardhatToken.address,signer,ethers.utils.parseEther("1.0"))
        await transfer(owner.address,hardhatToken.address,signer,ethers.utils.parseEther("1.0"))
        await transfer(owner.address,hardhatToken.address,signer,ethers.utils.parseEther("1.0"))
        let receiveAwardValue = await hardhatToken.awardMap(0);
        console.log("receive:%d",receiveAwardValue)
        blockNum = await ethers.provider.getBlockNumber();
        console.log("block:%d",blockNum)
        const contractBalance2 = await ethers.provider.getBalance(hardhatToken.address)
        console.log("token balance:%s",contractBalance2);
        // await hardhatToken.setCacheAddress(addr1.address);
        let userAddrs = [[addr2.address,addr3.address],[],[],[],[]];
        await hardhatToken.award(userAddrs);

        const contractBalance3 = await ethers.provider.getBalance(addr2.address)
        console.log("addr2  balance:%s",contractBalance3);
        const contractBalance4 = await ethers.provider.getBalance(addr3.address)
        console.log("addr3  balance:%s",contractBalance4);
        const cycle = await hardhatToken.cycle();
        let awardMap = await hardhatToken.awardMap(cycle-1);
        console.log("cycle:%s reward:%s",cycle-1,awardMap);
        awardMap = await hardhatToken.awardMap(cycle);
        console.log("cycle:%s reward:%s",cycle,awardMap);
      });
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
      it("cycle", async function () {
        const { hardhatToken, owner, addr1, addr2,addr3 } = await loadFixture(deployTokenFixture);
        await hardhatToken.setCycle(1);
        let awardMap = await hardhatToken.awardMap(0);
        console.log("cycle:0 reward:%d",awardMap);
      });
    });
  });
  