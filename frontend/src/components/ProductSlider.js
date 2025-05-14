import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import Product from './Product'
import { Link } from 'react-router-dom'

const ProductSlider = ({ title, products, isHomePage }) => {
  const isBooksOrStationery = title === 'Books' || title === 'Stationery'

  // Pagination state for HomeScreen
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 5
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)

  // Pagination handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const settings = {
    dots: true,
    infinite: isBooksOrStationery ? true : false, // Infinite for books/stationery
    speed: 500,
    slidesToShow: isBooksOrStationery ? 5 : 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: isBooksOrStationery ? 5 : 3 } },
      { breakpoint: 768, settings: { slidesToShow: isBooksOrStationery ? 5 : 2 } },
      { breakpoint: 480, settings: { slidesToShow: isBooksOrStationery ? 5 : 1 } }
    ]
  }
  
  return (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>{title}</h3>
        {/* Show "View All" button only if it's not Books or Stationery */}
        {!isBooksOrStationery && (
          <Link to={`/products/${title.toLowerCase().replace(/\s/g, '-')}`} className="btn btn-outline-primary btn-sm">
            View All
          </Link>
        )}
      </div>
      
      {isHomePage && isBooksOrStationery ? (
        <div>
          <div className="row">
            {currentProducts.map((product) => (
              <div key={product._id} className="col-12 col-md-4">
                <Product product={product} />
              </div>
            ))}
          </div>

          {/* Pagination for HomeScreen */}
          {products.length > productsPerPage && (
            <div className="d-flex justify-content-center mt-3">
              <ul className="pagination">
                {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, index) => (
                  <li
                    key={index + 1}
                    className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => paginate(index + 1)}
                  >
                    <span className="page-link">{index + 1}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <Slider {...settings}>
          {products.map((product) => (
            <div key={product._id} className="p-2">
              <Product product={product} />
            </div>
          ))}
        </Slider>
      )}
    </div>
  )
}

export default ProductSlider
