import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProducts } from '../actions/productActions'
import BottomFilterBar from '../components/BottomFilterBar';
function useQuery() {
  return new URLSearchParams(useLocation().search)
}

function SearchScreen() {
  const query = useQuery()
  const keyword = query.get('query') || ''

  const dispatch = useDispatch()
  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList

  const [showNoResults, setShowNoResults] = useState(false)

  useEffect(() => {
    dispatch(listProducts(keyword))

    // Delay "No results found" message by 500ms
    const timer = setTimeout(() => {
      setShowNoResults(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [dispatch, keyword])

 
    return (
      <>
        <h2>Search Results for "{keyword}"</h2>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : products.length === 0 && showNoResults ? (
          <Message>No products found</Message>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}
        <BottomFilterBar />
      </>
    );

}

export default SearchScreen
