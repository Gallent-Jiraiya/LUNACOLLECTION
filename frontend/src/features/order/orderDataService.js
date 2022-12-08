import axios from 'axios'

const getOrderById = async (id, qty) => {
	const { data } = await axios.get(`/api/orders/${id}`)
	return {
		product: data._id,
		name: data.name,
		image: data.image,
		price: data.price,
		countInStock: data.countInStock,
		qty: parseInt(qty),
	}
}

const makeOrder = async (
	{ orderItems, shippingAddress, paymentMethod, shippingPrice, totalPrice },
	config
) => {
	console.log('makeOrdergetCaleed')
	const { data } = await axios.post(
		`/api/orders`,
		{
			orderItems,
			shippingAddress,
			paymentMethod,
			shippingPrice,
			totalPrice,
		},
		config
	)

	return {
		order: data._id,
		user: data.user,
		orderItems: data.orderItems,
		shippingAddress: data.shippingAddress,
		paymentMethod: data.paymentMethod,
		paymentResult: data.paymentResult,
		shippingPrice: parseInt(shippingPrice),
		totalPrice: parseInt(totalPrice),
	}
}

const orderDataService = {
	getOrderById,
	makeOrder,
}
export default orderDataService
