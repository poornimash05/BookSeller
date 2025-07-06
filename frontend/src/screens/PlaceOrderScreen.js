import React, { useEffect, useState } from 'react';
import { Button, Row, Col, ListGroup, Image, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';
import { ORDER_CREATE_RESET } from '../constants/orderConstant';
import axios from 'axios';
import { toast } from 'react-toastify';
import './PlaceOrderScreen.css' 

function PlaceOrderScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { order, error, success } = useSelector((state) => state.orderCreate);
  const cart = useSelector((state) => state.cart);

  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(null);

  const itemsPrice = Number(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)).toFixed(2);
  const shippingPrice = (itemsPrice > 100 ? 0 : 10).toFixed(2);
  const taxPrice = Number(0.082 * itemsPrice).toFixed(2);
  const totalBeforeDiscount = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

  const totalPrice = finalTotal !== null ? finalTotal : totalBeforeDiscount;

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, navigate]);

  useEffect(() => {
    if (success) {
      navigate(`/order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [success, order, navigate, dispatch]);

  useEffect(() => {
    axios
      .get('/api/coupons/active_coupons/')
      .then((res) => setCoupons(res.data))
      .catch(() => toast.error('Failed to load coupons'));
  }, []);

  const applyCoupon = async () => {
    try {
      const res = await axios.post('/api/coupons/apply_coupon/', {
        coupon_code: selectedCoupon,
        cart_total: totalBeforeDiscount,
      });
      const data = res.data;
      setDiscount(data.discount);
      setFinalTotal(data.new_total.toFixed(2));
      toast.success('Coupon Applied');
    } catch (error) {
      toast.error(error?.response?.data?.detail || 'Invalid or expired coupon');
    }
  };

  const placeOrder = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    );
  };

  return (
    <div className="place-order-screen">
      <CheckoutSteps step1 step2 step3 step4 />
      <Row className="mt-3">
        <Col md={8}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h4 className="mb-3">Shipping Information</h4>
              <p className="mb-1">
                <strong>Address: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </p>
            </Card.Body>
          </Card>
  
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h4 className="mb-3">Payment Method</h4>
              <p className="mb-1"><strong>Method: </strong>{cart.paymentMethod}</p>
            </Card.Body>
          </Card>
  
          <Card className="shadow-sm">
            <Card.Body>
              <h4 className="mb-3">Order Items</h4>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index} className="py-3">
                      <Row className="align-items-center">
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`} className="text-decoration-none">
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} × ₹{item.price} = <strong>₹{(item.qty * item.price).toFixed(2)}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
  
        <Col md={4}>
          <Card className="shadow sticky-top" style={{ top: '80px' }}>
            <Card.Body>
              <h4 className="mb-3">Order Summary</h4>
              <ListGroup variant="flush">
                <ListGroup.Item className="border-0">
                  <Row>
                    <Col>Items</Col>
                    <Col>₹{itemsPrice}</Col>
                  </Row>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>₹{shippingPrice}</Col>
                  </Row>
                  <Row>
                    <Col>Tax</Col>
                    <Col>₹{taxPrice}</Col>
                  </Row>
                  {discount > 0 && (
                    <Row className="text-success fw-bold">
                      <Col>Discount</Col>
                      <Col>- ₹{discount}</Col>
                    </Row>
                  )}
                  <hr />
                  <Row>
                    <Col><strong>Total</strong></Col>
                    <Col><strong>₹{totalPrice}</strong></Col>
                  </Row>
                </ListGroup.Item>
  
                <ListGroup.Item className="border-0">
                  <Form.Select
                    value={selectedCoupon}
                    onChange={(e) => setSelectedCoupon(e.target.value)}
                  >
                    <option value="">Select a Coupon</option>
                    {coupons.map((coupon) => (
                      <option key={coupon.code} value={coupon.code}>
                        {coupon.code} - {coupon.discount_type} {coupon.discount_value}
                      </option>
                    ))}
                  </Form.Select>
                  <Button
                    className="mt-2 w-100"
                    disabled={!selectedCoupon}
                    onClick={applyCoupon}
                    variant="outline-success"
                  >
                    Apply Coupon
                  </Button>
                </ListGroup.Item>
  
                {error && (
                  <ListGroup.Item>
                    <Message variant="danger">{error}</Message>
                  </ListGroup.Item>
                )}
  
                <ListGroup.Item className="border-0">
                  <Button
                    type="button"
                    className="btn btn-primary w-100"
                    disabled={cart.cartItems.length === 0}
                    onClick={placeOrder}
                  >
                    Place Order
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrderScreen;
