import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
//@desc create new order
//@route Post/api/orders
//@access private
const addOrderItems = asyncHandler(async (req, res) => {
	try {
		console.log(req.user._id)
		const {
			orderItems,
			shippingAddress,
			paymentMethod,
			itemsPrice,
			shippingPrice,
			totalPrice,
		} = req.body
		if (orderItems && orderItems.length === 0) {
			res.status(400)
			throw new Error('No order Items')
		} else {
			const order = new Order({
				user: req.user._id,
				orderItems,
				shippingAddress,
				paymentMethod,
				itemsPrice,
				shippingPrice,
				totalPrice,
			})
			const createdOrder = await order.save()
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
	console.log(order)
	if (order) {
		res.json(order)
	} else {
		res.status(404)
		throw new Error('Order not found')
	}
})

export { addOrderItems, getOrderByID }
