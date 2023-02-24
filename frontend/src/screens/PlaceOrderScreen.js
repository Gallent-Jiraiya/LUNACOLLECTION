import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
	Button,
	Col,
	Row,
	ListGroup,
	Image,
	ListGroupItem,
	Card,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'
// import payhere from '../payhere'
// import payhere from 'https://www.payhere.lk/lib/payhere.js'
import { setPrices } from '../features/cart/cartDataSlice'

import { resetOrderStatus } from '../features/order/orderDataSlice'

import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../features/order/orderActions'
import axios from 'axios'
export const PlaceOrderScreen = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [sdkReady, setSdkReady] = useState(false)

	const { isError, isSuccess, message, order, action } = useSelector(
		(state) => state.orders
	)
	const cart = useSelector((state) => state.cart)
	const { cartItems, shippingAddress, paymentMethod } = cart

	//Calculate Prizes
	const itemsPrice = cart.cartItems.reduce(
		(acc, item) => acc + item.price * item.qty,
		0
	)
	const shippingPrice = 10
	const totalPrice = itemsPrice + shippingPrice

	useEffect(() => {
		// if (!sdkReady) {
		// 	addPayHereScript()
		// }
		if (action === 'createOrder' && isSuccess) {
			navigate(`/orders/${order._id}`)
			dispatch(resetOrderStatus())
		}
		if (action === 'createOrder' && isError) {
			toast.error(message)
			dispatch(resetOrderStatus())
		}
	}, [isSuccess, isError, message, action, navigate, order, dispatch, sdkReady])

	const placeOrderHandler = (e) => {
		e.preventDefault()
		dispatch(setPrices({ totalPrice, shippingPrice, itemsPrice }))
		console.log(cartItems)
		dispatch(
			createOrder({
				orderItems: cartItems,
				shippingAddress,
				paymentMethod,
				shippingPrice,
				totalPrice,
			})
		)
	}
	// // console.log(window.payhere)
	// window.payhere.onCompleted = (orderId) => {
	// 	console.log('Payment completed. OrderID:' + orderId)
	// 	alert('New Payhere payment: OrderID: ' + orderId)
	// 	//Note: validate the payment and show success or failure page to the customer
	// }

	// // Called when user closes the payment without completing
	// window.payhere.onDismissed = () => {
	// 	//Note: Prompt user to pay again or show an error page
	// 	console.log('Payment dismissed')
	// }

	// // Called when error happens when initializing payment such as invalid parameters
	// window.payhere.onError = (error) => {
	// 	// Note: show an error page
	// 	console.log('Error:' + error)
	// }
	return (
		<>
			<CheckoutSteps step1 step2 step3 />
			<Row>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Address:</strong>
								{cart.shippingAddress.address},{cart.shippingAddress.city},
								{cart.shippingAddress.postalCode}
							</p>
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Payment Method</h2>

							<strong>Method:</strong>
							{cart.paymentMethod}
						</ListGroup.Item>
						<ListGroup.Item>
							<h2>Order Items</h2>

							{cart.cartItems.length === 0 ? (
								toast.error('Your Cart is Empty')
							) : (
								<ListGroup variant='flush'>
									{cart.cartItems.map((item, index) => (
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
													{item.qty} x ${item.price} = ${item.price * item.qty}
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
									<Col>${itemsPrice}</Col>
								</Row>
							</ListGroupItem>
							<ListGroupItem>
								<Row>
									<Col>Shipping</Col>
									<Col>${shippingPrice}</Col>
								</Row>
							</ListGroupItem>
							<ListGroupItem>
								<Row>
									<Col>Total</Col>
									<Col>${totalPrice}</Col>
								</Row>
							</ListGroupItem>
							<ListGroupItem>
								<Button
									type='button'
									className='btn-block'
									disabled={cart.cartItems === 0}
									onClick={async () => {
										await axios
											.get('/api/config/payhere', {
												order_id: 'xxx',
												amount: 500,
												currency: 'LKR',
											})
											.then(({ data }) => {
												console.log(data)
												var payment = {
													sandbox: true,
													merchant_id: data.merchantID, // Replace your Merchant ID
													return_url: undefined, // Important
													cancel_url: undefined, // Important
													// notify_url: 'http://sample.com/notify',
													order_id: 'ItemNo12345',
													// items: 'Door bell wireles',
													amount: totalPrice,
													currency: 'LKR',
													hash: data.hash, // *Replace with generated hash retrieved from backend
													first_name: 'Saman',
													last_name: 'Perera',
													email: 'samanp@gmail.com',
													phone: '0771234567',
													address: 'No.1, Galle Road',
													city: 'Colombo',
													country: 'Sri Lanka',
													delivery_address:
														'No. 46, Galle road, Kalutara South',
													delivery_city: 'Kalutara',
													delivery_country: 'Sri Lanka',
													custom_1: '',
													custom_2: '',
												}
												// window.payhere.startPayment(payment)
												// payhere.startPayment(payment)
											})
									}}
								>
									Pay Now
								</Button>
								{/* <Button
									type='button'
									className='btn-block'
									disabled={cart.cartItems === 0}
									onClick={placeOrderHandler}
								>
									Place Order
								</Button> */}
							</ListGroupItem>
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	)
}
