import React, { useState, useEffect } from 'react'

const Search = (props) => {
  const { listToBeSearched, title } = props
  const [searchResults, setSearchResults] = useState([])

  const strip = (html) => {
    return html.replace(/<\s*[^>]*>/gi, '')
  }

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
          toBeAppended.push({
            id: listToBeSearched[i].id,
            Title: txtVal,
            Description: listToBeSearched[i].Description,
            followers: listToBeSearched[i].followers
          })
      }
      setSearchResults(toBeAppended)
    }
    updateSearchResults()
  }, [title, listToBeSearched])

  return searchResults.length > 0 ? (
    <div className='flex flex-column title-search'>
      <h4>
        <i className='eos-icons'>arrow_forward</i> We found some matching
        results
      </h4>
      {searchResults.map((result, key) => {
        return (
          <div
            className='story title-search-results'
            onClick={() => window.open(`/story/${result.id}`, '_blank')}
            key={key}
          >
            <div className='stories-content title-search-result'>
              <h4>{result.Title}</h4>
              {strip(result.Description)}
            </div>
            <div className='icon-display'>
              {result.followers.length}
              <i className='eos-icons'>thumb_up</i>
            </div>
          </div>
        )
      })}
    </div>
  ) : (
    ''
  )
}

export default Search
