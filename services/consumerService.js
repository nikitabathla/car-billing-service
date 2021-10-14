const kafka = require("../kafka");
const config = require("../config/index");
const nano = require("nano")(`http://${config.couch_db_host}:${config.couch_db_port}`);
const fabricService = require("./fabricService");
const serviceHandler = require("../serviceHandler");
const errors = require("../constant/errors");

const car = nano.use(config.couch_db_name);
const consumer = kafka.consumer({ groupId: "test-group" });

const consume = async (req, res) => {
  await consumer.connect();
  await consumer.subscribe({ topic: "test", fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message }) => {

      const carArgs = {
        car_id: message.key.toString(),
        time_of_parking: message.value.toString(),
      };

      await fabricService.addCar(carArgs);
    },
  });
};

async function getTotalParkingTime(req, res) {
  try {
    const result = await car.view("car_information", "entryTime", {
      key: req.params.car_id,
    });

    if (result.rows == 0) {
      throw new Error(errors.CarNotFound);
    }

    let time = parseInt(result.rows[0].value);
    let hours = Date.now() / 3600000 - time / 3600000;
    let minutes = Math.trunc(60 * (hours % 1));

    const data = {
      car_id: req.params.car_id,
      hours: Math.trunc(hours),
      minutes: minutes,
    };

    serviceHandler.constructResponse(req, res, data);
  } catch (err) {
    serviceHandler.constructErrorResponse(err.message, req, res);
  }
}

async function getParkingCharge(req, res) {
  try {
    const result = await car.view("car_information", "entryTime", {
      key: req.params.car_id,
    });

    if (result.rows == 0) {
      throw new Error(errors.CarNotFound);
    }

    let time = parseInt(result.rows[0].value);
    let minutes = Math.trunc(Date.now() / 60000 - time / 60000);
    let amount_in_rupees = minutes * 2;

    const data = {
      car_id: req.params.car_id,
      amount_in_rupees,
    };

    serviceHandler.constructResponse(req, res, data);
  } catch (err) {
    serviceHandler.constructErrorResponse(err.message, req, res);
  }
}

module.exports = {
  consume,
  getTotalParkingTime,
  getParkingCharge,
};
