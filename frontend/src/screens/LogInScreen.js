import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import { logInUser } from '../features/users/userLogInDataSlice'
import FormContainer from '../components/FormContainer'
import { Form, Button, Col, Row } from 'react-bootstrap'
import { toast } from 'react-toastify'

function LogInScreen() {
	const [searchParams] = useSearchParams()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const { userInfo, isError, isLoading, message } = useSelector(
		(state) => state.userLogInDetails
	)
	const redirect = searchParams.get('redirect')
		? searchParams.get('redirect')
		: ''
	console.log(redirect)
	useEffect(() => {
		if (userInfo) {
			navigate(`/${redirect}`)
		}
		if (isError) {
			toast.error(message)
		}
	}, [userInfo, navigate, isError, message])

	const submitHandler = (e) => {
		e.preventDefault()
		dispatch(logInUser({ email, password }))
		//dispatch login
	}

	return (
		<FormContainer>
			<h1>Sign In</h1>
			{isLoading && <Loader />}
			<Form onSubmit={submitHandler}>
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
				<Button className='my-3' type='submit' variant='primary'>
					Sign In
				</Button>
			</Form>
			<Row className='py-3'>
				<Col>
					New Customer?
					<Link to={'/register'}>Register</Link>
				</Col>
			</Row>
		</FormContainer>
	)
}

export default LogInScreen
