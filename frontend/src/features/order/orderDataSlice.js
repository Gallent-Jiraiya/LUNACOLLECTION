import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { createOrder } from './orderActions.js'
import orderDataService from './orderDataService.js'

const orderList = JSON.parse(localStorage.getItem('orders'))
// const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress'))

const initialState = {
	orderList: orderList ? orderList : [],
	lastOrderID: '',
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
}

export const orderDataSlice = createSlice({
	name: 'orders',
	initialState,
	reducers: {
		reset: (state) => {
			state.isLoading = false
			state.isError = false
			state.isSuccess = false
			state.message = ''
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createOrder.pending, (state) => {
				state.isLoading = true
			})
			.addCase(createOrder.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				state.isError = false
				state.message = ''
				const item = action.payload

				// const existItem = state.orderList.find(
				// 	(x) => x.product === item.product
				// )

				if (state.orderList.length === 0) {
					// console.log('cartitems.length=0')
					state.orderList = [item]
					state.lastOrderID = item.order
				} else {
					//if item is a new item it gets pushed to state
					// console.log('new item')
					state.orderList = [...state.orderList, item]
					state.lastOrderID = item.order
				}
				localStorage.setItem('orders', JSON.stringify(state.orderList))
			})
			.addCase(createOrder.rejected, (state, action) => {
				state.isLoading = false
				state.isSuccess = false
				state.isError = true
				state.message = action.payload
			})
	},
})

export const { reset } = orderDataSlice.actions
export default orderDataSlice.reducer
