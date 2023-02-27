import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'
//@desc create new order
//@route Post/api/orders
//@access private
const addOrderItems = asyncHandler(async (req, res) => {
	try {
		const {
			orderItems,
			shippingAddress,
			paymentMethod,
			shippingPrice,
			totalPrice,
			paymentResult,
		} = req.body
		if (orderItems && orderItems.length === 0) {
			res.status(400)
			throw new Error('No order Items')
		} else {
			console.log(req.body)

			const order = new Order({
				user: req.user._id,
				orderItems,
				shippingAddress,
				paymentMethod,
				shippingPrice,
				totalPrice,
				paymentResult,
			})
			const createdOrder = await order.save()
			orderItems.map((item) => {
				console.log(item)
				Product.findById(item.product).then((product) => {
					product.countInStock = product.countInStock - item.qty
					product.save()
				})
			})
			res.status(201).json(createdOrder)
		}
	} catch (error) {
		console.log(error)
	}
})

//@desc get order by ID
//@route Post/api/orders/:id
//@access private
const getOrderByID = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id).populate(
		'user',
		'name email'
	)
	if (order) {
		res.json(order)
	} else {
		res.status(404)
		throw new Error('Order not found')
	}
})
//@desc Update order to delivered
//@route Post/api/orders/:id
//@access private
const updateOrderToDelivered = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id)
	if (order) {
		order.isDelivered = true
		order.deliveredAt = Date.now()

		const updatedOrder = await order.save()
		res.json(updatedOrder)
	} else {
		res.status(404)
		throw new Error('Order not found')
	}
})
//@desc get logged in user orders
//@route GET/api/orders/myorders
//@access private
const getMyOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({ user: req.user._id })
	res.status(200).json(orders)
})

export { addOrderItems, getOrderByID, updateOrderToDelivered, getMyOrders }
