"use strict";

const errors = {
  CarNotFound: {
    status: 404,
    code: "CAR_NOT_FOUND",
    message: "CarNotFound",
  },
};

Object.keys(errors).forEach((key) => {
  errors[key] = JSON.stringify(errors[key]);
});

module.exports = errors;
