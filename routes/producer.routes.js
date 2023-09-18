const { Router } = require('express');
const {
  addProducer,
  getAllProducers,
  getProducerById,
  updateProducerById,
  deleteProducerById,
} = require('../controllers/producer.controllers');

const router = Router();

const Validator = require('../middleware/validator');
const clientGuard = require("../middleware/client.guard.js")
const clientRolesGuard = require("../middleware/client.roles.guard.js")

router.post('/', Validator("producer"), addProducer);
router.get('/', getAllProducers);
router.get('/:id', getProducerById);
router.put('/:id', Validator("producer"), clientGuard, clientRolesGuard(["CHANGE", "DELETE"]), updateProducerById);
router.delete('/:id', clientGuard, clientRolesGuard(["DELETE"]), deleteProducerById);

module.exports = router