// CartScreen.js
import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../actions/cartActions';
import { FaTrash } from 'react-icons/fa';

function CartScreen() {
  const { id: productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const qty = new URLSearchParams(location.search).get('qty')
    ? Number(new URLSearchParams(location.search).get('qty'))
    : 1;

  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const cartTotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate('/login?redirect=/shipping');
    } else {
      navigate('/shipping');
    }
  };

  return (
    <Row className="mt-4">
      <Col md={8}>
        <h2 className="mb-4">🛒 Your Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <Message variant="info">
            Your cart is empty.
            <Link to="/" className="btn btn-outline-primary btn-sm ms-2">
              Go Back
            </Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product} className="py-3">
                <Row className="align-items-center">
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`} className="text-decoration-none fw-semibold">
                      {item.name}
                    </Link>
                  </Col>
                  <Col md={2}>₹{item.price}</Col>
                  <Col md={3}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={1}>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>

      <Col md={4}>
        <Card className="shadow-sm">
          <ListGroup variant="flush">
            <ListGroup.Item className="py-3">
              <h5>
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)
              </h5>
              <h4 className="text-success">
                ₹{cartTotal.toFixed(2)}
              </h4>
            </ListGroup.Item>

            <ListGroup.Item className="py-3">
              <Button
                type="button"
                className="w-100 btn-success"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
}

export default CartScreen;
