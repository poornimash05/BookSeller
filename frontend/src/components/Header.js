import React, { useState }  from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Navbar, Nav, Form, FormControl, Button, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../actions/userActions';

function Header() {
  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  const logoutHandler = () => {
    dispatch(logout())
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

 return (
    <header>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Vidhyarthi Shop</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarNav" />
          <Navbar.Collapse id="navbarNav">
            <Nav className="mr-auto">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/cart" className="nav-link">Cart</Link>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                  <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Link to="/login" className="nav-link">Login</Link>
              )}
            </Nav>
            <Form className="d-flex ms-auto">
                <FormControl 
                  type="search" 
                  placeholder="Search for books..." 
                  className="me-2" 
                  value={searchQuery}
                  onChange={(e) => {
                    const value = e.target.value
                    setSearchQuery(value)
                    navigate(`/search?query=${encodeURIComponent(value)}`)
                  }}
                />
            </Form>

          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;