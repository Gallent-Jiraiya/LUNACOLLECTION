import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { Row, Col } from 'react-bootstrap'
//import axios from 'axios'
import { listProducts ,reset} from '../features/products/productDataSlice'

const HomeScreen = () => {
	//const [products, setProducts] = useState([])
	const dispatch = useDispatch()
	
	const productList = useSelector((state) => state.productList)
	const { isLoading, isError, products,isSuccess,message } = productList
	
	useEffect(() => {
		// const fetchProducts = async () => {
		// 	//here this collects the whole response while adding {data} this directlyu accesses to the res.data method
		// 	//const res=await axios.get('/api/products')
		// 	//setProducts(res.data)
		// 	const { data } = await axios.get('/api/products')
		// 	setProducts(data)
		// }
		// fetchProducts()
		if(isError){
			toast.error(message)
		}
		if(products==[]){
			dispatch(listProducts)
		}
		if(isSuccess){
			console.log('productList is already loaded');
		}
		dispatch(reset)
	}, [dispatch])


	return (
		<>
			<h1>Latest Products</h1>
			{isLoading ? (
				<Loader />
			) : isError ? (
				<Message variant='danger'>{message}</Message>
			) : (
				<Row>
					{products.map((product) => (
						<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
							<Product product={product} />
						</Col>
					))}
				</Row>
			)
			}
		</>
	)
}

export default HomeScreen
