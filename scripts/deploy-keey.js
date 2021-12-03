// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const KeeyToken = await hre.ethers.getContractFactory("KeeyToken");
  const keeyToken = await KeeyToken.deploy();

  await keeyToken.deployed();

  console.log("KeeyToken deployed to:", keeyToken.address);
  console.log("Name:",await keeyToken.name());
  console.log("Symbol:",await keeyToken.symbol());
  console.log("Decimals:",await keeyToken.decimals());
  console.log("TotalSupply:",await keeyToken.totalSupply());
  console.log("Owner:",await keeyToken.owner());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
