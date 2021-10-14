async function constructResponse(req, res, data) {
  res.status(200).send({
    status: 200,
    code: "OK",
    message: "OK",
    data,
  });
}

async function constructErrorResponse(err, req, res) {
  const errObj = JSON.parse(err);
  res.status(errObj.status).send({
    error: errObj,
  });
}

module.exports = {
  constructResponse,
  constructErrorResponse,
};
