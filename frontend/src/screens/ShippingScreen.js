import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { useNavigate } from 'react-router-dom'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../actions/cartActions'
import { allowedCities } from '../utils/allowedLocations';

function ShippingScreen() {

    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [error, setError] = useState('');

    const submitHandler = (e) => {
        e.preventDefault();
        // Check if the selected city is allowed
        if (!allowedCities.includes(city)) {
            setError('Sorry, we do not deliver to this city.');
            return;
        }
        // Dispatch action to save shipping address if city is valid
        dispatch(saveShippingAddress({ address, city, postalCode }));
        navigate('/payment')

    }

    return (
      <FormContainer>
          <CheckoutSteps step1 step2 />
          <h1>Shipping</h1>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <Form onSubmit={submitHandler}>
              <Form.Group controlId='address'>
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                      required
                      type='text'
                      placeholder='Enter address'
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                  />
              </Form.Group>

              <Form.Group controlId='city'>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                      as="select"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                  >
                      <option value="">Select a City</option>
                      {allowedCities.map((cityName) => (
                          <option key={cityName} value={cityName}>
                              {cityName}
                          </option>
                      ))}
                  </Form.Control>
              </Form.Group>

              <Form.Group controlId='postalCode'>
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                      required
                      type='text'
                      placeholder='Enter postal code'
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                  />
              </Form.Group>

              <Button type='submit' variant='primary'>
                  Continue
              </Button>
          </Form>
      </FormContainer>
  )
}

export default ShippingScreen