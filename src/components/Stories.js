import React, { useState, useEffect, useCallback } from 'react'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'

import StoriesList from './StoriesList'
import Pagination from './Pagination'
import SearchBar from './SearchBar'
import ProductList from './ProductList'
import userStory from '../services/user_story'

const Stories = ({ authorId, followerId }) => {
  const [selectedStatuses, setSelectedStatuses] = useState([])

  const [page, setPage] = useState(1)

  const [sort, setSort] = useState('Most Voted')

  const [selectedCategories, setSelectedCategories] = useState([])

  const { promiseInProgress } = usePromiseTracker({ area: 'stories-div' })

  const [storyCount, setStoryCount] = useState()

  const [stories, setStories] = useState([])

  const [productQuery, setProductQuery] = useState(``)

  const [searchQuery, setSearchQuery] = useState('')

  const [authorQuery, setAuthorQuery] = useState('')

  const getPage = useCallback((page) => {
    setPage(page)
  }, [])

  useEffect(() => {
    const fetchStoryCount = async () => {
      const response = await userStory.getStoryCount(
        selectedStatuses,
        authorId,
        authorQuery,
        selectedCategories,
        productQuery,
        searchQuery,
        followerId
      )
      setStoryCount(response.data.data.userStoriesConnection.aggregate.count)
    }
    fetchStoryCount()
  }, [
    selectedStatuses,
    selectedCategories,
    productQuery,
    searchQuery,
    authorQuery,
    authorId,
    followerId
  ])

  useEffect(() => {
    const fetchStories = async () => {
      const response = await userStory.getStories(
        page,
        selectedStatuses,
        authorId,
        authorQuery,
        selectedCategories,
        productQuery,
        searchQuery,
        followerId
      )
      setStories(response.data.data.userStories)
    }
    trackPromise(fetchStories(), 'stories-div')
  }, [
    selectedCategories,
    selectedStatuses,
    page,
    productQuery,
    searchQuery,
    authorQuery,
    authorId,
    followerId
  ])

  useEffect(() => {
    const comparatorVotes = (a, b) => {
      return a.followers.length > b.followers.length ? -1 : 1
    }
    const comparatorComments = (a, b) => {
      return a.user_story_comments.length > b.user_story_comments.length
        ? -1
        : 1
    }

    const updateStories = async () => {
      if (sort === 'Most Voted') {
        setStories(stories.sort(comparatorVotes))
      }
      if (sort === 'Most Discussed') {
        setStories(stories.sort(comparatorComments))
      }
    }
    trackPromise(updateStories(), 'stories-div')
  }, [sort, stories, setStories])

  return (
    <div>
      <ProductList setProductQuery={setProductQuery} />

      <SearchBar
        sort={sort}
        setSort={setSort}
        setSearchQuery={setSearchQuery}
        setAuthorQuery={setAuthorQuery}
        setPage={setPage}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />

      <div className='stories-div'>
        <StoriesList stories={stories} isLoading={promiseInProgress} />
      </div>
      <Pagination
        getPage={getPage}
        storyCount={storyCount}
        status={selectedStatuses}
        productQuery={productQuery}
      />
    </div>
  )
}

export default Stories
