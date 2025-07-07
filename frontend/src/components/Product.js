import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from './Rating'
import './ProductCard.css'

// ✅ Define your backend URL once
const BACKEND_URL = process.env.REACT_APP_API_BASE_URL || 'https://bookseller-c6sd.onrender.com'

function Product({ product }) {
  return (
    <Card className="my-3 p-3 rounded shadow-sm border-0 book-card h-100">
      <Link to={`/product/${product._id}`}>
       <Card.Img
         src={`${BACKEND_URL}/${product.image?.replace(/^\/?/, '')}`}
         onError={(e) => {
          e.target.onerror = null
          e.target.src = '/placeholder.png'
         }}
         variant="top"
         className="book-img"
         alt={product.name}
       />


      </Link>

      <Card.Body className="d-flex flex-column">
        <Link to={`/product/${product._id}`} className="text-decoration-none">
          <Card.Title as="h5" className="text-dark fw-semibold book-title">
            {product.name.length > 40 ? product.name.slice(0, 40) + '…' : product.name}
          </Card.Title>
        </Link>

        <Card.Text as="div" className="text-muted small">
          {product.category}
        </Card.Text>

        <Card.Text as="div" className="mt-auto">
          <strong>₹{product.price}</strong>
        </Card.Text>

        <Rating value={product.rating} text={`${product.numReviews} reviews`} />
      </Card.Body>
    </Card>
  )
}

export default Product
