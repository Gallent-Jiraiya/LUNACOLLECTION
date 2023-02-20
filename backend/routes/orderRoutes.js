import express from 'express'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

import { addOrderItems, getOrderByID } from '../controllers/orderController.js'
//@Route api/orders

router.route('/').post(protect, addOrderItems)
router.route('/:id').get(protect, getOrderByID)

export default router
