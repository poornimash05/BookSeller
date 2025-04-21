import React from 'react'

const BookCard = ({ book }) => {
  return (
    <div className="card h-100 shadow-sm">
      <img src={book.image} className="card-img-top" alt={book.name} />
      <div className="card-body">
        <h5 className="card-title">{book.name}</h5>
        <p className="card-text text-muted">{book.author}</p>
        <p className="card-text fw-bold">₹{book.price}</p>
        <a href={`/book/${book._id}`} className="btn btn-primary w-100">View Details</a>
      </div>
    </div>
  )
}

export default BookCard
