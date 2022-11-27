import React, { useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import { addToCart } from '../features/cart/cartDataSlice'
function CartScreen() {
	const { id: proID } = useParams()
	const [searchParams] = useSearchParams()
	const qty = searchParams.get('qty')
	console.log(proID)
	console.log(qty)
  const ob={id:proID,qty:qty}
	const dispatch = useDispatch()

	useEffect(() => {
		if (proID) {
			dispatch(addToCart(ob))
		}
	}, [dispatch, proID, qty])

	return <></>
}

export default CartScreen
