import express from 'express';
import { addOrderItems, getOrders, updateOrderStatus } from '../controllers/orderController.js';
const router = express.Router();

router.route('/').post(addOrderItems).get(getOrders);
router.route('/:id').patch(updateOrderStatus);

export default router;