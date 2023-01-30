import React, { useState, useEffect } from 'react'
import {
  EOS_KEYBOARD_ARROW_LEFT,
  EOS_KEYBOARD_ARROW_RIGHT
} from 'eos-icons-react'

const Pagination = (props) => {
  const { page, getPage, storyCount, status, productQuery } = props

  const [currNumber, setCurrNumber] = useState(page)

  const [pages, setPages] = useState(null)

  useEffect(() => {
    const resetPage = () => {
      setCurrNumber(page)
      getPage(page)
    }
    resetPage()
  }, [page, status, productQuery, getPage])

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
    storyCount > 5 && (
      <div className='pagination'>
        <button
          className={`btn btn-pagination ${
            currNumber <= 1 ? 'btn-pagination-disabled' : ''
          }`}
          onClick={() => {
            if (pages.find((page) => page === currNumber - 1)) {
              setCurrNumber((currNumber) => currNumber - 1)
              getPage(currNumber - 1)
            }
          }}
          disabled={currNumber <= 1}
        >
          <EOS_KEYBOARD_ARROW_LEFT className='eos-icons eos-18' />
          {`Prev`}
        </button>
        <div className='btn btn-pagination'>
          {pages
            ? pages.map((ele, key) => {
                return (
                  <span
                    className={`number ${currNumber === ele ? 'selected' : ''}`}
                    onClick={() => {
                      setCurrNumber(ele)
                      getPage(ele)
                    }}
                    key={key}
                  >
                    {ele}
                  </span>
                )
              })
            : ''}
        </div>
        <button
          className={`btn btn-pagination ${
            currNumber >= pages?.length ? 'btn-pagination-disabled' : ''
          }`}
          onClick={() => {
            if (pages.find((page) => page === currNumber + 1)) {
              setCurrNumber((currNumber) => currNumber + 1)
              getPage(currNumber + 1)
            }
          }}
          disabled={currNumber >= pages?.length}
        >
          {`Next`}
          <EOS_KEYBOARD_ARROW_RIGHT className='eos-icons eos-18' />
        </button>
      </div>
    )
  )
}

export default Pagination
