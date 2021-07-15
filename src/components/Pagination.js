import React, { useState, useEffect } from 'react'

const Pagination = (props) => {
  const { getPage, storyCount, status, product } = props

  const [currNumber, setCurrNumber] = useState(1)

  const [pages, setPages] = useState(null)

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
      <span
        className={`btn btn-pagination ${
          currNumber <= 1 ? 'btn-pagination-disabled' : ''
        }`}
        onClick={() => {
          if (pages.find((page) => page === currNumber - 1)) {
            setCurrNumber((currNumber) => currNumber - 1)
            getPage(currNumber - 1)
          }
        }}
      >
        <i className='eos-icons eos-18'>keyboard_arrow_left</i>
        {`Prev`}
      </span>
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
      <span
        className={`btn btn-pagination ${
          currNumber >= pages?.length ? 'btn-pagination-disabled' : ''
        }`}
        onClick={() => {
          if (pages.find((page) => page === currNumber + 1)) {
            setCurrNumber((currNumber) => currNumber + 1)
            getPage(currNumber + 1)
          }
        }}
      >
        {`Next`}
        <i className='eos-icons eos-18'>keyboard_arrow_right</i>
      </span>
    </div>
  )
}

export default Pagination
