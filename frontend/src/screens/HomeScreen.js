import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
//import products from '../products'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { Row, Col } from 'react-bootstrap'
//import axios from 'axios'
import { listProducts } from '../actions/productActions'

const HomeScreen = () => {
	//const [products, setProducts] = useState([])
	const dispatch = useDispatch()
	useEffect(() => {
		// const fetchProducts = async () => {
		// 	//here this collects the whole response while adding {data} this directlyu accesses to the res.data method
		// 	//const res=await axios.get('/api/products')
		// 	//setProducts(res.data)
		// 	const { data } = await axios.get('/api/products')
		// 	setProducts(data)
		// }
		// fetchProducts()
		dispatch(listProducts())
	}, [dispatch])

	const productList = useSelector((state) => state.productList)
	const { loading, error, products } = productList

	return (
		<>
			<h1>Latest Products</h1>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<Row>
					{products.map((product) => (
						<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
							<Product product={product} />
						</Col>
					))}
				</Row>
			)}
		</>
	)
}

export default HomeScreen
