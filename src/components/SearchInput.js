import React, { useState, useRef } from 'react'

import Button from './Button'
import Dropdown from './Dropdown'
import UsersSuggestionDropdown from './UsersSuggestionDropdown'

const SearchInput = (props) => {
  const {
    searchTerm,
    setSearchTerm,
    userTerm,
    setUserTerm,
    setSearchQuery,
    setUserQuery
  } = props

  const [fieldToSearch, setFieldToSearch] = useState('Title')

  const fieldToSearchDropdownContainer = useRef()

  const [usersSuggestionOpen, setUsersSuggestionOpen] = useState(false)

  const handleSearchInputChange = (event) => {
    if (fieldToSearch === 'Title') {
      setSearchTerm(event.target.value)
    } else {
      setUserTerm(event.target.value)
      setUsersSuggestionOpen(true)
    }
  }

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (fieldToSearch === 'Title' && searchTerm.length > 0) {
        setSearchQuery(`Title_contains: "${searchTerm}"`)
      } else if (userTerm.length > 0) {
        setUserQuery(userTerm)
        setUsersSuggestionOpen(false)
      }
    }
  }

  return (
    <div className='flex flex-row search-controls'>
      <div className='flex flex-row search-input'>
        <span>
          <i className='eos-icons'>search</i>
        </span>
        {
          <UsersSuggestionDropdown
            isOpen={usersSuggestionOpen}
            userTerm={userTerm}
            setUserTerm={setUserTerm}
            setUserQuery={setUserQuery}
            setUsersSuggestionOpen={setUsersSuggestionOpen}
          />
        }
        <input
          type='text'
          name='search'
          placeholder='Search'
          autoComplete='off'
          value={fieldToSearch === 'Title' ? searchTerm : userTerm}
          onChange={handleSearchInputChange}
          onKeyDown={handleSearchKeyDown}
          onFocus={() => {
            if (fieldToSearch === 'Author' && userTerm.length > 0) {
              setUsersSuggestionOpen(true)
            }
          }}
        />
        <div className='close-btn-div'>
          <span
            className='close-btn'
            onClick={() => {
              if (fieldToSearch === 'Title' && searchTerm.length > 0) {
                setSearchTerm('')
              } else if (userTerm.length > 0) {
                setUserTerm('')
              }
            }}
          >
            {((fieldToSearch === 'Title' && searchTerm.length > 0) ||
              (fieldToSearch === 'Author' && userTerm.length > 0)) && (
              <i className='eos-icons'>close</i>
            )}
          </span>
        </div>
        <Dropdown
          title=''
          reference={fieldToSearchDropdownContainer}
          curr={fieldToSearch}
          setCurr={setFieldToSearch}
          itemList={['Title', 'Author']}
        />
      </div>
      <Button
        type='submit'
        className='btn btn-default'
        onClick={() => {
          if (fieldToSearch === 'Title' && searchTerm.length > 0) {
            setSearchQuery(`Title_contains: "${searchTerm}"`)
          } else if (userTerm.length > 0) {
            setUserQuery(userTerm)
          }
        }}
      >
        Search
      </Button>
    </div>
  )
}

export default SearchInput
