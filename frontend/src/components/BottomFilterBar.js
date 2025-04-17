import React from 'react'
import './BottomFilterBar.css'
import { FaFilter } from 'react-icons/fa'

const BottomFilterBar = ({ selectedClass, onChange }) => {
  return (
    <div className="bottom-filter-bar">
      <FaFilter className="filter-icon" />
      <select value={selectedClass} onChange={(e) => onChange(e.target.value)}>
        <option value=''>All Classes</option>
        <option value='Class 1'>Class 1</option>
        <option value='Class 2'>Class 2</option>
        <option value='Class 3'>Class 3</option>
        <option value='Class 4'>Class 4</option>
        <option value='Class 5'>Class 5</option>
        <option value='Class 6'>Class 6</option>
        <option value='Class 7'>Class 7</option>
        <option value='Class 8'>Class 8</option>
        <option value='Class 9'>Class 9</option>
        <option value='Class 10'>Class 10</option>
      </select>
    </div>
  )
}

export default BottomFilterBar
