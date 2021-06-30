import React, { useState, useEffect } from 'react'
import { stringify } from 'query-string'

import { Link } from '@reach/router'

const Pagination = (props) => {
  const { getPage, storyCount, status, product, searchFilters } = props

  const queryString = stringify(searchFilters)

  const finalRoute = queryString.length > 0 ? `/?${queryString}` : '/'

  const [currNumber, setCurrNumber] = useState(1)

  const [pages, setPages] = useState()

  useEffect(() => {
    const resetPage = () => {
      setCurrNumber(1)
      getPage(1)
    }
    resetPage()
  }, [status, product, getPage])

  useEffect(() => {
    if (storyCount) {
      if (storyCount >= 5) {
        const n = Math.ceil(storyCount / 5)
        setPages([...Array(n + 1).keys()].slice(1))
      } else {
        setPages([1])
      }
    }
  }, [storyCount])

  return (
    <div className='pagination'>
      <Link
        className='btn btn-pagination'
        onClick={() => {
          if (pages.find((page) => page === currNumber - 1)) {
            setCurrNumber((currNumber) => currNumber - 1)
            getPage(currNumber - 1)
          }
        }}
        to={finalRoute}
      >
        <i className='eos-icons eos-18'>keyboard_arrow_left</i>
        {`Prev`}
      </Link>
      <div className='btn-pagination'>
        {pages
          ? pages.map((ele, key) => {
              return (
                <Link
                  className={`number ${currNumber === ele ? 'selected' : ''}`}
                  onClick={() => {
                    setCurrNumber(ele)
                    getPage(ele)
                  }}
                  to={finalRoute}
                  key={key}
                >
                  {ele}
                </Link>
              )
            })
          : ''}
      </div>
      <Link
        className='btn btn-pagination'
        onClick={() => {
          if (pages.find((page) => page === currNumber + 1)) {
            setCurrNumber((currNumber) => currNumber + 1)
            getPage(currNumber + 1)
          }
        }}
        to={finalRoute}
      >
        {`Next`}
        <i className='eos-icons eos-18'>keyboard_arrow_right</i>
      </Link>
    </div>
  )
}

export default Pagination
