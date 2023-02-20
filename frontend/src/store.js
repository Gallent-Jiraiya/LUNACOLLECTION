import { configureStore } from '@reduxjs/toolkit'

import productListDataReducer from './features/products/productListDataSlice'
import productDataReducer from './features/products/productDataSlice'
import cartDataReducer from './features/cart/cartDataSlice'
import orderDataReducer from './features/order/orderDataSlice'
import userLogInDataReducer from './features/users/userLogInDataSlice'
import profileDataReducer from './features/users/profileDataSlice'

const store = configureStore({
	reducer: {
		productList: productListDataReducer,
		productDetails: productDataReducer,
		cart: cartDataReducer,
		userLogInDetails: userLogInDataReducer,
		profileDetails: profileDataReducer,
		orders: orderDataReducer,
	},
})

export default store
