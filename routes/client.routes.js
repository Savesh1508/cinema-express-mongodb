const { Router } = require('express');
const {
  registrationClient,
  getAllClients,
  getClientById,
  updateClientById,
  deleteClientById,
  loginClient,
  logoutClient,
  refreshClientToken,
  activationClient,
  banClientById,
} = require('../controllers/client.controllers');

const router = Router();

const Validator = require('../middleware/validator');
const clientGuard = require("../middleware/client.guard.js")
const clientRolesGuard = require("../middleware/client.roles.guard.js")

router.post('/', Validator("client"), registrationClient);
router.get('/', getAllClients);
router.get('/:id', getClientById);
router.put('/:id', Validator("client"), clientGuard, clientRolesGuard(["CHANGE", "DELETE"]), updateClientById);
router.delete('/:id', clientGuard, clientRolesGuard(["DELETE"]), deleteClientById);
router.post('/login', Validator("emailPass"), loginClient);
router.post('/logout', clientGuard, logoutClient);
router.get('/activate/:link', activationClient);
router.post('/refresh', clientGuard, refreshClientToken);
router.post('ban/:id', clientGuard, clientRolesGuard(["CHANGE", "DELETE"]), banClientById);

module.exports = router