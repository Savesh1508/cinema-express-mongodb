const emailPass = require('./email_pass.validator.js');
const cinema = require('./cinema.validator.js');
const client = require('./client.validator.js');
const film = require('./film.validator.js');
const location = require('./location.validator.js');
const order = require('./order.validator.js');
const producer = require('./producer.validator.js');
const region = require('./region.validator.js');


module.exports = {
  emailPass,
  cinema,
  client,
  film,
  location,
  order,
  producer,
  region,
};
