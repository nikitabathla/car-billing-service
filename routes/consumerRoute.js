const express = require("express");
const consumerService = require("../services/consumerService");

const router = express.Router();

router
  .route("/parking_time/:car_id")
  .get(consumerService.getTotalParkingTime);

router
  .route("/parking_charge/:car_id")
  .get(consumerService.getParkingCharge);
  
module.exports = router;
