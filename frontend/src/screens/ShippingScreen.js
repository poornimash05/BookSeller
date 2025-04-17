import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../actions/cartActions'
import { stateCityMap } from '../utils/allowedLocations'
function ShippingScreen() {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart
  

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [pincode, setPincode] = useState('')
  const [houseInfo, setHouseInfo] = useState('')
  const [error, setError] = useState('')

  const submitHandler = (e) => {
    e.preventDefault()

    const allowed = stateCityMap[selectedState]?.[selectedCity]?.includes(pincode)
    if (!allowed) {
      setError('Sorry, we do not deliver to this pincode in the selected city.')
      return
    }

    dispatch(
      saveShippingAddress({
        address: houseInfo,
        city: selectedCity,
        state: selectedState,
        postalCode: pincode,
      })
    )
    navigate('/payment')
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <Form onSubmit={submitHandler}>

      <Form.Group controlId='house'>
          <Form.Label>House No. / Landmark</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter your house no. or landmark'
            value={houseInfo}
            onChange={(e) => setHouseInfo(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId='state'>
          <Form.Label>State</Form.Label>
          <Form.Control
            as='select'
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value)
              setSelectedCity('')
              setPincode('')
              setError('')
            }}
          >
            <option value=''>Select State</option>
            {Object.keys(stateCityMap).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId='city'>
          <Form.Label>City</Form.Label>
          <Form.Control
            as='select'
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value)
              setPincode('')
              setError('')
            }}
            disabled={!selectedState}
          >
            <option value=''>Select City</option>
            {selectedState &&
              Object.keys(stateCityMap[selectedState]).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId='pincode'>
          <Form.Label>Pincode</Form.Label>
          <Form.Control
            as='select'
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            disabled={!selectedCity}
          >
            <option value=''>Select Pincode</option>
            {(stateCityMap[selectedState]?.[selectedCity] || []).map((pin) => (
              <option key={pin} value={pin}>
                {pin}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        

        <Button type='submit' variant='primary' className='mt-3'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen
