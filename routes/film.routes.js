const { Router } = require('express');
const {
  addFilm,
  getAllFilms,
  getFilmById,
  updateFilmById,
  deleteFilmById,
} = require('../controllers/film.controllers');

const router = Router();

const Validator = require('../middleware/validator');
const clientGuard = require("../middleware/client.guard.js")
const clientRolesGuard = require("../middleware/client.roles.guard.js")

router.post('/', Validator("film"), addFilm);
router.get('/', getAllFilms);
router.get('/:id', getFilmById);
router.put('/:id', Validator("film"), clientGuard, clientRolesGuard(["CHANGE", "DELETE"]), updateFilmById);
router.delete('/:id', clientGuard, clientRolesGuard(["DELETE"]), deleteFilmById);

module.exports = router