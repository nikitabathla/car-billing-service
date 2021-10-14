const express = require("express");
const app = express();
const config = require("./config/index");
const consumer = require("./routes/consumerRoute");
const consumerService = require("./services/consumerService");

app.use(express.json());
app.use("/consumer", consumer);

app.get("/", (req, res) => {
  res.send("Hello");
});

consumerService.consume().catch((err) => {
  console.log(err);
});

app.listen(config.port, () => {
  console.log(`Connected to port ${config.port}`);
});
