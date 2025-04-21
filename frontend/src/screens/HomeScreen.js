import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Container, Button } from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProducts } from '../actions/productActions'

function HomeScreen() {
  const [selectedClass, setSelectedClass] = useState('') // manage selected class
  const [selectedSchool, setSelectedSchool] = useState('') // manage selected school
  const [selectedPrice, setSelectedPrice] = useState('') // manage selected price range
  const [minPrice, setMinPrice] = useState('') // min price
  const [maxPrice, setMaxPrice] = useState('') // max price

  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList

  useEffect(() => {
    const priceFilter = minPrice || maxPrice ? 'range' : selectedPrice;
    // Dispatch listProducts action with the updated filters
    dispatch(listProducts('', selectedClass, selectedSchool, priceFilter, minPrice, maxPrice));
  }, [dispatch, selectedClass, selectedSchool, selectedPrice, minPrice, maxPrice]);

  // Reset filters
  const resetFilters = () => {
    setSelectedClass('');
    setSelectedSchool('');
    setSelectedPrice('');
    setMinPrice('');
    setMaxPrice('');
  };

  return (
    <Container style={{ paddingBottom: '70px' }}>
      <h1 className="text-center mb-4">📚 Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row className="g-4">
          <Col xs={12} md={4}  lg={2}>
            <div className="filter-bar">
              <h4>Filter Products</h4>

              {/* Class Filter */}
              <div className="filter-option">
                <label>Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="form-select"
                >
                  <option value="">All</option>
                  <option value="class 1">Class 1</option>
                  <option value="class 2">Class 2</option>
                  <option value="class 3">Class 3</option>
                  <option value="class 4">Class 4</option>
                  <option value="class 5">Class 5</option>
                  <option value="class 6">Class 6</option>
                  <option value="class 7">Class 7</option>
                  <option value="class 8">Class 8</option>
                  <option value="class 9">Class 9</option>
                  <option value="class 10">Class 10</option>
                  <option value="class 11">Class 11</option>
                  <option value="class 12">Class 12</option>
                </select>
              </div>

              {/* School Filter */}
              <div className="filter-option mt-3">
                <label>School</label>
                <select
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="form-select"
                >
                  <option value="">All</option>
                  <option value="Greenway">Greenway</option>
                  <option value="Silver Shine">Silver Shine</option>
                  <option value="Jkg">Jkg</option>
                </select>
              </div>

              {/* Price Sort Filter */}
              <div className="filter-option mt-3">
                <label>Price Sort</label>
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="form-select"
                >
                  <option value="">All</option>
                  <option value="low">Low - High</option>
                  <option value="high">High - Low</option>
                </select>
              </div>

              

              {/* Reset Filters Button */}
              <div className="filter-option mt-4">
                <Button variant="secondary" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </div>
          </Col>

          <Col xs={12} md={8}>
          <Row className="g-4">
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
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default HomeScreen
