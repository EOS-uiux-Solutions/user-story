import React, { useState } from 'react'

import Button from './Button'

const pages = [1, 2, 3, 4]

const Pagination = () => {
  const [currNumber, setCurrNumber] = useState(1)

  return (
    <div className='pagination-wrapper'>
      <div className='pagination-element'>
        <Button
          className='btn btn-default'
          onClick={() => {
            if (pages.find((page) => page === currNumber - 1))
              setCurrNumber((currNumber) => currNumber - 1)
          }}
        >
          Previous
        </Button>
      </div>
      {pages.map((ele, key) => {
        return (
          <div className='pagination-element' key={key}>
            <Button
              className={`btn ${currNumber === ele ? 'btn-highlighted' : ''}`}
              onClick={() => setCurrNumber(ele)}
            >
              {ele}
            </Button>
          </div>
        )
      })}
      <div className='pagination-element'>
        <Button
          className='btn btn-default'
          onClick={() => {
            if (pages.find((page) => page === currNumber + 1))
              setCurrNumber((currNumber) => currNumber + 1)
          }}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default Pagination
