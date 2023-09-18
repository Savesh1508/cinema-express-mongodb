const { Router } = require('express');
const {
  addRegion,
  getAllRegions,
  getRegionById,
  updateRegionById,
  deleteRegionById,
} = require('../controllers/region.controllers');

const router = Router();

const Validator = require('../middleware/validator');
const clientGuard = require("../middleware/client.guard.js")
const clientRolesGuard = require("../middleware/client.roles.guard.js")

router.post('/', Validator("region"), addRegion);
router.get('/', getAllRegions);
router.get('/:id', getRegionById);
router.put('/:id', Validator("region"), clientGuard, clientRolesGuard(["CHANGE", "DELETE"]), updateRegionById);
router.delete('/:id', clientGuard, clientRolesGuard(["DELETE"]), deleteRegionById);

module.exports = router