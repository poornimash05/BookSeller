import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Container, Button } from 'react-bootstrap'
import Product from '../components/Product'
//import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProducts } from '../actions/productActions'
import './HomeScreen.css'

function HomeScreen() {
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSchool, setSelectedSchool] = useState('')
  const [selectedPrice, setSelectedPrice] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedType, setSelectedType] = useState('')

  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { products } = productList

  useEffect(() => {
    const priceFilter = minPrice || maxPrice ? 'range' : selectedPrice
    dispatch(
      listProducts(
        '',
        selectedClass,
        selectedSchool,
        priceFilter,
        minPrice,
        maxPrice,
        selectedCategory,
        selectedType
      )
    )
  }, [
    dispatch,
    selectedClass,
    selectedSchool,
    selectedPrice,
    minPrice,
    maxPrice,
    selectedCategory,
    selectedType
  ])

  const resetFilters = () => {
    setSelectedClass('')
    setSelectedSchool('')
    setSelectedPrice('')
    setMinPrice('')
    setMaxPrice('')
    setSelectedCategory('')
    setSelectedType('')
  }

  const books = products?.filter((product) => product.type === 'book')
  const stationery = products?.filter((product) => product.type === 'stationery')

  return (
    <Container fluid className="home-screen-container p-0">
      

      {/* Product Filters and Display */}
      <Row className="g-4">
        <Col xs={12} md={4} lg={3} className="filters-col">
          <div className="filter-bar p-4 shadow-lg rounded bg-white">
            <h4 className="mb-3 text-center">🎯 Filter Products</h4>

            {/* Filters */}
            <div className="filter-option mb-3">
              <label>Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="form-select"
              >
                <option value="">All</option>
                <option value="book">Books</option>
                <option value="stationery">Stationery</option>
              </select>
            </div>

            <div className="filter-option mb-3">
              <label>Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="form-select"
              >
                <option value="">All</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={`${i + 1}`}>
                    Class {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-option mb-3">
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

            <div className="filter-option mb-3">
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

            <Button variant="secondary" onClick={resetFilters} className="w-100 mt-3">
              Reset Filters
            </Button>
          </div>
        </Col>

        <Col xs={12} md={8} lg={9}>
          {/* Book Section */}
          {selectedType !== 'stationery' && (
            <>
              <h2 className="mb-4 text-center">📖 Books</h2>
              <Row className="g-4 mb-5">
                {books?.length > 0 ? (
                  books.map((product) => (
                    <Col key={product._id} sm={12} md={6} lg={4}>
                      <Product product={product} />
                    </Col>
                  ))
                ) : (
                  <Message variant="info">No books available</Message>
                )}
              </Row>
            </>
          )}

          {/* Stationery Section */}
          {selectedType !== 'book' && (
            <>
              <h2 className="mb-4 text-center">🖊️ Stationery</h2>
              <Row className="g-4">
                {stationery?.length > 0 ? (
                  stationery.map((product) => (
                    <Col key={product._id} sm={12} md={6} lg={4}>
                      <Product product={product} />
                    </Col>
                  ))
                ) : (
                  <Message variant="info">No stationery available</Message>
                )}
              </Row>
            </>
          )}
        </Col>
      </Row>
    </Container>
  )
}

export default HomeScreen
