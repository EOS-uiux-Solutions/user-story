import React, { useState, useEffect } from 'react'

const Search = (props) => {
  const { listToBeSearched, title } = props
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    const updateSearchResults = () => {
      const toBeAppended = []
      if (title === '') {
        setSearchResults(toBeAppended)
        return
      }
      for (let i = 0; i < listToBeSearched.length; i++) {
        const txtVal = listToBeSearched[i].Title
        if (txtVal.toUpperCase().indexOf(title.toUpperCase()) > -1)
          toBeAppended.push({ id: listToBeSearched[i].id, Title: txtVal })
      }
      setSearchResults(toBeAppended)
    }
    updateSearchResults()
  }, [title, listToBeSearched])

  return (
    <div className='search-container'>
      <div className='search-dropdown'>
        <ul className='dropdown-list'>
          {searchResults.map((result, key) => {
            return (
              <li
                className='dropdown-element'
                onClick={() => window.open(`/story/${result.id}`, '_blank')}
                key={key}
              >
                {result.Title}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default Search
