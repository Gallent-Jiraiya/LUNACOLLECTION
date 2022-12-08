import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import User from '../models/userModel.js'
//@desc create new order
//@route Post/api/orders
//@access public
const addOrderItems = asyncHandler(async (req, res) => {
	try {
		console.log('addorderItemsControllerreached')
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
			return
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

export { addOrderItems }
