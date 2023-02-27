import { createSlice } from '@reduxjs/toolkit'
import { deleteProduct, listProducts } from './productAction'

const initialState = {
	products: null,
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
	action: '',
}

export const productListDataSlice = createSlice({
	name: 'productList',
	initialState,
	reducers: {
		resetProductList: (state) => {
			state.products = null
			state.isLoading = false
			state.isError = false
			state.isSuccess = false
			state.message = ''
			state.action = ''
		},
		resetProductListStatus: (state) => {
			state.isLoading = false
			state.isError = false
			state.isSuccess = false
			state.message = ''
			state.action = ''
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(listProducts.pending, (state) => {
				state.isLoading = true
				state.isError = false
				state.isSuccess = false
				state.action = 'getAllProducts'
			})
			.addCase(listProducts.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				state.isError = false
				state.products = action.payload
				state.action = 'getAllProducts'
			})
			.addCase(listProducts.rejected, (state, action) => {
				state.isLoading = false
				state.isSuccess = false
				state.isError = true
				state.message = action.payload
				state.action = 'getAllProducts'
				//state.products=[]
			})
			.addCase(deleteProduct.pending, (state) => {
				state.isLoading = true
				state.isSuccess = false
				state.isError = false
				state.action = 'deleteProduct'
			})
			.addCase(deleteProduct.fulfilled, (state, action) => {
				state.isLoading = false
				state.isError = false
				state.message = ''
				state.isSuccess = true
				state.message = action.payload
				state.action = 'deleteProduct'
			})
			.addCase(deleteProduct.rejected, (state, action) => {
				state.isLoading = false
				state.isSuccess = false
				state.isError = true
				state.message = action.payload
				state.action = 'deleteProduct'
				//state.product = []
			})
	},
})

export const { resetProductList, resetProductListStatus } =
	productListDataSlice.actions
export default productListDataSlice.reducer
