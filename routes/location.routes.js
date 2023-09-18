const { Router } = require('express');
const {
  addLocation,
  getAllLocations,
  getLocationById,
  updateLocationById,
  deleteLocationById,
} = require('../controllers/location.controllers');

const router = Router();

const Validator = require('../middleware/validator');
const clientGuard = require("../middleware/client.guard.js")
const clientRolesGuard = require("../middleware/client.roles.guard.js")

router.post('/', Validator("location"), addLocation);
router.get('/', getAllLocations);
router.get('/:id', getLocationById);
router.put('/:id', Validator("location"), clientGuard, clientRolesGuard(["CHANGE", "DELETE"]), updateLocationById);
router.delete('/:id', clientGuard, clientRolesGuard(["DELETE"]), deleteLocationById);

module.exports = router