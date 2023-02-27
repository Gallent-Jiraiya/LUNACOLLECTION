import express from 'express'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

import {
	addOrderItems,
	getMyOrders,
	getOrderByID,
	updateOrderToDelivered,
} from '../controllers/orderController.js'
//@Route api/orders

router.route('/').post(protect, addOrderItems)
router.route('/myorders').get(protect, getMyOrders)
router.route('/:id').get(protect, getOrderByID)
router.route('/:id/deliver').put(protect, updateOrderToDelivered)

export default router
