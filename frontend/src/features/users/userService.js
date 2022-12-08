import axios from 'axios'

//service function to logIn
const login = async ({ email, password }, config) => {
	const response = await axios.post(
		`/api/users/login`,
		{ email, password },
		config
	)
	//console.log(response.data)
	return response.data
}

const register = async ({ name, email, password }, config) => {
	const response = await axios.post(
		'/api/users/',
		{ name, email, password },
		config
	)
	//console.log(response.data)
	return response.data
}

const getProfile = async (config) => {
	// console.log(`/api/users/profile`)

	const response = await axios.get(`/api/users/profile`, config)
	return response.data
}
const updateProfile = async ({ name, email, password }, config) => {
	const response = await axios.put(
		`/api/users/profile`,
		{ name, email, password },
		config
	)
	return response.data
}
const userService = {
	login,
	register,
	getProfile,
	updateProfile,
}
export default userService
