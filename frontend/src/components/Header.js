import React from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/users/userLogInDataSlice'
import { resetWithProfile } from '../features/users/profileDataSlice'

const Header = () => {
	const dispatch = useDispatch()
	const userLogInDetails = useSelector((state) => state.userLogInDetails)
	const { userInfo } = userLogInDetails
	const logoutHandler = () => {
		dispatch(logout())
		dispatch(resetWithProfile())
	}
	return (
		<header>
			<Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
				<Container>
					<LinkContainer to='/'>
						<Navbar.Brand>Luna Collection</Navbar.Brand>
					</LinkContainer>
					<Navbar.Toggle aria-controls='basic-navbar-nav' className='ms-auto' />
					<Navbar.Collapse id='basic-navbar-nav'>
						<Nav className='ms-auto'>
							<LinkContainer to='/'>
								<Nav.Link>
									<i className='fas fa-house'></i>Home
								</Nav.Link>
							</LinkContainer>
							<LinkContainer to='/'>
								<Nav.Link>
									<i className='fas fa-shop'></i>Shop
								</Nav.Link>
							</LinkContainer>

							<LinkContainer to='/cart'>
								<Nav.Link>
									<i className='fas fa-shopping-cart'></i>Cart
								</Nav.Link>
							</LinkContainer>
							{userInfo ? (
								<NavDropdown title={userInfo.name} id='username'>
									<LinkContainer to='/profile'>
										<NavDropdown.Item>Profile</NavDropdown.Item>
									</LinkContainer>
									<NavDropdown.Item onClick={logoutHandler}>
										Logout
									</NavDropdown.Item>
								</NavDropdown>
							) : (
								<LinkContainer to='/login'>
									<Nav.Link>
										<i className='fas fa-user'></i>Sign In
									</Nav.Link>
								</LinkContainer>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</header>
	)
}

export default Header
