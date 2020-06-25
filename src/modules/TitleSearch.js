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
        const txtVal = listToBeSearched[i]
        if (txtVal.toUpperCase().indexOf(title.toUpperCase()) > -1)
          toBeAppended.push(txtVal)
      }
      setSearchResults(toBeAppended)
    }
    updateSearchResults()
  }, [title, listToBeSearched])

  return (
    <div className='search-container'>
      <div className='search-dropdown'>
        <ul>
          {searchResults.map((result, key) => {
            return <li key={key}>{result}</li>
          })}
        </ul>
      </div>
    </div>
  )
}

export default Search
