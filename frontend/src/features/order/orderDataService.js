import axios from 'axios'
import { getCookie } from '../../middleware/getCookie'

const getOrderById = async (id) => {
	const token = decodeURI(getCookie('token'))
	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	}
	const { data } = await axios.get(`/api/orders/${id}`, config)
	return data
}

const makeOrder = async ({
	orderItems,
	shippingAddress,
	paymentMethod,
	shippingPrice,
	totalPrice,
}) => {
	const token = decodeURI(getCookie('token'))
	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	}
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
