import React, { useState, useEffect } from 'react'
import { navigate } from '@reach/router'
import { stringify } from 'query-string'

import Button from './Button'

const Dropdown = (props) => {
  const {
    title,
    reference,
    curr,
    setCurr,
    itemList,
    searchFilters,
    objKey
  } = props

  const [dropdownState, setDropdownState] = useState(false)

  const handleDropdownState = () => {
    setDropdownState(!dropdownState)
  }

  const handleSelection = (value) => {
    setCurr(value)
    setDropdownState(false)
    if (searchFilters) {
      searchFilters[objKey] = value
      if (searchFilters[objKey] === 'All') {
        delete searchFilters[objKey]
      }
      const queryString = stringify(searchFilters)
      if (queryString.length > 0) {
        navigate(`/?${stringify(searchFilters)}`)
      } else {
        navigate('/')
      }
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (reference.current && !reference.current.contains(event.target)) {
        setDropdownState(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [reference])

  return (
    <>
      <div className='filter-title'>{title}</div>
      <div className='dropdown-container' ref={reference}>
        <Button
          type='button'
          className='btn btn-transparent'
          onClick={handleDropdownState}
        >
          {dropdownState ? (
            <i className='eos-icons'>keyboard_arrow_up</i>
          ) : (
            <i className='eos-icons'>keyboard_arrow_down</i>
          )}
          &nbsp; {curr}
        </Button>
        <div
          className={`dropdown ${
            dropdownState
              ? 'dropdown-open dropdown-right'
              : 'dropdown-close dropdown-right'
          }`}
        >
          <ul className='dropdown-list'>
            {itemList.map((item, key) => (
              <li
                key={key}
                className='dropdown-element'
                onClick={() => handleSelection(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default Dropdown
