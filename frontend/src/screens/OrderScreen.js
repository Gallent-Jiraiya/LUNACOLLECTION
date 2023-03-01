import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
	Col,
	Row,
	ListGroup,
	Image,
	ListGroupItem,
	Card,
	Button,
} from 'react-bootstrap'

import { Link } from 'react-router-dom'
import { resetOrderStatus } from '../features/order/orderDataSlice'
import {
	getOrderById,
	setOrderDelivered,
	setOrderShipped,
} from '../features/order/orderActions'
import Loader from '../components/Loader'
import Message from '../components/Message'

export const OrderScreen = () => {
	const dispatch = useDispatch()
	const { id: orderID } = useParams()
	const [orderDetails, setOrderDetails] = useState()
	const logedUser = useSelector((state) => state.logInDetails.userInfo)
	const { order, isError, isSuccess, isLoading, message, action } = useSelector(
		(state) => state.orders
	)
	var itemsPrice
	if (order) {
		itemsPrice = order.orderItems.reduce(
			(acc, item) => acc + item.price * item.qty,
			0
		)
	}

	useEffect(() => {
		dispatch(getOrderById(orderID))
	}, [])

	if (isSuccess) {
		setOrderDetails(order)
		dispatch(resetOrderStatus())
	}
	return isLoading ? (
		<Loader />
	) : isError ? (
		<Message variant='danger'>{message}</Message>
	) : !order ? (
		<Loader />
	) : (
		<>
			<h1>Order ID:{order._id}</h1>
			<Row>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Delivery</h2>
							<p>
								<strong>Name:</strong>
								{order.user.name}
							</p>
							<p>
								<strong>Email :</strong>
								<a href={`mailto:${order.user.email}`}>{order.user.email}</a>
							</p>
							<p>
								<strong>Address:</strong>
								{order.shippingAddress.address},{order.shippingAddress.city},
								{order.shippingAddress.postalCode}
							</p>
							<p>
								<strong>Order Shipped: </strong>
								{order.shipping.isShipped ? (
									<Message variant='success'>
										Shipped on {order.shipping.shippedAt}
									</Message>
								) : (
									<i className='fas fa-times' style={{ color: 'red' }}></i>
								)}
							</p>
							{order.delivery.isDelivered ? (
								<Message variant='success'>
									Delivered on {order.delivery.deliveredAt}
								</Message>
							) : (
								<Message variant='danger'>Not Delivered</Message>
							)}
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Payment Method</h2>
							<p>
								<strong>Method:</strong>
								{order.paymentMethod}
							</p>

							<Message variant='success'>
								Paid on {order.paymentResult.update_time.substring(0, 10)}
							</Message>
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Order Items</h2>

							{order.orderItems.length === 0 ? (
								toast.error('Order is Empty')
							) : (
								<ListGroup variant='flush'>
									{order.orderItems.map((item, index) => (
										<ListGroupItem key={index}>
											<Row>
												<Col md={1}>
													<Image
														src={item.image}
														alt={item.name}
														fluid
														rounded
													/>
												</Col>
												<Col>
													<Link to={`/product/${item.product}`}>
														{item.name}
													</Link>
												</Col>
												<Col md={4}>
													{item.qty} x RS.{item.price} = RS.
													{item.price * item.qty}
												</Col>
											</Row>
										</ListGroupItem>
									))}
								</ListGroup>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={4}>
					<Card>
						<ListGroup variant='flush'>
							<ListGroupItem>
								<h2>Order Summary</h2>
							</ListGroupItem>
							<ListGroupItem>
								<Row>
									<Col>Items</Col>
									<Col>RS.{itemsPrice}</Col>
								</Row>
							</ListGroupItem>
							<ListGroupItem>
								<Row>
									<Col>Shipping</Col>
									<Col>RS.{order.shippingPrice}</Col>
								</Row>
							</ListGroupItem>
							<ListGroupItem>
								<Row>
									<Col>Total</Col>
									<Col>RS.{order.totalPrice}</Col>
								</Row>
							</ListGroupItem>
							<ListGroupItem>
								<Row>
									<Button variant='primary'>DOWNLOAD INVOICE</Button>
								</Row>
							</ListGroupItem>
							{logedUser.isAdmin && !order.shipping.isShipped && (
								<ListGroupItem>
									<Row>
										<Button
											onClick={() => dispatch(setOrderShipped(order._id))}
											variant='primary'
										>
											Set as Shipped
										</Button>
									</Row>
								</ListGroupItem>
							)}
							{!logedUser.isAdmin &&
								order.shipping.isShipped &&
								!order.delivery.isDelivered && (
									<ListGroupItem>
										<Row>
											<Button
												onClick={() => dispatch(setOrderDelivered(order._id))}
												variant='primary'
											>
												Set as Delivered
											</Button>
										</Row>
									</ListGroupItem>
								)}
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	)
}
