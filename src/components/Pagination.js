import React, { useState, useEffect } from 'react'

import { Link } from '@reach/router'

const Pagination = (props) => {
  const { getPage, storyCount, status } = props

  const [currNumber, setCurrNumber] = useState(1)

  const [pages, setPages] = useState()

  useEffect(() => {
    const resetPage = () => {
      setCurrNumber(1)
    }
    resetPage()
  }, [status])

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
        className='link link-default'
        onClick={() => {
          if (pages.find((page) => page === currNumber - 1)) {
            setCurrNumber((currNumber) => currNumber - 1)
            getPage(currNumber - 1)
          }
        }}
        to='/'
      >
        Prev
      </Link>

      {pages
        ? pages.map((ele, key) => {
            return (
              <Link
                className={`link ${
                  currNumber === ele
                    ? 'link-highlighted link-default'
                    : 'link-default'
                }`}
                onClick={() => {
                  setCurrNumber(ele)
                  getPage(ele)
                }}
                to='/'
                key={key}
              >
                {ele}
              </Link>
            )
          })
        : ''}
      <Link
        className='link link-default'
        onClick={() => {
          if (pages.find((page) => page === currNumber + 1)) {
            setCurrNumber((currNumber) => currNumber + 1)
            getPage(currNumber + 1)
          }
        }}
        to='/'
      >
        Next
      </Link>
    </div>
  )
}

export default Pagination
