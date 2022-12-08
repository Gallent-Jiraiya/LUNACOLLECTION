import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from './userService'

const userInfo = JSON.parse(localStorage.getItem('userInfo'))

const initialState = {
	userInfo: userInfo ? userInfo : null,
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
}
//action functions
//called from logIn screen
export const logInUser = createAsyncThunk(
	'users/login',
	async ({ email, password }, thunkAPI) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
			}
			const data = await userService.login({ email, password }, config)
			localStorage.setItem('userInfo', JSON.stringify(data))
			console.log(data)
			return data
			//return await productService.listProduct(id)
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
export const registerUser = createAsyncThunk(
	'users/register',
	async ({ name, email, password }, thunkAPI) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
				},
			}
			const data = await userService.register({ name, email, password }, config)
			localStorage.setItem('userInfo', JSON.stringify(data))
			console.log(data)
			return data
			//return await productService.listProduct(id)
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

export const userLogInDataSlice = createSlice({
	name: 'userDetails',
	initialState,
	reducers: {
		setUserInfoName: (state, action) => {
			state.userInfo.name = action.payload
		},
		setUserInfoMail: (state, action) => {
			state.userInfo.email = action.payload
		},
		reset: (state) => {
			state.isLoading = false
			state.isError = false
			state.isSuccess = false
			state.message = ''
			console.log('userLogin reset called')
		},
		logout: (state) => {
			state.isLoading = false
			state.isError = false
			state.isSuccess = false
			state.message = ''
			state.userInfo = null
			localStorage.removeItem('userInfo')
		},
	},
	extraReducers: (builder) => {
		builder
			//for logIn User
			.addCase(logInUser.pending, (state) => {
				state.isLoading = true
				state.isSuccess = false
				state.isError = false
				state.message = ''
			})
			.addCase(logInUser.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				state.isError = false
				state.userInfo = action.payload
				state.message = ''
				localStorage.setItem('userInfo', JSON.stringify(action.payload))
			})
			.addCase(logInUser.rejected, (state, action) => {
				state.isLoading = false
				state.isSuccess = false
				state.isError = true
				state.message = action.payload
				state.userInfo = null
				//state.product = []
			})
			//for register user
			.addCase(registerUser.pending, (state) => {
				state.isLoading = true
				state.isError = false
				state.isSuccess = false
				state.message = ''
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				state.isError = false
				state.userInfo = action.payload
				state.message = ''
				localStorage.setItem('userInfo', JSON.stringify(action.payload))
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.isLoading = false
				state.isSuccess = false
				state.isError = true
				state.message = action.payload
				//state.product = []
			})
	},
})

export const { reset, logout, setUserInfoName, setUserInfoMail } =
	userLogInDataSlice.actions
export default userLogInDataSlice.reducer
