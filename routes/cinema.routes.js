const { Router } = require('express');
const {
  addCinema,
  getAllCinemas,
  getCinemaById,
  updateCinemaById,
  deleteCinemaById,
} = require('../controllers/cinema.controllers');

const router = Router();

const Validator = require('../middleware/validator');
const clientGuard = require("../middleware/client.guard.js")
const clientRolesGuard = require("../middleware/client.roles.guard.js")

router.post('/', Validator("cinema"), addCinema);
router.get('/', getAllCinemas);
router.get('/:id', getCinemaById);
router.put('/:id', Validator("cinema"), clientGuard, clientRolesGuard(["CHANGE", "DELETE"]), updateCinemaById);
router.delete('/:id', clientGuard, clientRolesGuard(["DELETE"]), deleteCinemaById);

module.exports = router