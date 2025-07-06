import React, { useState } from 'react'
import { Form, Button, Card } from 'react-bootstrap'
import axios from 'axios'
import { toast } from 'react-toastify'

function CouponCreateScreen() {
  const [code, setCode] = useState('')
  const [discountType, setDiscountType] = useState('percentage')
  const [discountValue, setDiscountValue] = useState('')
  const [active, setActive] = useState(true)
  const [validFrom, setValidFrom] = useState('')
  const [validUntil, setValidUntil] = useState('')
  const [loading, setLoading] = useState(false)

  const formatWithSeconds = (dateTime) => {
    // Append ':00' if not already there (ensures seconds are present)
    return dateTime.length === 16 ? `${dateTime}:00` : dateTime
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
  
    try {
      const payload = {
        code,
        discount_type: discountType,
        discount_value: Number(discountValue),
        is_active: active,
        valid_from: formatWithSeconds(validFrom),
        valid_until: formatWithSeconds(validUntil),
      }
  
      // Get token from localStorage's userInfo
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      const token = userInfo?.token
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
  
      const { data } = await axios.post('/api/coupons/create_coupon/', payload, config)
  
      toast.success('Coupon created successfully!')
      // Reset form
      setCode('')
      setDiscountType('percentage')
      setDiscountValue('')
      setActive(true)
      setValidFrom('')
      setValidUntil('')
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create coupon')
    }
  
    setLoading(false)
  }
  
  

  return (
    <Card className="p-4 shadow">
      <h2>Create Coupon</h2>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="code" className="mb-3">
          <Form.Label>Coupon Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter coupon code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            required
          />
        </Form.Group>

        <Form.Group controlId="discountType" className="mb-3">
          <Form.Label>Discount Type</Form.Label>
          <Form.Select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Amount (₹)</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="discountValue" className="mb-3">
          <Form.Label>Discount Value</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter discount value"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            min="1"
            required
          />
        </Form.Group>

        <Form.Group controlId="validFrom" className="mb-3">
          <Form.Label>Valid From</Form.Label>
          <Form.Control
            type="datetime-local"
            value={validFrom}
            onChange={(e) => setValidFrom(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="validUntil" className="mb-3">
          <Form.Label>Valid Until</Form.Label>
          <Form.Control
            type="datetime-local"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="active" className="mb-3">
          <Form.Check
            type="checkbox"
            label="Active"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Coupon'}
        </Button>
      </Form>
    </Card>
  )
}

export default CouponCreateScreen
