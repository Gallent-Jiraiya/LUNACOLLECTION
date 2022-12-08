import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import {
	getProfile,
	updateProfile,
	reset,
} from '../features/users/profileDataSlice'
import { Form, Button, Col, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'
import {
	setUserInfoName,
	setUserInfoMail,
} from '../features/users/userLogInDataSlice'

function ProfileScreen() {
	const [email, setEmail] = useState('')
	const [name, setName] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [passwordMessage, setPasswordMessage] = useState('')

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const { userInfo } = useSelector((state) => state.userLogInDetails)
	const { profileInfo, isError, isLoading, message, updateIsSuccess } =
		useSelector((state) => state.profileDetails)

	useEffect(() => {
		if (isError) {
			toast.error(message)
			dispatch(reset())
		}
		if (passwordMessage) {
			toast.error(passwordMessage)
			setPasswordMessage('')
			dispatch(reset())
		}
		if (updateIsSuccess) {
			toast.error('succesfully updated')
			dispatch(setUserInfoName(name))
			dispatch(setUserInfoMail(email))
			dispatch(reset())
		}

		if (!userInfo) {
			navigate('/login')
		} else {
			if (profileInfo === null || profileInfo.email !== userInfo.email) {
				//console.log(userInfo['token'])
				dispatch(getProfile({ token: userInfo['token'] }))
			} else {
				setName(profileInfo.name)
				setEmail(profileInfo.email)
			}
		}
	}, [
		userInfo,
		dispatch,
		navigate,
		profileInfo,
		updateIsSuccess,
		isError,
		passwordMessage,
	])

	const submitHandler = (e) => {
		e.preventDefault()
		if (password !== confirmPassword) {
			setPasswordMessage('Passwords do not match')
		} else {
			setPasswordMessage('')
			dispatch(
				updateProfile({ name, email, password, token: userInfo['token'] })
			)
		}
	}

	return (
		<Row>
			<Col md={3}>
				<h2>User Profile</h2>
				{isLoading && <Loader />}
				<Form onSubmit={submitHandler}>
					<Form.Group controlId='name'>
						<Form.Label>User Name</Form.Label>
						<Form.Control
							type='text'
							placeholder='Enter name'
							value={name}
							onChange={(e) => setName(e.target.value)}
						></Form.Control>
					</Form.Group>
					<Form.Group controlId='email'>
						<Form.Label>Email Address</Form.Label>
						<Form.Control
							type='email'
							placeholder='Enter email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						></Form.Control>
					</Form.Group>
					<Form.Group controlId='password'>
						<Form.Label>Password</Form.Label>
						<Form.Control
							type='password'
							placeholder='Enter password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						></Form.Control>
					</Form.Group>
					<Form.Group controlId='confirmPassword'>
						<Form.Label>Confirm Password</Form.Label>
						<Form.Control
							type='password'
							placeholder='Confirm password'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
						></Form.Control>
					</Form.Group>

					<Button className='my-3' type='submit' variant='primary'>
						Update
					</Button>
				</Form>
			</Col>
			<Col md={9}>
				<h2>My Orders</h2>
			</Col>
		</Row>
	)
}

export default ProfileScreen
