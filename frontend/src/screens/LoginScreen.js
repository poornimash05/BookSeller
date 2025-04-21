import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { login } from '../actions/userActions'
import { FaEnvelope, FaLock } from 'react-icons/fa'
import './LoginScreen.css' // 👈 add this

function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const redirect = new URLSearchParams(location.search).get('redirect') || '/'

  const userLogin = useSelector(state => state.userLogin)
  const { error, loading, userInfo } = userLogin

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  return (
    <Row className="justify-content-center mt-5">
      <Col xs={12} md={6} lg={5}>
        <Card className="p-4 shadow-lg rounded login-card">
          <h2 className="text-center mb-4">Welcome Back 👋</h2>
          {error && <Message variant="danger">{error}</Message>}
          {loading && <Loader />}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="email" className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <div className="input-icon">
                <FaEnvelope />
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ps-5"
                />
              </div>
            </Form.Group>

            <Form.Group controlId="password" className="mb-4">
              <Form.Label>Password</Form.Label>
              <div className="input-icon">
                <FaLock />
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ps-5"
                />
              </div>
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              Sign In
            </Button>
          </Form>

          <Row className="py-3">
            <Col className="text-center">
              Not Registered?{' '}
              <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                Create an account
              </Link>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default LoginScreen
