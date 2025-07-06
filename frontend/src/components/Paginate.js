import React from 'react';
import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Paginate({ pages, page, keyword = '', isAdmin = false }) {
  if (keyword.includes('?keyword=')) {
    keyword = keyword.split('?keyword=')[1].split('&')[0];
  }

  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => {
          const pageNumber = x + 1;
          const link = !isAdmin
            ? `/?keyword=${keyword}&page=${pageNumber}`
            : `/admin/productlist/?keyword=${keyword}&page=${pageNumber}`;

          return (
            <Pagination.Item
              key={pageNumber}
              active={pageNumber === page}
              as={Link}
              to={link}
            >
              {pageNumber}
            </Pagination.Item>
          );
        })}
      </Pagination>
    )
  );
}

export default Paginate;
