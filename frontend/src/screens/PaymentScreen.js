import React, { useState, useEffect } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'

function PaymentScreen() {
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const dispatch = useDispatch()
    const navigate = useNavigate() // ✅ instead of history

    const [paymentMethod, setPaymentMethod] = useState('PayPal')

    useEffect(() => {
        if (!shippingAddress?.address) {
            navigate('/shipping') // ✅ redirect if no shipping
        }
    }, [shippingAddress, navigate])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder') // ✅ instead of history.push
    }

    return (
        <div className="payment-screen">
          <CheckoutSteps step1 step2 step3 />
          <FormContainer>
            <div className="p-4 shadow rounded bg-white mt-4">
              <h2 className="mb-4 text-center">Choose Payment Method</h2>
              <Form onSubmit={submitHandler}>
                <Form.Group className="mb-4">
                  <Form.Label as="legend" className="fw-semibold mb-3">
                    Payment Options
                  </Form.Label>
                  <Col>
                    <Form.Check
                      type="radio"
                      label={
                        <>
                          <i className="fab fa-paypal me-2 text-primary"></i>
                          PayPal or Credit Card
                        </>
                      }
                      id="paypal"
                      name="paymentMethod"
                      value="PayPal"
                      checked={paymentMethod === 'PayPal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    {/* Add more methods below if needed */}
                    {/* Example for Razorpay */}
                    {/* <Form.Check
                      className="mt-3"
                      type="radio"
                      label="Razorpay"
                      id="razorpay"
                      name="paymentMethod"
                      value="Razorpay"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    /> */}
                  </Col>
                </Form.Group>
      
                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 fw-bold py-2"
                >
                  Continue to Place Order
                </Button>
              </Form>
            </div>
          </FormContainer>
        </div>
      );
      
}

export default PaymentScreen
