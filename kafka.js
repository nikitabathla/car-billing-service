const { Kafka } = require("kafkajs");
const config = require("./config/index");

const kafka = new Kafka({
  clientId: config.clientId,
  brokers: config.brokers,
});


module.exports = kafka;
