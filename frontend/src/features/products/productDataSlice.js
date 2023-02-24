import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productService from './productService'

const initialState = {
	product: { reviews: [] },
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
}

//getProducts
export const listProduct = createAsyncThunk(
	'products/get/:id',
	async (id, thunkAPI) => {
		try {
			return await productService.listProduct(id)
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

export const productDataSlice = createSlice({
	name: 'productDetails',
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
			.addCase(listProduct.pending, (state) => {
				state.isLoading = true
				state.isSuccess = false
			})
			.addCase(listProduct.fulfilled, (state, action) => {
				state.isLoading = false
				state.isError = false
				state.message = ''
				state.isSuccess = true
				state.product = action.payload
			})
			.addCase(listProduct.rejected, (state, action) => {
				state.isLoading = false
				state.isSuccess = false
				state.isError = true
				state.message = action.payload
				//state.product = []
			})
	},
})

export const { reset } = productDataSlice.actions
export default productDataSlice.reducer
