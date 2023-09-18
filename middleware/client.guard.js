const MyJwt = require("../services/jwt_service.js");
const { badRequest } = require('../error/api_error.js');

async function to(promise) {
  return promise
    .then((response) => [null, response]) // [null, response]
    .catch((error) => [error]); // [error, null]
}


module.exports = async function(req, res, next) {
  if(req.method == "OPTIONS"){
    next();
  }

  try {
    const authorization = req.headers.authorization

    if (!authorization) {
      return res.status(403).json({"message": "You are is not registered!"})
    }

    const bearer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];
    if(bearer != "Bearer" || !token){
      throw badRequest("You are not registered!");
    }

    const [error, decodedToken] = await to(
      MyJwt.verifyAccess(token)
    );
    if(error) {
      return res.status(403).json({"message": error.message})
    }

    if(!decodedToken.is_active) {
      return res.status(400).json({"message": "You are banned!"})
    }

    req.client = decodedToken;
    next()
  } catch (error) {
    console.log(error);
    return res.status(403).send({"message": "You are is not registered! (incorrect token)"})
  }
};