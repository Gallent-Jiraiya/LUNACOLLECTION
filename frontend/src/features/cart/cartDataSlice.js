import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit'
import cartDataService from './cartDataService'

const cart = JSON.parse(localStorage.getItem('cartItems'))

const initialState = {
	cartItems: cart ? cart : [],
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
}

//addProducts
export const addToCart = createAsyncThunk('cart/add', async (ob, thunkAPI) => {
	try {
		console.log(ob)
		return await cartDataService.checkCart(ob.id, ob.qty)
	} catch (error) {
		const message =
			(error.response && error.response.data && error.response.data.message) ||
			error.message ||
			error.toString()
		return thunkAPI.rejectWithValue(message)
	}
})

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
				const existItem = state.cartItems.filter(
					(x) => x.product === item.product
				)

				if (state.cartItems.length === 0) {
					// console.log('cartitems.length=0')
					state.cartItems = [item]
				} else if (existItem.length > 0) {
					// console.log('already exists')
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
				//state.cart=[]
			})
	},
})

export const { reset, removeFromCart } = cartDataSlice.actions
export default cartDataSlice.reducer
