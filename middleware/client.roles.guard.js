const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(roles) {
  return function(req, res, next) {
    if(req.method == "OPTIONS"){
      next();
    }

    try {
      const authorization = req.headers.authorization
      if (!authorization) {
        return res.status(403).json({"message": "You are not registered!"})
      }

      const bearer = authorization.split(" ")[0];
      const token = authorization.split(" ")[1];
      if(bearer != "Bearer" || !token){
        return res.status(403).json({"message": "You are not registered!"})
      }

      const { clientRoles } = jwt.verify(token, config.get("secret"));
      let hasRole = false

      clientRoles.forEach(clientRole => {
        if (roles.includes(clientRole)) {
          hasRole = true
        }
      });

      if(!hasRole){
        return res.status(403).json({"message": "You haven't such a right!"})
      }
      next()
    } catch (error) {
      console.log(error);
      return res.status(403).send({"message": "You are not registered!"})
    }
  }
}