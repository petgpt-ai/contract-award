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
      
      const [owner, addr1, addr2,addr3] = await ethers.getSigners();
  
      // To deploy our contract, we just have to call Token.deploy() and await
      // for it to be deployed(), which happens onces its transaction has been
      // mined.
      const hardhatToken = await upgrades.deployProxy(Token,[],{initializer: 'initialize'})
      await hardhatToken.deployed();
      // Fixtures can return anything you consider useful for your tests
      return { Token, hardhatToken, owner, addr1, addr2,addr3 };
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
      it("award", async function () {
        const { hardhatToken, owner, addr1, addr2,addr3 } = await loadFixture(deployTokenFixture);
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

        const signer = await ethers.provider.getSigner()
        const nonce = await signer.getTransactionCount()
        const gasLimit = ethers.utils.hexlify(41000)
        const gasPrice = await signer.getGasPrice()
        const tx = {
          from: owner.address,
          to: hardhatToken.address,
          value: ethers.utils.parseUnits('1.0'),
          nonce: nonce,
          gasLimit: gasLimit,
          gasPrice: gasPrice,
        }
        await signer.sendTransaction(tx)

        const contractBalance2 = await ethers.provider.getBalance(hardhatToken.address)
        console.log("token balance:%s",contractBalance2);

        // await hardhatToken.setCacheAddress(addr1.address);
        const awardInfos = [
          {
            userAddress:addr2.address,
            rate:10,
          },
          {
            userAddress:addr3.address,
            rate:90,
          }
        ]
        await hardhatToken.award(awardInfos);

        const contractBalance3 = await ethers.provider.getBalance(addr2.address)
        console.log("addr2 balance:%s",contractBalance3);
        const contractBalance4 = await ethers.provider.getBalance(addr3.address)
        console.log("addr3 balance:%s",contractBalance4);
        const cycle = await hardhatToken.cycle();
        console.log("cycle:%s",cycle);
        const awardMap = await hardhatToken.awardMap(cycle);
        console.log("token balance:%s",awardMap);
      });
    });
  });
  