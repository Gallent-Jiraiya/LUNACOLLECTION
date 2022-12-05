import express from 'express'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

import {
	authUser,
	getUserProfile,
	registerUser,
} from '../controllers/userController.js'

router.post('/login', authUser)
router.route('/profile').get(protect, getUserProfile)
router.route('/').post(registerUser)

export default router
