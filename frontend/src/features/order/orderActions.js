import { createAsyncThunk } from '@reduxjs/toolkit'
import orderDataService from './orderDataService'

//addProducts
export const createOrder = createAsyncThunk(
	'order/add',
	async (
		{ orderItems, shippingAddress, paymentMethod, shippingPrice, totalPrice },
		thunkAPI
	) => {
		try {
			// console.log('createOrdergetCalled')
			const response = await orderDataService.makeOrder({
				orderItems,
				shippingAddress,
				paymentMethod,
				shippingPrice,
				totalPrice,
			})
			return response
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString()
			return thunkAPI.rejectWithValue(message)
		}
	}
)

//get Order by id
export const getOrderById = createAsyncThunk(
	'order/get',
	async (id, thunkAPI) => {
		try {
			return await orderDataService.getOrderById(id)
		} catch (error) {
			const message =
				(error.response &&
					error.response.data &&
					error.response.data.message) ||
				error.message ||
				error.toString()
			return thunkAPI.rejectWithValue(message)
		}
	}
)
