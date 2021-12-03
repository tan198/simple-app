// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const hre = require("ethers");

const tRate = hre.utils.formatUnits("2170000000000000000",18);
const convertRate = parseInt(tRate);

async function latestTime() {
  const block = await ethers.provider.getBlock("latest");
  return block.timestamp;
}

const duration = {
    seconds(val){
        return val;
    },
    minutes(val){
        return val * this.seconds(60);
    },
    hours(val){
        return val * this.minutes(60);
    },
    days(val){
        return val * this.hours(24);
    },
    weeks(val) {
        return val * this.days(7);
    },
     years(val) {
        return val * this.days(365);
    },
};

async function main(){
 
  
  const KeeyToken = await hre.ethers.getContractFactory("KeeyToken");
  const keeyToken = await KeeyToken.deploy();

  await keeyToken.deployed();

  console.log("KeeyToken deployed to:", keeyToken.address);
  console.log("Name:",await keeyToken.name());
  console.log("Symbol:",await keeyToken.symbol());
  console.log("Decimals:",await keeyToken.decimals());
  const totalSupply = await keeyToken.totalSupply();
  console.log("TotalSupply:",await totalSupply);
  const owner = await keeyToken.owner();
  console.log("Owner:",owner);

  const KeeyTokenCrowdsale = await ethers.getContractFactory("KeeyTokenCrowdsale");
  const rate = convertRate; // 0.00217 eth per token
  const latestBlockTime = await latestTime();
  const openingTime = latestBlockTime + duration.minutes(1);
  const closingTime = openingTime + duration.weeks(1); //1 week
  console.log("openingTime: ", openingTime);
  console.log("closingTime: ", closingTime);
  const keeyTokenCrowdsale = await KeeyTokenCrowdsale.deploy(
      rate,
      owner,
      keeyToken.address,
      owner,
      openingTime,
      closingTime
  );
  await keeyTokenCrowdsale.deployed();
  console.log("ICO Keey deploy: ", keeyTokenCrowdsale.address);


  await keeyToken.approve(
      keeyTokenCrowdsale.address,
      totalSupply.mul(ethers.BigNumber.from(100)).div(ethers.BigNumber.from(100))
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
