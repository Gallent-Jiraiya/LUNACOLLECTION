import { useEffect } from 'react'
import { Button, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { getAllUsers } from '../features/users/UserActions'

const UserListScreen = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const allUsersReduxState = useSelector((state) => state.allUsers)
	const userInfo = useSelector((state) => state.logInDetails.userInfo)
	useEffect(() => {
		if (userInfo && userInfo.isAdmin) {
			dispatch(getAllUsers())
		} else {
			navigate('/')
		}
	}, [dispatch, navigate, userInfo])
	const deleteHandler = () => {}
	return (
		<>
			<h1>Users</h1>
			{allUsersReduxState.isLoading ? (
				<Loader />
			) : allUsersReduxState.isError ? (
				<Message variant={'danger'}>{allUsersReduxState.message}</Message>
			) : (
				<Table striped bordered hover responsive className='table-sm'>
					<thead>
						<tr>
							<th>ID</th>
							<th>NAME</th>
							<th>EMAIL</th>
							<th>ADMIN</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{allUsersReduxState.usersList ? (
							allUsersReduxState.usersList.map((user) => (
								<tr key={user._id}>
									<td>{user._id}</td>
									<td>{user.name}</td>
									<td>
										<a href={`mailto:${user.email}`}>{user.email}</a>
									</td>
									<td>
										{user.isAdmin ? (
											<i
												className='fas fa-check'
												style={{ color: 'green' }}
											></i>
										) : (
											<i className='fas fa-times' style={{ color: 'red' }}></i>
										)}
									</td>
									<td>
										<Button
											variant='light'
											className='btn-sm'
											onClick={() => navigate(`/user/${user._id}/edit`)}
										>
											<i className='fas fa-edit'></i>
										</Button>
										<Button
											variant='danger'
											className='btn-sm'
											onClick={() => deleteHandler(user._id)}
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

export default UserListScreen
