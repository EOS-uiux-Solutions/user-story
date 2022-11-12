import React, { useState } from 'react'
import Button from '../components/Button'
import UsersSuggestionDropdown from '../components/UsersSuggestionDropdown'
import { EOS_CLOSE, EOS_SEARCH } from 'eos-icons-react'

function SearchInput(props) {
  const {
    searchTerm,
    setSearchTerm,
    userTerm,
    setUserTerm,
    setSearchQuery,
    setAuthorQuery
  } = props

  const [usersSuggestionOpen, setUsersSuggestionOpen] = useState(true)
  const [searchUser, setSearchUser] = useState('')

  const handleSearchSubmit = () => {
    if (userTerm.length > 0) setAuthorQuery(searchTerm)
    else setSearchQuery(`Title_contains: "${searchTerm}"`)
    setUsersSuggestionOpen(false)
  }

  return (
    <div className='flex flex-row search-controls'>
      <div className='flex flex-row search-input' data-cy='search-input-div'>
        {
          <UsersSuggestionDropdown
            isOpen={usersSuggestionOpen}
            userTerm={searchUser}
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
          data-cy='search-input'
          value={userTerm.length > 0 ? userTerm : searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value)
            setSearchUser(event.target.value)
            setUsersSuggestionOpen(true)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSearchSubmit()
            }
          }}
          onFocus={() => {
            if (searchTerm.length > 0) {
              setUsersSuggestionOpen(true)
            }
          }}
        />
        <div className='close-btn-div'>
          <span
            className='close-btn'
            data-cy='btn-clear'
            onClick={() => {
              setSearchTerm('')
              setSearchUser('')
              setUserTerm('')
            }}
          >
            {searchTerm.length > 0 && <EOS_CLOSE className='eos-icons' />}
          </span>
        </div>
      </div>
      <Button
        type='submit'
        className='btn btn-default btn-search'
        data-cy='btn-search'
        onClick={handleSearchSubmit}
      >
        <EOS_SEARCH className='eos-icons' color='white' />
      </Button>
    </div>
  )
}

export default SearchInput
