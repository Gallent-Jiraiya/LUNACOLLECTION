import { createSlice } from '@reduxjs/toolkit'
import { createOrder, getOrderById } from './orderActions.js'

const initialState = {
	orderList: [],
	order: null,
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
	action: '',
}

export const orderDataSlice = createSlice({
	name: 'orders',
	initialState,
	reducers: {
		resetOrderStatus: (state) => {
			state.isLoading = false
			state.isError = false
			state.isSuccess = false
			state.message = ''
		},
		resetOrderData: (state) => {
			state.orderList = []
			state.order = null
			state.isError = false
			state.isSuccess = false
			state.isLoading = false
			state.message = ''
			state.action = ''
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createOrder.pending, (state) => {
				state.isLoading = true
				state.isSuccess = false
				state.isError = false
				state.message = ''
				state.action = 'createOrder'
			})
			.addCase(createOrder.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				state.isError = false
				state.message = ''
				state.order = action.payload
				state.action = 'createOrder'
			})
			.addCase(createOrder.rejected, (state, action) => {
				state.isLoading = false
				state.isSuccess = false
				state.isError = true
				state.message = action.payload
				state.action = 'createOrder'
			})
			.addCase(getOrderById.pending, (state) => {
				state.isLoading = true
				state.isSuccess = false
				state.isError = false
				state.message = ''
				state.action = 'getOrderById'
			})
			.addCase(getOrderById.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				state.isError = false
				state.message = ''
				state.order = action.payload
				state.action = 'getOrderById'
			})
			.addCase(getOrderById.rejected, (state, action) => {
				state.isLoading = false
				state.isSuccess = false
				state.isError = true
				state.message = action.payload
				state.action = 'getOrderById'
			})
	},
})

export const { resetOrderStatus, resetOrderData } = orderDataSlice.actions
export default orderDataSlice.reducer
