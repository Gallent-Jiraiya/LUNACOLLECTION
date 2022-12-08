import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import {
	Button,
	Col,
	Row,
	ListGroup,
	Image,
	Cart,
	ListGroupItem,
	Card,
} from 'react-bootstrap'
import { Link } from 'react-router-dom'

import {
	addShippingAddress,
	savePaymentMethod,
	setPrices,
} from '../features/cart/cartDataSlice'

import { reset, createOrder } from '../features/order/orderDataSlice'

import CheckoutSteps from '../components/CheckoutSteps'
export const PlaceOrderScreen = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { token } = useSelector((state) => state.userLogInDetails.userInfo)

	const { orderList, isError, isSuccess, isLoading, message, lastOrderID } =
		useSelector((state) => state.orders)

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
		if (isSuccess) {
			navigate(`/orders/${lastOrderID}`)
			dispatch(reset())
		}
		if (isError) {
			toast.error(message)
			dispatch(reset())
		}
	}, [isSuccess, isError, message])

	const placeOrderHandler = (e) => {
		e.preventDefault()
		dispatch(setPrices({ totalPrice, shippingPrice, itemsPrice }))
		dispatch(
			createOrder({
				orderItems: cartItems,
				shippingAddress,
				paymentMethod,
				shippingPrice,
				totalPrice,
				token,
			})
		)
	}
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
									onClick={placeOrderHandler}
								>
									Place Order
								</Button>
							</ListGroupItem>
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	)
}
