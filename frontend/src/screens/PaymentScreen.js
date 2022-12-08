import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, reset } from '../features/users/userLogInDataSlice'
import FormContainer from '../components/FormContainer'
import { toast } from 'react-toastify'
import { Button, Col, Form, FormGroup } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import {
	addShippingAddress,
	savePaymentMethod,
} from '../features/cart/cartDataSlice'
import CheckoutSteps from '../components/CheckoutSteps'

const PaymentScreen = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const shippingAddress = useSelector((state) => state.cart.shippingAddress)

	useEffect(() => {
		if (!shippingAddress) {
			navigate('/shipping')
		}
	}, [])
	const [paymentMethod, setPaymentMethod] = useState('PayPal')

	const submitHandler = (e) => {
		e.preventDefault()
		dispatch(savePaymentMethod(paymentMethod))
		navigate('/placeorder')
	}
	const handleOnChange = (e) => {
		setPaymentMethod(e.target.value)
	}
	return (
		<>
			<CheckoutSteps step1 step2></CheckoutSteps>
			<FormContainer>
				<h1>Payment Method</h1>
				<Form onSubmit={submitHandler}>
					<FormGroup>
						<Form.Label as='legend'>Select Method</Form.Label>
						<Col>
							<Form.Check
								type='radio'
								label='PayPal or Credit Card'
								id='PayPal'
								name='paymentMethod'
								value='PayPal'
								checked
								onChange={handleOnChange}
							></Form.Check>
							<Form.Check
								type='radio'
								label='Stripe'
								id='Stripe'
								name='paymentMethod'
								value='Stripe'
								onChange={handleOnChange}
							></Form.Check>
						</Col>
					</FormGroup>
					<Button type='submit' variant='primary'>
						Continue
					</Button>
				</Form>
			</FormContainer>
		</>
	)
}

export default PaymentScreen
