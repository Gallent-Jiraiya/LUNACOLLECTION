import express from 'express'
import multer from 'multer'

const router = express.Router()
import {
	createProduct,
	deleteProductById,
	getProductById,
	getProducts,
	getProductsAll,
	getProductsOrdered,
	updateProductById,
} from '../controllers/productController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const uploadImage = multer({
	fileFilter: (req, file, cb) => {
		if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
			cb(null, true)
		} else {
			cb(null, false)
			return cb(new Error('Only image formats are allowed!'))
		}
	},
}).single('image')

router
	.route('/')
	.get(getProducts)
	.post(protect, admin, uploadImage, createProduct)
router.route('/ordered').get(protect, getProductsOrdered)
router.route('/all').get(protect, admin, getProductsAll)
router
	.route('/:id')
	.get(getProductById)
	.delete(protect, admin, deleteProductById)
	.put(protect, admin, uploadImage, updateProductById)

export default router
