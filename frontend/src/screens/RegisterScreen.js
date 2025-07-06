import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Form, Button, Row, Col, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { register } from '../actions/userActions'
import { FaUser, FaEnvelope, FaLock, FaCheckCircle } from 'react-icons/fa'
import './RegisterScreen.css' // 👈 Add this CSS

function RegisterScreen() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const redirect = new URLSearchParams(location.search).get('redirect') || '/'

  const userRegister = useSelector(state => state.userRegister)
  const { error, loading, userInfo } = userRegister

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      dispatch(register(name, email, password))
    }
  }

  return (
    <Row className="justify-content-center mt-5">
      <Col xs={12} md={7} lg={6}>
        <Card className="p-4 shadow-lg rounded register-card">
          <h2 className="text-center mb-4">Create Your Account 🚀</h2>
          {message && <Message variant="danger">{message}</Message>}
          {error && <Message variant="danger">{error}</Message>}
          {loading && <Loader />}
          <Form onSubmit={submitHandler}>

            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Name</Form.Label>
              <div className="input-icon">
                <FaUser />
                <Form.Control
                  required
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="ps-5"
                />
              </div>
            </Form.Group>

            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <div className="input-icon">
                <FaEnvelope />
                <Form.Control
                  required
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ps-5"
                />
              </div>
            </Form.Group>

            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Password</Form.Label>
              <div className="input-icon">
                <FaLock />
                <Form.Control
                  required
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ps-5"
                />
              </div>
            </Form.Group>

            <Form.Group controlId="confirmPassword" className="mb-4">
              <Form.Label>Confirm Password</Form.Label>
              <div className="input-icon">
                <FaCheckCircle />
                <Form.Control
                  required
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="ps-5"
                />
              </div>
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              Register
            </Button>
          </Form>

          <Row className="py-3">
            <Col className="text-center">
              Already have an account?{' '}
              <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
                Sign In
              </Link>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default RegisterScreen
