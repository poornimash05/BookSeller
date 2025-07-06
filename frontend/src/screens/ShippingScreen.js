import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../actions/cartActions'
import { saveUserAddress } from '../actions/userActions' // import new action
import { stateCityMap } from '../utils/allowedLocations'
import { motion } from 'framer-motion'

function ShippingScreen() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Get saved addresses from user state
  // Change this line:
  const savedAddresses = useSelector((state) => state.userLogin?.savedAddresses) || []


  // Form state
  const [selectedSavedAddressIndex, setSelectedSavedAddressIndex] = useState(-1)
  const [selectedState, setSelectedState] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [pincode, setPincode] = useState('')
  const [houseInfo, setHouseInfo] = useState('')
  const [saveAddress, setSaveAddress] = useState(false)
  const [error, setError] = useState('')

  // Fill form when a saved address is selected
  useEffect(() => {
    if (selectedSavedAddressIndex >= 0) {
      const addr = savedAddresses[selectedSavedAddressIndex]
      setSelectedState(addr.state)
      setSelectedCity(addr.city)
      setPincode(addr.postalCode)
      setHouseInfo(addr.address)
      setSaveAddress(false)
      setError('')
    } else {
      setSelectedState('')
      setSelectedCity('')
      setPincode('')
      setHouseInfo('')
      setSaveAddress(false)
      setError('')
    }
  }, [selectedSavedAddressIndex, savedAddresses])

  const submitHandler = (e) => {
    e.preventDefault()

    // Validate pincode with state-city map
    const allowed = stateCityMap[selectedState]?.[selectedCity]?.includes(pincode)
    if (!allowed) {
      setError('Sorry, we do not deliver to this pincode in the selected city.')
      return
    }

    const addressToSave = {
      address: houseInfo,
      city: selectedCity,
      state: selectedState,
      postalCode: pincode,
    }

    if (saveAddress) {
      dispatch(saveUserAddress(addressToSave))
    }

    dispatch(saveShippingAddress(addressToSave))
    navigate('/payment')
  }

  return (
    <FormContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CheckoutSteps step1 step2 />
        <h2 className='text-center mb-4'>📦 Shipping Details</h2>

        {error && <div className='alert alert-danger'>{error}</div>}

        <Form.Group className='mb-4'>
          <Form.Label>Use saved address</Form.Label>
          <Form.Control
            as='select'
            value={selectedSavedAddressIndex}
            onChange={(e) => setSelectedSavedAddressIndex(Number(e.target.value))}
          >
            <option value={-1}>-- Add New Address --</option>
            {savedAddresses.map((addr, idx) => (
              <option key={idx} value={idx}>
                {addr.address}, {addr.city}, {addr.state} - {addr.postalCode}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form onSubmit={submitHandler} className='shipping-form'>
          <Form.Group controlId='house' className='mb-3'>
            <Form.Label>
              <i className='bi bi-house-door-fill me-2' />
              House No. / Landmark
            </Form.Label>
            <Form.Control
              type='text'
              placeholder='E.g., 221B Baker Street'
              value={houseInfo}
              onChange={(e) => setHouseInfo(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId='state' className='mb-3'>
            <Form.Label>
              <i className='bi bi-geo-alt-fill me-2' />
              State
            </Form.Label>
            <Form.Control
              as='select'
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value)
                setSelectedCity('')
                setPincode('')
                setError('')
              }}
              required
            >
              <option value=''>-- Select State --</option>
              {Object.keys(stateCityMap).map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId='city' className='mb-3'>
            <Form.Label>
              <i className='bi bi-building me-2' />
              City
            </Form.Label>
            <Form.Control
              as='select'
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value)
                setPincode('')
                setError('')
              }}
              disabled={!selectedState}
              required
            >
              <option value=''>-- Select City --</option>
              {selectedState &&
                Object.keys(stateCityMap[selectedState]).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId='pincode' className='mb-3'>
            <Form.Label>
              <i className='bi bi-mailbox me-2' />
              Pincode
            </Form.Label>
            <Form.Control
              as='select'
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              disabled={!selectedCity}
              required
            >
              <option value=''>-- Select Pincode --</option>
              {(stateCityMap[selectedState]?.[selectedCity] || []).map((pin) => (
                <option key={pin} value={pin}>
                  {pin}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId='saveAddress' className='mb-3'>
            <Form.Check
              type='checkbox'
              label='Save this address for future use'
              checked={saveAddress}
              onChange={(e) => setSaveAddress(e.target.checked)}
              disabled={selectedSavedAddressIndex >= 0}
            />
          </Form.Group>

          <div className='text-center'>
            <Button type='submit' variant='primary' className='px-5 py-2'>
              Continue <i className='bi bi-arrow-right ms-2'></i>
            </Button>
          </div>
        </Form>
      </motion.div>
    </FormContainer>
  )
}

export default ShippingScreen
