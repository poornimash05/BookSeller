import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Button, Card, Form } from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProductDetails, createProductReview } from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstant'
import './ProductScreen.css'

function ProductScreen() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const dispatch = useDispatch()

    const productDetails = useSelector((state) => state.productDetails)
    const { loading, error, product } = productDetails

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const productReviewCreate = useSelector((state) => state.productReviewCreate)
    const {
        loading: loadingProductReview,
        error: errorProductReview,
        success: successProductReview,
    } = productReviewCreate

    useEffect(() => {
        if (successProductReview) {
            setRating(0)
            setComment('')
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
        }

        dispatch(listProductDetails(id))
    }, [dispatch, id, successProductReview])

    const addToCartHandler = () => {
        navigate(`/cart/${id}?qty=${qty}`)
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview(id, {
            rating,
            comment,
        }))
    }

    return (
        <div className="py-3">
            <Link to="/" className="btn btn-outline-secondary mb-4 shadow-sm rounded-pill px-4 py-2">
                ← Go Back
            </Link>

            {loading ? (
                <Loader />
            ) : error ? (
                <Message variant='danger'>{error}</Message>
            ) : (
                <div className="container">
                    <Row className="mb-4">
                        <Col md={6} className="mb-3">
                            <Card className="shadow-sm p-3 border-0 rounded">
                                <Image src={product.image} alt={product.name} fluid className="rounded" />
                            </Card>
                        </Col>

                        <Col md={3} className="mb-3">
                            <ListGroup variant="flush">
                                <ListGroup.Item className="border-0">
                                    <h3 className="fw-bold">{product.name}</h3>
                                </ListGroup.Item>

                                <ListGroup.Item className="border-0">
                                    <Rating value={product.rating} text={`${product.numReviews} reviews`} color={'#f8e825'} />
                                </ListGroup.Item>

                                <ListGroup.Item className="border-0">
                                    <strong>Price:</strong> ₹{product.price}
                                </ListGroup.Item>

                                <ListGroup.Item className="border-0">
                                    <strong>Description:</strong> {product.description}
                                </ListGroup.Item>

                                <ListGroup.Item className="border-0 text-muted">
                                    <i className="bi bi-tag"></i> {product.category}
                                </ListGroup.Item>

                                {/* Reviews Section */}
                                <ListGroup.Item className="border-0">
                                    <div className="mt-4">
                                        <h5 className="fw-bold mb-3 border-bottom pb-2">Customer Reviews</h5>

                                        {product.reviews.length === 0 ? (
                                            <Message variant='info'>No Reviews</Message>
                                        ) : (
                                            <div className="scrollable-reviews" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                                {product.reviews.map((review) => (
                                                    <Card key={review._id} className="mb-3 p-3 shadow-sm border-0 rounded-4">
                                                        <strong className="text-primary">{review.name}</strong>
                                                        <Rating value={review.rating} color='#f8e825' />
                                                        <small className="text-muted">{review.createdAt.substring(0, 10)}</small>
                                                        <p className="mt-2">{review.comment}</p>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-4">
                                            <h6 className="fw-semibold mb-3">Write a Review</h6>

                                            {loadingProductReview && <Loader />}
                                            {successProductReview && <Message variant='success'>Review Submitted</Message>}
                                            {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}

                                            {userInfo ? (
                                                <Form onSubmit={submitHandler}>
                                                    <Form.Group controlId='rating' className="mb-3">
                                                        <Form.Label className="fw-semibold">Rating</Form.Label>
                                                        <Form.Select
                                                            value={rating}
                                                            onChange={(e) => setRating(e.target.value)}
                                                            className="rounded"
                                                        >
                                                            <option value=''>Select...</option>
                                                            <option value='1'>1 - Poor</option>
                                                            <option value='2'>2 - Fair</option>
                                                            <option value='3'>3 - Good</option>
                                                            <option value='4'>4 - Very Good</option>
                                                            <option value='5'>5 - Excellent</option>
                                                        </Form.Select>
                                                    </Form.Group>

                                                    <Form.Group controlId='comment' className="mb-3">
                                                        <Form.Label className="fw-semibold">Review</Form.Label>
                                                        <Form.Control
                                                            as='textarea'
                                                            rows={3}
                                                            value={comment}
                                                            onChange={(e) => setComment(e.target.value)}
                                                            className="rounded"
                                                        />
                                                    </Form.Group>

                                                    <Button
                                                        disabled={loadingProductReview}
                                                        type='submit'
                                                        variant='success'
                                                        className="rounded-pill px-4"
                                                    >
                                                        Submit
                                                    </Button>
                                                </Form>
                                            ) : (
                                                <Message variant='info'>
                                                    Please <Link to='/login'>login</Link> to write a review
                                                </Message>
                                            )}
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>

                        <Col md={3}>
                            <Card className="shadow rounded">
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Price:</Col>
                                            <Col><strong>₹{product.price}</strong></Col>
                                        </Row>
                                    </ListGroup.Item>

                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Status:</Col>
                                            <Col>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</Col>
                                        </Row>
                                    </ListGroup.Item>

                                    {product.countInStock > 0 && (
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Qty</Col>
                                                <Col xs='auto'>
                                                    <Form.Select
                                                        value={qty}
                                                        onChange={(e) => setQty(e.target.value)}
                                                        className="rounded"
                                                    >
                                                        {[...Array(product.countInStock).keys()].map((x) => (
                                                            <option key={x + 1} value={x + 1}>
                                                                {x + 1}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    )}

                                    <ListGroup.Item>
                                        <Button
                                            onClick={addToCartHandler}
                                            className='btn-block w-100 rounded-pill fw-semibold'
                                            disabled={product.countInStock === 0}
                                            type='button'
                                            variant='primary'
                                        >
                                            Add to Cart
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )}
        </div>
    )
}

export default ProductScreen
