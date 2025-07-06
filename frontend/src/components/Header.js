import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Form, FormControl, Button } from 'react-bootstrap';
import { logout } from '../actions/userActions';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { userInfo } = useSelector((state) => state.userLogin);

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login'); 
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?query=${encodeURIComponent(search)}`);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="text-white">
          📚 Vidhyarthi Shop
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="text-white">
              🏠 Home
            </Nav.Link>
            <Nav.Link as={Link} to="/cart" className="text-white">
              🛒 Cart
            </Nav.Link>

            {userInfo ? (
              <NavDropdown title={`👤 ${userInfo.name}`} id="user-dropdown" className="text-white">
                <NavDropdown.Item as={Link} to="/profile">
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login" className="text-white">
                👤 Login
              </Nav.Link>
            )}

            {/* Admin Dropdown */}
            {userInfo && userInfo.isAdmin && (
              <NavDropdown title="⚙️ Admin" id="admin-menu">
                <NavDropdown.Item as={Link} to="/admin/userlist">
                  Users
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/productlist">
                  Products
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/orderlist">
                  Orders
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/couponcreate">
                  Create Coupon
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>

          <Form className="d-flex" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Search books..."
              className="me-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit" variant="outline-light">
              Search
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
