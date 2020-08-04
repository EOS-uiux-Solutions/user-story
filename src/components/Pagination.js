import React, { useState } from 'react'

import { Link } from '@reach/router'

const pages = [1, 2, 3, 4]

const Pagination = () => {
  const [currNumber, setCurrNumber] = useState(1)

  return (
    <div className='pagination'>
      <Link
        className='link link-default'
        onClick={() => {
          if (pages.find((page) => page === currNumber - 1))
            setCurrNumber((currNumber) => currNumber - 1)
        }}
        to='#'
      >
        Prev
      </Link>

      {pages.map((ele, key) => {
        return (
          <Link
            className={`link ${
              currNumber === ele
                ? 'link-highlighted link-default'
                : 'link-default'
            }`}
            onClick={() => setCurrNumber(ele)}
            to='#'
          >
            {ele}
          </Link>
        )
      })}
      <Link
        className='link link-default'
        onClick={() => {
          if (pages.find((page) => page === currNumber + 1))
            setCurrNumber((currNumber) => currNumber + 1)
        }}
        to='#'
      >
        Next
      </Link>
    </div>
  )
}

export default Pagination
