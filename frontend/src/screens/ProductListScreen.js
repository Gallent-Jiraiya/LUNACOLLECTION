import { useEffect } from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { deleteProduct, listProducts } from '../features/products/productAction'
import { resetProductListStatus } from '../features/products/productListDataSlice'

const ProductListScreen = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const allProductsReduxState = useSelector((state) => state.productList)
	const userInfo = useSelector((state) => state.logInDetails.userInfo)

	if (
		allProductsReduxState.action === 'deleteProduct' &&
		allProductsReduxState.isSuccess
	) {
		toast.success(allProductsReduxState.message)
		dispatch(listProducts())
		dispatch(resetProductListStatus())
	}
	if (
		allProductsReduxState.action === 'deleteProduct' &&
		allProductsReduxState.isError
	) {
		toast.error(allProductsReduxState.message)
		dispatch(resetProductListStatus())
	}
	useEffect(() => {
		if (userInfo && userInfo.isAdmin) {
			dispatch(listProducts())
		} else {
			navigate('/')
		}
	}, [dispatch, navigate, userInfo])
	const deleteHandler = (id) => {
		if (window.confirm('Are you sure ?')) {
			dispatch(deleteProduct(id))
		}
	}
	const AddProductHandler = () => {
		navigate('/admin/product')
	}
	return (
		<>
			<Row className='align-items-center'>
				<Col>
					<h1>Products</h1>
				</Col>
				<Col className='text-end'>
					<Button className='my-3 ' onClick={AddProductHandler}>
						<i className='fas fa-plus'></i>Add Product
					</Button>
				</Col>
			</Row>
			{allProductsReduxState.isLoading ? (
				<Loader />
			) : allProductsReduxState.isError ? (
				<Message variant={'danger'}>{allProductsReduxState.message}</Message>
			) : (
				<Table striped bordered hover responsive className='table-sm'>
					<thead>
						<tr>
							<th>ID</th>
							<th>NAME</th>
							<th>PRICE</th>
							<th>CATEGORY</th>
							<th>STOCK</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{allProductsReduxState.products ? (
							allProductsReduxState.products.map((product) => (
								<tr key={product._id}>
									<td>{product._id}</td>
									<td>{product.name}</td>
									<td>{product.price}</td>
									<td>{product.category.name}</td>
									<td>{product.countInStock}</td>
									<td>
										<Button
											variant='light'
											className='btn-sm'
											onClick={() => navigate(`/admin/product/${product._id}`)}
										>
											<i className='fas fa-edit'></i>
										</Button>
										<Button
											variant='danger'
											className='btn-sm'
											onClick={() => deleteHandler(product._id)}
										>
											<i className='fas fa-trash'></i>
										</Button>
									</td>
								</tr>
							))
						) : (
							<></>
						)}
					</tbody>
				</Table>
			)}
		</>
	)
}

export default ProductListScreen
