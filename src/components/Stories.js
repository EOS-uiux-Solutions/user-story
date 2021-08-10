import React, { useState, useEffect, useCallback } from 'react'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'

import StoriesList from './StoriesList'
import Pagination from './Pagination'
import SearchInput from '../modules/SearchInput'

import Lists from '../utils/Lists'
import userStory from '../services/user_story'
import ProductList from './ProductList'

const toggleFilters = (filters, setFilters, value, setPage) => () => {
  if (filters.find((filter) => filter === value)) {
    setFilters(filters.filter((filter) => filter !== value))
  } else {
    setFilters(filters.concat(value))
  }
  setPage(1)
}

const Stories = ({ authorId, followerId }) => {
  const [selectedStatuses, setSelectedStatuses] = useState([])

  const [page, setPage] = useState(1)

  const statusOptions = []

  const [sort, setSort] = useState('Most Voted')

  const [selectedCategories, setSelectedCategories] = useState([])

  const [filtersOpened, setFiltersOpened] = useState(false)

  const [categories, setCategories] = useState([])

  const [searchTerm, setSearchTerm] = useState('')

  const { promiseInProgress } = usePromiseTracker({ area: 'stories-div' })

  const [storyCount, setStoryCount] = useState()

  const [stories, setStories] = useState([])

  const [productQuery, setProductQuery] = useState(``)

  const [searchQuery, setSearchQuery] = useState('')

  const [userTerm, setUserTerm] = useState('')

  const [authorQuery, setAuthorQuery] = useState('')

  const getPage = useCallback((page) => {
    setPage(page)
  }, [])

  useEffect(() => {
    for (let i = 0; i < Lists.stateList.length; i++) {
      statusOptions.push(Lists.stateList[i].status)
    }
  }, [statusOptions])

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
    if (searchTerm === '') {
      setSearchQuery('')
    }
    if (userTerm === '') {
      setAuthorQuery('')
    }
  }, [searchTerm, userTerm])

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
    const fetchCategories = async () => {
      const response = await userStory.getCategories()
      setCategories(
        response.data.data.__type.enumValues.map((ele) => {
          return ele.name
        })
      )
    }
    fetchCategories()
  }, [])

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

      <div className='flex flex-row search-bar'>
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          userTerm={userTerm}
          setUserTerm={setUserTerm}
          setSearchQuery={setSearchQuery}
          setAuthorQuery={setAuthorQuery}
        />

        <p
          onClick={() => {
            setFiltersOpened(!filtersOpened)
          }}
        >
          {filtersOpened ? 'Hide ' : 'Show '}
          Filters{' '}
          {filtersOpened ? (
            <i className='eos-icons'>keyboard_arrow_up</i>
          ) : (
            <i className='eos-icons'>keyboard_arrow_down</i>
          )}
        </p>

        {filtersOpened && (
          <div className='search-filters'>
            <div className='filter-container'>
              <p>Stages</p>
              <div className='filter-section'>
                {Lists.stateList.map((state, key) => {
                  return (
                    <span className='checkbox-row' key={key}>
                      <input
                        type='checkbox'
                        onChange={toggleFilters(
                          selectedStatuses,
                          setSelectedStatuses,
                          state.status,
                          setPage
                        )}
                        id={state.status}
                        checked={
                          !!selectedStatuses.find(
                            (status) => status === state.status
                          )
                        }
                      />
                      <label htmlFor={state.status}>
                        <i className='eos-icons'>{state.icon}</i>
                        {state.status}
                      </label>
                    </span>
                  )
                })}
              </div>
            </div>

            <div className='filter-container'>
              <p>Categories</p>
              <div className='filter-section'>
                {categories.map((category, key) => (
                  <span className='checkbox-row' key={key}>
                    <input
                      type='checkbox'
                      id={category}
                      checked={!!selectedCategories.find((c) => c === category)}
                      onChange={toggleFilters(
                        selectedCategories,
                        setSelectedCategories,
                        category,
                        setPage
                      )}
                    />
                    <label htmlFor={category}>{category}</label>
                  </span>
                ))}
              </div>
            </div>

            <div className='filter-container'>
              <p>Sort By</p>
              <div className='filter-section'>
                {Lists.sortByList.map((item, key) => (
                  <span className='checkbox-input' key={key}>
                    <input
                      type='radio'
                      id={item}
                      name='sortBy'
                      checked={sort === item}
                      onChange={() => {
                        setSort(item)
                      }}
                    />
                    <label htmlFor={item}>{item}</label>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
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
