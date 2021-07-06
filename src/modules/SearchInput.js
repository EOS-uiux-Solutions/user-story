import React, { useState, useRef } from 'react'
import Button from '../components/Button'
import Dropdown from '../components/Dropdown'
import UsersSuggestionDropdown from '../components/UsersSuggestionDropdown'

function SearchInput(props) {
  const {
    searchTerm,
    setSearchTerm,
    userTerm,
    setUserTerm,
    setSearchQuery,
    setAuthorQuery
  } = props

  const fieldToSearchDropdownContainer = useRef()

  const [fieldToSearch, setFieldToSearch] = useState('Title')

  const [usersSuggestionOpen, setUsersSuggestionOpen] = useState(false)

  const handleSearchSubmit = () => {
    if (fieldToSearch === 'Title' && searchTerm.length > 0) {
      setSearchQuery(`Title_contains: "${searchTerm}"`)
    } else if (userTerm.length > 0) {
      setAuthorQuery(userTerm)
      setUsersSuggestionOpen(false)
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
            setAuthorQuery={setAuthorQuery}
            setUsersSuggestionOpen={setUsersSuggestionOpen}
          />
        }
        <input
          type='text'
          name='search'
          placeholder='Search'
          autoComplete='off'
          value={fieldToSearch === 'Title' ? searchTerm : userTerm}
          onChange={(event) => {
            if (fieldToSearch === 'Title') {
              setSearchTerm(event.target.value)
            } else {
              setUserTerm(event.target.value)
              setUsersSuggestionOpen(true)
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSearchSubmit()
            }
          }}
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
        onClick={handleSearchSubmit}
      >
        Search
      </Button>
    </div>
  )
}

export default SearchInput
