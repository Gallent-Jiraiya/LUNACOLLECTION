import axios from 'axios'

// const API_URL='/api/cart'

const checkCart = async (id, qty) => {
	const { data } = await axios.get(`/api/products/${id}`)
	//console.log(qty)
	//
	return {
		product: data._id,
		name: data.name,
		image: data.image,
		price: data.price,
		countInStock: data.countInStock,
		qty: parseInt(qty),
	}
}

const cartDataService = {
	checkCart,
}
export default cartDataService
