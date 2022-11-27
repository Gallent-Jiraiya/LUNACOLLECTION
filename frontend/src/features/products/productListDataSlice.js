import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import productService from './productService'

const products = JSON.parse(localStorage.getItem('products'))

const initialState = {
	products: products? products:[],
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
}

//getProducts
export const listProducts = createAsyncThunk(
	'products/get',
	async (thunkAPI) => {
		try {
			return await productService.getProducts()
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

export const productListDataSlice = createSlice({
	name: 'productList',
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
    .addCase(listProducts.pending,(state)=>{
      state.isLoading=true
    })
    .addCase(listProducts.fulfilled,(state,action)=>{
      state.isLoading=false
      state.isSuccess=true
      state.products=action.payload
    })
    .addCase(listProducts.rejected,(state,action)=>{
      state.isLoading=false
      state.isSuccess=false
      state.isError=true
      state.message=action.payload
      //state.products=[]
    })
  },
})

export const { reset } = productListDataSlice.actions
export default productListDataSlice.reducer
