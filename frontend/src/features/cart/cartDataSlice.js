import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { addToCart } from './cartActions'
import cartDataService from './cartDataService'

const cart = JSON.parse(localStorage.getItem('cartItems'))
const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'))

const initialState = {
	cartItems: cart ? cart : [],
	shippingAddress: shippingAddress ? shippingAddress : {},
	paymentMethod: 'PayPal',
	itemsPrice: 0,
	shippingPrice: 0,
	totalPrice: 0,
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
}

export const cartDataSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		reset: (state) => {
			state.isLoading = false
			state.isError = false
			state.isSuccess = false
			state.message = ''
		},
		setPrices: (state, action) => {
			state.itemsPrice = action.payload.itemsPrice
			state.shippingPrice = action.payload.shippingPrice
			state.totalPrice = action.payload.totalPrice
		},
		savePaymentMethod: (state, action) => {
			state.paymentMethod = action.payload
		},
		addShippingAddress: (state, action) => {
			state.shippingAddress = action.payload
			localStorage.setItem(
				'shippingAddress',
				JSON.stringify(state.shippingAddress)
			)
		},
		removeFromCart: (state, action) => {
			state.cartItems = state.cartItems.filter(
				(x) => x.product !== action.payload
			)
			localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(addToCart.pending, (state) => {
				state.isLoading = true
			})
			.addCase(addToCart.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true

				const item = action.payload

				const existItem = state.cartItems.find(
					(x) => x.product === item.product
				)

				if (state.cartItems.length === 0) {
					// console.log('cartitems.length=0')
					state.cartItems = [item]
				} else if (existItem) {
					console.log('already exists')
					const cart = state.cartItems.map((x) => {
						if (x.product === item.product) {
							// console.log(current(x))
							// console.log(item)
							return item
						} else {
							return x
						}
					})
					// console.log(cart)
					state.cartItems = cart
				} else {
					//if item is a new item it gets pushed to state
					// console.log('new item')
					state.cartItems = [...state.cartItems, item]
				}
				localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
			})
			.addCase(addToCart.rejected, (state, action) => {
				state.isLoading = false
				state.isSuccess = false
				state.isError = true
				state.message = action.payload
			})
	},
})

export const {
	reset,
	removeFromCart,
	addShippingAddress,
	savePaymentMethod,
	setPrices,
} = cartDataSlice.actions
export default cartDataSlice.reducer
