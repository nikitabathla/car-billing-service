"use strict";

const { Gateway, Wallets } = require("fabric-network");
const fs = require("fs");
const path = require("path");

async function main(callback) {
  try {
    // load the network configuration
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "fabric-samples",
      "basic-network",
      "connection.json"
    );

    let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "postDeployment/wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get("admin");
    if (!identity) {
      console.log("An identity for admin does not exist in the wallet.");
      console.log("Run the enrollAdmin.js application before retrying.");
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");

    // Get the contract from the network.
    const contract = network.getContract("carChaincode");
    callback(contract);

    // Disconnect from the gateway.
    // await gateway.disconnect();
  } catch (error) {
    console.error(`Failed: ${error}`);
    process.exit(1);
  }
}

async function addCar(args) {

  main(async contract => {
    try {
      await contract.submitTransaction(
        "addCar",
        args.car_id,
        args.time_of_parking
      );
      console.log("Transaction has been submited.");
    } catch (err) {
      console.log(err);
    }
  });
}

module.exports = {
  addCar,
};
