import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import { Form, Button, Col, Row, Table } from 'react-bootstrap'
import { toast } from 'react-toastify'
import {
	setUserInfoName,
	setUserInfoMail,
} from '../features/users/logInDataSlice'
import { resetProfileStatus } from '../features/users/profileDataSlice'
import { getProfile, updateProfile } from '../features/users/UserActions'
import { getMyOrders } from '../features/order/orderActions'
import { resetOrderStatus } from '../features/order/orderDataSlice'
import Message from '../components/Message'

function ProfileScreen() {
	const [email, setEmail] = useState('')
	const [name, setName] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [ordersList, setOrdersList] = useState([])

	const navigate = useNavigate()
	const dispatch = useDispatch()

	const { userInfo } = useSelector((state) => state.logInDetails)
	const ordersReduxState = useSelector((state) => state.orders)
	const profileDetails = useSelector((state) => state.profileDetails)

	useEffect(() => {
		if (!userInfo) {
			navigate('/login')
		}
		dispatch(getMyOrders())
		dispatch(getProfile())
	}, [dispatch, navigate, userInfo])

	if (profileDetails.profileInfo && email === '') {
		setEmail(profileDetails.profileInfo.email)
		setName(profileDetails.profileInfo.name)
	}
	if (
		ordersReduxState.orderList &&
		ordersReduxState.orderList.length > 0 &&
		ordersList.length === 0
	) {
		setOrdersList(ordersReduxState.orderList)
		dispatch(resetOrderStatus())
	}

	if (profileDetails.action === 'updateProfile' && profileDetails.isSuccess) {
		toast.success('succesfully updated')
		dispatch(setUserInfoName(name))
		dispatch(setUserInfoMail(email))
		dispatch(resetProfileStatus())
	}
	if (profileDetails.action === 'getProfile' && profileDetails.isSuccess) {
		setName(profileDetails.profileInfo.name)
		setEmail(profileDetails.profileInfo.email)
		dispatch(resetProfileStatus())
	}

	const submitHandler = (e) => {
		e.preventDefault()
		if (password !== confirmPassword) {
			toast.error('Passwords do not match')
		} else {
			dispatch(updateProfile({ name, email, password }))
		}
	}

	return (
		<Row>
			<Col md={3}>
				<h2>User Profile</h2>
				{profileDetails.isLoading && <Loader />}
				{profileDetails.isError && (
					<Message variant={'danger'}>{profileDetails.message}</Message>
				)}
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
				{ordersReduxState.isLoading &&
					ordersReduxState.action === 'getMyOrders' && <Loader />}
				{ordersReduxState.isError &&
					ordersReduxState.action === 'getMyOrders' && (
						<Message variant={'danger'}>{ordersReduxState.message}</Message>
					)}
				<Table striped bordered hover responsive className='table-sm'>
					<thead>
						<tr>
							<th>ID</th>
							<th>DATE</th>
							<th>TOTAL</th>
							<th>SHIPPED</th>
							<th>DELIVERED</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{ordersList.length === 0 && (
							<tr key={0}>
								<td colSpan={6} className='text-center'>
									O orders
								</td>
							</tr>
						)}
						{ordersList.length > 0 &&
							ordersList.map((order) => (
								<tr key={order._id}>
									<td>{order._id}</td>
									<td>{order.createdAt.substring(0, 10)}</td>
									<td>{order.totalPrice}</td>
									<td>
										{order.isShipped ? (
											order.shippedAt.substring(0, 10)
										) : (
											<i className='fas fa-times' style={{ color: 'red' }}></i>
										)}
									</td>
									<td>
										{order.isDelivered ? (
											order.deliveredAt.substring(0, 10)
										) : (
											<i className='fas fa-times' style={{ color: 'red' }}></i>
										)}
									</td>
									<td>
										<Button
											variant='light'
											className='btn-sm'
											onClick={() => navigate(`/orders/${order._id}`)}
										>
											Details
										</Button>
									</td>
								</tr>
							))}
					</tbody>
				</Table>
			</Col>
		</Row>
	)
}

export default ProfileScreen
