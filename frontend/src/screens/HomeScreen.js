import React, { useEffect, useState } from 'react' // ✅ add useState
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProducts } from '../actions/productActions'
import BottomFilterBar from '../components/BottomFilterBar' // ✅ import it

function HomeScreen() {
  const [selectedClass, setSelectedClass] = useState('') // ✅ manage selected class
  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList

  useEffect(() => {
    dispatch(listProducts('', selectedClass)) // ✅ update when class changes
  }, [dispatch, selectedClass])

  return (
    <div style={{ paddingBottom: '70px' }}> {/* ✅ leave space for bottom bar */}
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))
            ) : (
              <Message variant="info">No products available</Message>
            )}
          </Row>
        </>
      )}

      {/* ✅ Always show filter bar, even if error */}
      <BottomFilterBar selectedClass={selectedClass} onChange={setSelectedClass} />
    </div>
  )
}

export default HomeScreen
