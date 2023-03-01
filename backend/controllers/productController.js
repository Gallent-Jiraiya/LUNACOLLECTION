import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'
import path from 'path'
import { s3 } from '../server.js'

//@desc Fetch all products
//@route Get/api/products
//@access public
const getProducts = asyncHandler(async (req, res) => {
	const pageSize = 6
	const page = Number(req.query.pageNumber) || 1
	const keyword = req.query.keyword
		? { name: { $regex: req.query.keyword, $options: 'i' } }
		: {}
	const count = await Product.count({ ...keyword })
	const products = await Product.find({ ...keyword })
		.populate({
			path: 'category',
			select: 'name',
		})
		.limit(pageSize)
		.skip(pageSize * (page - 1))
	res.json({ products, page, pages: Math.ceil(count / pageSize) })
})
//@desc Fetch all products
//@route Get/api/productsall
//@access private/Admin
const getProductsAll = asyncHandler(async (req, res) => {
	const products = await Product.find().populate({
		path: 'category',
		select: 'name',
	})
	res.json(products)
})

//@desc Fetch single product
//@route Get/api/products/:id
//@access public
const getProductById = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id)

	if (product) {
		res.json(product)
	} else {
		res.status(404)
		throw new Error('Product not found')
	}
})
//@desc delete product
//@route Delete/api/products/:id
//@access private/Admin
const deleteProductById = asyncHandler(async (req, res) => {
	const product = await Product.findOne({ _id: req.params.id })
	const deleteParams = {
		Key: product.image.split('amazonaws.com/')[1],
		Bucket: 'luna-product-images',
	}
	s3.deleteObject(deleteParams, (err, data) => {
		if (err) {
			throw new Error('Failed to delete Image')
		}
		if (data) {
			product.delete().then(
				(data) => res.json('Product Successfully deleted'),
				(err) => {
					throw new Error(
						'Failed to remove item from DB, contact system Administrator'
					)
				}
			)
		}
	})
})
//@desc Update product
//@route PUT/api/products/:id
//@access private/Admin
const updateProductById = asyncHandler(async (req, res) => {
	const product = await Product.findOne({ _id: req.params.id })
	if (req.file) {
		const deleteParams = {
			Key: product.image.split('amazonaws.com/')[1],
			Bucket: 'luna-product-images',
		}
		s3.deleteObject(deleteParams, (err, data) => {
			if (err) {
				throw new Error('Failed to delete Image')
			}
			if (data) {
				const Key = `${product._id}-image${path.extname(req.file.originalname)}`
				const uploadParams = {
					Key: Key,
					Bucket: 'luna-product-images',
					Body: req.file.buffer,
				}
				s3.putObject(uploadParams, async (err, data) => {
					if (err) {
						res.status(400)
						throw new Error(
							`Failed to upload file to Server, please retry` + err
						)
					}
					if (data) {
						await Product.findOneAndUpdate(
							{ _id: req.params.id },
							{
								...req.body,
								image: `https://luna-product-images.s3.ap-south-1.amazonaws.com/${Key}`,
							}
						).then(
							(data) => {
								res.json('Product Successfully Updated' + data)
							},
							(error) => {
								throw new Error('Product update failed' + error)
							}
						)
					}
				})
			}
		})
	} else {
		await Product.findOneAndUpdate(
			{ _id: req.params.id },
			{
				...req.body,
				image: product.image,
			}
		).then(
			(data) => {
				res.json('Product Successfully Updated' + data)
			},
			(error) => {
				throw new Error('Product update failed' + error)
			}
		)
	}
})

//@desc create product
//@route PUT/api/products/:id
//@access private/Admin
const createProduct = asyncHandler(async (req, res) => {
	const newProduct = new Product({
		user: req.user._id,
		...req.body,
	})
	const Key = `${newProduct._id}-image${path.extname(req.file.originalname)}`
	const uploadParams = {
		Key: Key,
		Bucket: 'luna-product-images',
		Body: req.file.buffer,
	}
	s3.putObject(uploadParams, async (err, data) => {
		if (err) {
			res.status(400)
			throw new Error(`Failed to upload file to Server, please retry` + err)
		}
		if (data) {
			newProduct[
				'image'
			] = `https://luna-product-images.s3.ap-south-1.amazonaws.com/${Key}`
			await newProduct.save().then(
				(data) => res.json(`Product Successfully added`),
				(error) => {
					let deleteParams = {
						Key: Key,
						Bucket: 'luna-product-images',
					}
					s3.deleteObject(deleteParams, (err, data) => {
						if (err) {
							res.status(500)
							throw new Error(
								'Failed to add product to System and also failed delete the uploaded file from Bucket:' +
									err
							)
						}
						if (data) {
							res.status(500)
							throw new Error(`Failed to add product to the system` + error)
						}
					})
				}
			)
		}
	})
})
//@desc Get all the products ordered by user
//@route GET/api/products/ordered/
//@access Private
const getProductsOrdered = asyncHandler(async (req, res) => {
	const productIds = await Order.distinct('orderItems.product', {
		user: req.user._id,
		completed: true,
	})
	if (productIds) {
		res.json(productIds)
	} else {
		res.status(401)
		throw new Error('products not found')
	}
})

export {
	getProducts,
	getProductById,
	deleteProductById,
	updateProductById,
	createProduct,
	getProductsAll,
	getProductsOrdered,
}
