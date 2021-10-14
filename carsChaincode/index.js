"use strict";

const shim = require("fabric-shim");

let Chaincode = class {
  async Init(stub) {
    //Insert dummy data
    const time = {
      entryTime: Date.now().toString(),
    };
    await stub.putState('0', Buffer.from(JSON.stringify(time)));
    return shim.success();
  }

  async Invoke(stub) {
    try {
      let result = stub.getFunctionAndParameters();
      console.log(result);

      let method = this[result.fcn].bind(this);
      if (!method) {
        console.warn("Invalid chaincode method name.");
        throw new Error(
          "Received unknown function " + result.fcn + " invocation."
        );
      }

      console.info(`Calling ${result.fcn}...`);

      let parameters = result.params;
      let payload = await method(stub, ...parameters);
      return shim.success("Successfull transaction.", payload);
    } catch (err) {
      console.warn("Error during method invocation.");
      return shim.error(err);
    }
  }

  async addCar(stub, carId, entryTime) {
    try {
      if (!carId || !entryTime) {
        console.warn("Invalid chaincode method arguements.");
        throw new Error("Invalid chaincode method arguements.");
      }
      let time = {
        entryTime,
      };

      await stub.putState(carId, Buffer.from(JSON.stringify(time)));
      console.log("Car added successfully.");
    } catch (err) {
      console.warn("Error during transaction processing.");
      return shim.error(err);
    }
  }
};

shim.start(new Chaincode());
