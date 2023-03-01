import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { Row, Col } from 'react-bootstrap'
import { listProducts } from '../features/products/productAction'
import { useParams } from 'react-router-dom'
import Paginate from '../components/Paginate'
//import axios from 'axios'

const HomeScreen = () => {
	//const [products, setProducts] = useState([])
	const dispatch = useDispatch()
	const { keyword, pageNumber } = useParams()
	const productList = useSelector((state) => state.productList)
	const { isLoading, isError, products, isSuccess, message } = productList
	useEffect(() => {
		dispatch(listProducts({ keyword, pageNumber }))
	}, [keyword, pageNumber])

	return (
		<>
			<h1>Latest Products</h1>
			{isLoading ? (
				<Loader />
			) : isError ? (
				<Message variant='danger'>{message}</Message>
			) : (
				<>
					<Row>
						{products &&
							products.products &&
							products.products.map((product) => (
								<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
									<Product product={product} />
								</Col>
							))}
					</Row>
					{products && (
						<Paginate
							pages={products.pages}
							page={products.page}
							keyword={keyword ? keyword : ''}
						/>
					)}
				</>
			)}
		</>
	)
}

export default HomeScreen
