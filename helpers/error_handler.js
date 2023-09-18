const errorHandler = (res, error) => {
  res.status(500).send({"message": `Error: ${error}`});
}

module.exports = {
  errorHandler,
}