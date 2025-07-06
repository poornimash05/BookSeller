import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails } from '../actions/orderActions';
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstant';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderPay = useSelector((state) => state.orderPay);
  const { success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { success: successDeliver } = orderDeliver;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  
    // Only trigger if order is missing or orderId changed or pay/deliver status changed
    if (!order || order._id !== orderId || successPay || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId, order?._id, successPay, successDeliver, userInfo, navigate]);
  
  

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;

  // Helper to safely convert to number and fix decimals
  const toPrice = (num) => {
    const n = Number(num);
    return isNaN(n) ? '0.00' : n.toFixed(2);
  };

  const itemsPrice = toPrice(
    order.orderItems.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  );
  const shippingPrice = toPrice(order.shippingPrice);
  const taxPrice = toPrice(order.taxPrice);
  const discount = toPrice(order.discount);
  const totalPrice = toPrice(order.totalPrice);

  return (
    <>
      <h2>Order: {order._id}</h2>
      <Row>
        <Col md={8}>
          {/* Shipping */}
          <ListGroup variant="flush" className="mb-3">
            <ListGroup.Item>
              <h4>Shipping</h4>
              <p><strong>Name: </strong> {order.user.name}</p>
              <p><strong>Email: </strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            {/* Payment Method */}
            <ListGroup.Item>
              <h4>Payment Method</h4>
              <p><strong>Method: </strong>{order.paymentMethod}</p>
              {order.isPaid ? (
                <Message variant="success">Paid on {new Date(order.paidAt).toLocaleDateString()}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            {/* Order Items */}
            <ListGroup.Item>
              <h4>Order Items</h4>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => {
                    const price = Number(item.price);
                    return (
                      <ListGroup.Item key={item._id || index}>
                        <Row className="align-items-center">
                          <Col md={2}>
                            <Image src={item.image} alt={item.name} fluid rounded />
                          </Col>
                          <Col>
                            <Link to={`/product/${item.product}`} className="text-decoration-none">
                              {item.name}
                            </Link>
                          </Col>
                          <Col md={4}>
                            {item.qty} x ₹{isNaN(price) ? '0.00' : price.toFixed(2)} = ₹
                            {isNaN(price) ? '0.00' : (price * item.qty).toFixed(2)}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Order Summary */}
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h4>Order Summary</h4>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>₹{itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>₹{shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>₹{taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              {discount && Number(discount) > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Discount</Col>
                    <Col className="text-success">- ₹{discount}</Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Row>
                  <Col><strong>Total</strong></Col>
                  <Col><strong>₹{totalPrice}</strong></Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
