import {configureStore } from '@reduxjs/toolkit'

import {
	productDetailsReducer,
} from './reducers/productReducers'
import { productListReducer } from './features/products/productDataSlice'

const store = configureStore(
{
	reducer:{
		productList: productListReducer,
		productDetails: productDetailsReducer,
	}
}
)

export default store
