const { Router } = require('express');
const {
  addOrder,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
} = require('../controllers/order.controllers');

const router = Router();

const Validator = require('../middleware/validator');
const clientGuard = require("../middleware/client.guard.js")
const clientRolesGuard = require("../middleware/client.roles.guard.js")

router.post('/', Validator("order"), addOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id', Validator("order"), clientGuard, clientRolesGuard(["CHANGE", "DELETE"]), updateOrderById);
router.delete('/:id', clientGuard, clientRolesGuard(["DELETE"]), deleteOrderById);

module.exports = router