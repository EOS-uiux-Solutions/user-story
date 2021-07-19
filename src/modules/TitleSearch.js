import React, { useState, useEffect, useRef } from 'react'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import axios from 'axios'
import LoadingIndicator from './LoadingIndicator'

import userStory from '../services/user_story'

const Search = (props) => {
  const { title } = props

  const [searchResults, setSearchResults] = useState([])

  const { promiseInProgress } = usePromiseTracker({
    area: 'stories-list'
  })

  const cancelToken = useRef()

  const strip = (html) => {
    return html.replace(/<\s*[^>]*>/gi, '')
  }

  useEffect(() => {
    if (typeof cancelToken.current !== typeof undefined) {
      cancelToken.current.cancel()
    }
    cancelToken.current = axios.CancelToken.source()

    const fetchStoriesByTitle = async () => {
      const response = await userStory.getStoriesByTitle(
        title,
        cancelToken.current.token
      )
      setSearchResults(response.data.data.userStories)
    }
    if (title === '') {
      setSearchResults([])
    } else {
      trackPromise(fetchStoriesByTitle(), 'stories-list')
    }
  }, [title])

  if (title === '') {
    return ''
  }
  if (promiseInProgress) {
    return (
      <div className='stories-list'>
        <div className='flex flex-center'>
          <LoadingIndicator />
        </div>
      </div>
    )
  }
  return (
    <div className='stories-list'>
      <div className='flex flex-column title-search'>
        <h4>
          <i className='eos-icons'>arrow_forward</i>
          {searchResults.length > 0
            ? ' We found some matching results'
            : ' No matching stories found. Go ahead and create one.'}
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
    </div>
  )
}

export default Search
