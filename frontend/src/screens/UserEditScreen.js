import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Form, Button, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import { getUserDetails, updateUser } from '../actions/userActions'
import { USER_UPDATE_RESET } from '../constants/userConstant'

function UserEditScreen() {
  const { id: userId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const userUpdate = useSelector((state) => state.userUpdate)
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  // Ref to track if user info has been loaded in form
  const hasLoadedUserData = useRef(false)

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login')
      return
    }
  
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET })
      navigate('/admin/userlist')
      return
    }
  
    // If user is not loaded yet or the id mismatches, fetch user details
    if (!user || user._id.toString() !== userId.toString()) {
      dispatch(getUserDetails(userId))
    } else {
      // Set form fields only once user data is loaded and matches
      setName(user.name)
      setEmail(user.email)
      setIsAdmin(user.isAdmin)
    }
  }, [dispatch, navigate, userId, user, successUpdate, userInfo])
  

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(updateUser({ _id: userId, name, email, isAdmin }))
  }

  return (
    <div className="container px-3 px-sm-5 mt-4">
      <Link
        to="/admin/userlist"
        className="btn btn-outline-secondary mb-4 fw-semibold"
      >
        <i className="fas fa-arrow-left me-2"></i> Back to User List
      </Link>

      <FormContainer>
        <Card
          className="p-4 shadow rounded border-0"
          style={{ background: '#f9f9f9' }}
        >
          <h2 className="text-center mb-4 text-primary fw-bold">Edit User</h2>

          {loadingUpdate && <Loader />}
          {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}

          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="name" className="mb-4">
                <Form.Label className="fw-semibold">Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ fontSize: '1rem', padding: '0.75rem' }}
                />
              </Form.Group>

              <Form.Group controlId="email" className="mb-4">
                <Form.Label className="fw-semibold">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ fontSize: '1rem', padding: '0.75rem' }}
                />
              </Form.Group>

              <Form.Group controlId="isadmin" className="mb-4">
                <Form.Check
                  type="switch"
                  id="admin-switch"
                  label="Grant Admin Access"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  style={{ fontSize: '1rem' }}
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="fw-semibold"
                >
                  <i className="fas fa-save me-2"></i> Update
                </Button>
              </div>
            </Form>
          )}
        </Card>
      </FormContainer>
    </div>
  )
}

export default UserEditScreen
