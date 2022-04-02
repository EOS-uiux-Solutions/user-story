import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'

import Button from './Button'
import StoriesList from './StoriesList'
import Pagination from './Pagination'
import Dropdown from './Dropdown'
import SearchInput from '../modules/SearchInput'

import Lists from '../utils/Lists'
import userStory from '../services/user_story'
import ProductList from './ProductList'

const Stories = ({ authorId, followerId }) => {
  const [currentStateSelected, selectState] = useState('Under consideration')

  const [page, setPage] = useState(1)

  const statusOptions = useMemo(() => [], [])

  const [status, setStatus] = useState('Under consideration')

  const [sort, setSort] = useState('Most Voted')

  const [category, setCategory] = useState('All')

  const [categories, setCategories] = useState([])

  const [searchTerm, setSearchTerm] = useState('')

  const { promiseInProgress } = usePromiseTracker({ area: 'stories-div' })

  const [storyCount, setStoryCount] = useState()

  const [stories, setStories] = useState([])

  const statusDropdownContainer = useRef()

  const sortDropdownContainer = useRef()

  const categoryDropdownContainer = useRef()

  const [productQuery, setProductQuery] = useState(``)

  const [categoryQuery, setCategoryQuery] = useState(``)

  const [searchQuery, setSearchQuery] = useState('')

  const [userTerm, setUserTerm] = useState('')

  const [authorQuery, setAuthorQuery] = useState('')

  const [sortType, setSortType] = useState('followers:desc')

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
        currentStateSelected,
        authorId,
        authorQuery,
        categoryQuery,
        productQuery,
        searchQuery,
        followerId
      )
      setStoryCount(response.data.data.userStoriesConnection.aggregate.count)
    }
    fetchStoryCount()
  }, [
    currentStateSelected,
    categoryQuery,
    productQuery,
    searchQuery,
    authorQuery,
    authorId,
    followerId
  ])

  useEffect(() => {
    if (category !== 'All') {
      setCategoryQuery(`Category : "${category}"`)
    } else {
      setCategoryQuery(``)
    }
    if (searchTerm === '') {
      setSearchQuery('')
    }
    if (userTerm === '') {
      setAuthorQuery('')
    }
  }, [category, searchTerm, userTerm])

  useEffect(() => {
    if (sort === 'Most Voted') {
      setSortType('followers:desc')
    } else if (sort === 'Most Discussed') {
      setSortType('comments:desc')
    }

    const fetchStories = async () => {
      const response = await userStory.getStories(
        page,
        currentStateSelected,
        authorId,
        authorQuery,
        categoryQuery,
        productQuery,
        searchQuery,
        followerId,
        sortType
      )
      setStories(response.data.data.userStories)
    }
    trackPromise(fetchStories(), 'stories-div')
  }, [
    categoryQuery,
    currentStateSelected,
    page,
    productQuery,
    searchQuery,
    authorQuery,
    authorId,
    followerId,
    sortType,
    sort
  ])

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await userStory.getCategories()
      setCategories([
        'All',
        ...response.data.data.__type.enumValues.map((ele) => {
          return ele.name
        })
      ])
    }
    fetchCategories()
  }, [])

  return (
    <div>
      <ProductList setProductQuery={setProductQuery} />
      <div className='roadmap-container'>
        <div className='roadmap'>
          {Lists.stateList &&
            Lists.stateList.map((state, key) => {
              return (
                <Button
                  className={
                    currentStateSelected === state.status
                      ? 'btn btn-tabs btn-tabs-selected'
                      : 'btn btn-tabs'
                  }
                  key={key}
                  onClick={() => {
                    selectState(state.status)
                    setPage(1)
                  }}
                >
                  {state.icon}
                  {state.status}
                </Button>
              )
            })}
        </div>
      </div>

      <div className='roadmap-dropdown'>
        <Dropdown
          title='Status'
          reference={statusDropdownContainer}
          curr={status}
          setCurr={setStatus}
          itemList={statusOptions}
          data-cy='status-dropdown'
          selectstate={selectState}
          setpage={setPage}
        />
      </div>

      <div className='flex flex-row search-bar'>
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          userTerm={userTerm}
          setUserTerm={setUserTerm}
          setSearchQuery={setSearchQuery}
          setAuthorQuery={setAuthorQuery}
        />
        <div className='flex flex-row options-bar'>
          <Dropdown
            title='Categories'
            reference={categoryDropdownContainer}
            curr={category}
            setCurr={setCategory}
            itemList={categories}
            data-cy='category-dropdown'
          />
          <Dropdown
            title='Sort By'
            reference={sortDropdownContainer}
            curr={sort}
            setCurr={setSort}
            itemList={Lists.sortByList}
          />
        </div>
      </div>
      <div className='stories-div'>
        <StoriesList stories={stories} isLoading={promiseInProgress} />
      </div>
      <Pagination
        getPage={getPage}
        storyCount={storyCount}
        status={currentStateSelected}
        productQuery={productQuery}
      />
    </div>
  )
}

export default Stories
