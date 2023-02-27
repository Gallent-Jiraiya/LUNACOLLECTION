import axios from 'axios'
import { getCookie } from '../../middleware/getCookie'

const API_URL = '/api/products'

const listProduct = async (id) => {
	const response = await axios.get(`/api/products/${id}`)

	return response.data
}

//retrieve products
const getProducts = async () => {
	const token = decodeURI(getCookie('token'))
	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	}
	const response = await axios.get(API_URL, config)
	return response.data
} //retrieve products
const deleteProduct = async (id) => {
	const token = decodeURI(getCookie('token'))
	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	}
	const response = await axios.delete(`/api/products/${id}`, config)
	return response.data
}
const updateProduct = async (id, object) => {
	const token = decodeURI(getCookie('token'))
	const config = {
		headers: {
			'Content-Type': 'multipart/form-data',
			Authorization: `Bearer ${token}`,
		},
	}
	const response = await axios.put(`/api/products/${id}`, object, config)
	return response.data
}
const addProduct = async (object) => {
	const token = decodeURI(getCookie('token'))
	const config = {
		headers: {
			'Content-Type': 'multipart/form-data',
			Authorization: `Bearer ${token}`,
		},
	}
	const response = await axios.post(`/api/products/`, object, config)
	return response.data
}

const productService = {
	getProducts,
	listProduct,
	deleteProduct,
	updateProduct,
	addProduct,
}
export default productService
