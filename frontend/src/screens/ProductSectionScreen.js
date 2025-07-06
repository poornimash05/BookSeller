import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { Row, Col, Container } from 'react-bootstrap'

const ProductSectionScreen = () => {
  const { section } = useParams()
  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList

  useEffect(() => {
    let typeFilter = ''
    if (section === 'latest') typeFilter = 'latest'
    else if (section === 'books') typeFilter = 'book'
    else if (section === 'stationery') typeFilter = 'stationery'

    dispatch(listProducts('', '', '', '', '', '', typeFilter, ''))
  }, [dispatch, section])

  // Load up to 10 products for "View All"
  const productsToShow = products.slice(0, 10)

  return (
    <Container>
      <h2 className="mb-4 text-capitalize">{section.replace('-', ' ')}</h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          {productsToShow.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}

export default ProductSectionScreen
