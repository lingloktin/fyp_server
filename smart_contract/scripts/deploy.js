const fs = import("fs")

async function main() {
    const Token = await ethers.getContractFactory("FypToken");
    const token = await Token.deploy();
  
    await token.deployed();
  
    console.log("Token address:", token.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });