import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getUser, updateUser } from '../features/users/UserActions'
import Message from '../components/Message'

function UserEditScreen() {
	const { id: userId } = useParams()
	const [email, setEmail] = useState('')
	const [name, setName] = useState('')
	const [isAdmin, setIsAdmin] = useState(false)

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const usersReduxState = useSelector((state) => state.users)
	const logInReduxUserInfo = useSelector((state) => state.logInDetails.userInfo)

	useEffect(() => {
		if (logInReduxUserInfo && logInReduxUserInfo.isAdmin) {
			if (
				!usersReduxState.userInfo ||
				(usersReduxState.userInfo && usersReduxState.userInfo._id !== userId)
			) {
				dispatch(getUser(userId))
			} else {
				setName(usersReduxState.userInfo.name)
				setEmail(usersReduxState.userInfo.email)
				setIsAdmin(usersReduxState.userInfo.isAdmin)
			}
		} else {
			navigate('/')
		}
	}, [dispatch, logInReduxUserInfo, navigate, userId, usersReduxState.userInfo])
	const submitHandler = (e) => {
		e.preventDefault()
		dispatch(updateUser({ id: userId, object: { name, email, isAdmin } }))
	}

	return (
		<>
			<Button
				variant='light'
				className='btn-sm'
				onClick={() => navigate('/admin/userlist')}
			>
				Go Back
			</Button>
			<FormContainer>
				<h1>Edit User</h1>
				{usersReduxState.action === 'getUser' && usersReduxState.isLoading ? (
					<Loader />
				) : usersReduxState.action === 'getUser' && usersReduxState.isError ? (
					<Message variant={'danger'}>{usersReduxState.message}</Message>
				) : (
					<>
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
							<Form.Group controlId='idAdmin'>
								<Form.Check
									type='checkbox'
									label='isAdmin'
									checked={isAdmin}
									onChange={(e) => setIsAdmin(e.target.checked)}
								></Form.Check>
							</Form.Group>
							{usersReduxState.action === 'updateUser' &&
								usersReduxState.isSuccess && (
									<Message variant={'success'}>
										User Successfully updated
									</Message>
								)}
							{usersReduxState.action === 'updateUser' &&
								usersReduxState.isError && (
									<Message variant={'danger'}>
										{usersReduxState.message}
									</Message>
								)}
							<Button
								className='my-3'
								type='submit'
								variant='primary'
								onClick={() => submitHandler}
								disabled={
									usersReduxState.action === 'updateUser' &&
									usersReduxState.isLoading
								}
							>
								Update
							</Button>
						</Form>
					</>
				)}
			</FormContainer>
		</>
	)
}

export default UserEditScreen
