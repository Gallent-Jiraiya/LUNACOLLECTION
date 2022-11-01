import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap'
import Rating from '../components/Rating'
import { listProductDetails } from '../actions/productActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
//import products from '../products'
// import axios from 'axios'

const ProductScreen = () => {
	const { id: proID } = useParams()
	const dispatch = useDispatch()
	//const [product, setProduct] = useState({})

	useEffect(() => {
		dispatch(listProductDetails(proID))
	}, [dispatch, proID])
	const productDetails = useSelector((state) => state.productDetails)
	const { loading, error, product } = productDetails
	return (
		<>
			<Link className='btn btn-light my-3' to='/'>
				Go Back
			</Link>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<Row>
					<Col sm={12} md={6}>
						<Image src={product.image} alt={product.name} fluid />
					</Col>
					<Col md={3} sm={12}>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h3>{product.name}</h3>
							</ListGroup.Item>
							<ListGroup.Item>
								<Rating
									value={product.rating}
									text={`${product.numReviews} reviews`}
								/>
							</ListGroup.Item>
							<ListGroup.Item>Price:${product.price}</ListGroup.Item>
							<ListGroup.Item>
								Description:${product.description}
							</ListGroup.Item>
						</ListGroup>
					</Col>
					<Col md={3}>
						<Card>
							<ListGroup variant='flush'>
								<ListGroup.Item>
									<Row>
										<Col>Price:</Col>
										<Col>
											<strong>${product.price}</strong>
										</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Row>
										<Col>Status:</Col>
										<Col>
											{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
										</Col>
									</Row>
								</ListGroup.Item>
								<ListGroup.Item>
									<Button
										className='btn-block w-100'
										type='button'
										disabled={product.countInStock === 0}
									>
										ADD TO CART
									</Button>
								</ListGroup.Item>
							</ListGroup>
						</Card>
					</Col>
				</Row>
			)}
		</>
	)
}

export default ProductScreen
