const config = require("../config/index");
const nano = require("nano")(`http://${config.couch_db_host}:${config.couch_db_port}`);
const views = require("../views/views");

async function check() {
  try {
    const info = await nano.db.get(config.couch_db_name)
    if (info) {
      const car = nano.use(config.couch_db_name);
      let docsList = (await car.list()).rows;
      const found = docsList.find((ob) => ob.id === "_design/car_information");
      if (!found) {
        createViews();
      } else {
        console.log("Views already exist.");
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function createViews() {
  try {
    const car = nano.use(config.couch_db_name);
    await car.insert({ views }, `_design/car_information`);
    console.log("View Creation Done.");
  } catch (err) {
    console.log("View Creation Error.");
    console.log(err);
  }
}

check();
