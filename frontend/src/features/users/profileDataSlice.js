import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from './userService'

const initialState = {
	profileInfo: null,
	isError: false,
	isSuccess: false,
	updateIsSuccess: false,
	isLoading: false,
	message: '',
}
//action functions
export const getProfile = createAsyncThunk(
	'users/getProfile',
	async ({ token }, thunkAPI) => {
		try {
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			}
			//console.log(token)
			const data = await userService.getProfile(config)
			//localStorage.setItem('userInfo', JSON.stringify(data))
			//console.log(data)
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
export const updateProfile = createAsyncThunk(
	'users/updateProfile',
	async ({ name, email, password, token }, thunkAPI) => {
		try {
			//console.log(token)
			const config = {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			}
			const data = await userService.updateProfile(
				{ name, email, password },
				config
			)
			localStorage.setItem('userInfo', JSON.stringify(data))
			//console.log(data)
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

export const profileDataSlice = createSlice({
	name: 'profileDetails',
	initialState,
	reducers: {
		reset: (state) => {
			state.isLoading = false
			state.isError = false
			state.isSuccess = false
			state.updateIsSuccess = false
			state.message = ''
		},
		resetWithProfile: (state) => {
			state.isLoading = false
			state.profileInfo = null
			state.isError = false
			state.isSuccess = false
			state.updateIsSuccess = false
			state.message = ''
		},
	},
	extraReducers: (builder) => {
		builder
			//for logIn User
			.addCase(getProfile.pending, (state) => {
				state.isLoading = true
				state.isError = false
				state.isSuccess = false
				state.message = ''
			})
			.addCase(getProfile.fulfilled, (state, action) => {
				state.isLoading = false
				state.isError = false
				state.isSuccess = true
				state.profileInfo = action.payload
				state.message = ''
			})
			.addCase(getProfile.rejected, (state, action) => {
				state.isLoading = false
				state.isSuccess = false
				state.profileInfo = null
				state.isError = true
				state.message = action.payload
			})
			.addCase(updateProfile.pending, (state) => {
				state.isLoading = true
				state.isError = false
				state.isSuccess = false
				state.message = ''
			})
			.addCase(updateProfile.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = false
				state.updateIsSuccess = true
				state.profileInfo = action.payload
				state.message = ''
			})
			.addCase(updateProfile.rejected, (state, action) => {
				state.isLoading = false
				state.isSuccess = false
				state.updateIsSuccess = false
				state.isError = true
				state.message = action.payload
			})
	},
})

export const { reset, resetWithProfile } = profileDataSlice.actions
export default profileDataSlice.reducer
