import express from 'express'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

import {
	authUser,
	getUserProfile,
	registerUser,
	updateUserProfile,
} from '../controllers/userController.js'

router.post('/login', authUser)
router
	.route('/profile')
	.get(protect, getUserProfile)
	.put(protect, updateUserProfile)
router.route('/').post(registerUser)

export default router
