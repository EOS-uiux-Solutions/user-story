import React, { useState, useEffect, useRef, useCallback } from 'react'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'

// components
import StoriesList from './StoriesList'
import Pagination from './Pagination'
import Dropdown from './Dropdown'
import ProductList from './ProductList'
import RoadmapFilter from './roadmap-filter'
import Switch from './Switch'
import StatusContainer from './StatusContainer'
// others
import SearchInput from '../modules/SearchInput'
import Lists from '../utils/Lists'
import userStory from '../services/user_story'

const Stories = ({ authorId, followerId }) => {
  const [currentStateSelected, selectState] = useState('All')

  const [page, setPage] = useState(1)

  const [sort, setSort] = useState('Most Voted')

  const [category, setCategory] = useState('All')

  const [categories, setCategories] = useState([])

  const [searchTerm, setSearchTerm] = useState('')

  const { promiseInProgress } = usePromiseTracker({ area: 'stories-div' })

  const [storyCount, setStoryCount] = useState()

  const [stories, setStories] = useState([])

  const sortDropdownContainer = useRef()

  const categoryDropdownContainer = useRef()

  const [productQuery, setProductQuery] = useState(``)

  const [categoryQuery, setCategoryQuery] = useState(``)

  const [searchQuery, setSearchQuery] = useState('')

  const [userTerm, setUserTerm] = useState('')

  const [authorQuery, setAuthorQuery] = useState('')

  const [sortType, setSortType] = useState('followers:desc')

  const [checked, setChecked] = useState(false)

  const getPage = useCallback((page) => {
    setPage(page)
  }, [])

  useEffect(() => {
    const fetchStoryCount = async () => {
      const response = await userStory.getStoryCount(
        currentStateSelected,
        authorId,
        authorQuery,
        categoryQuery,
        productQuery,
        searchQuery,
        followerId,
        checked
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
    followerId,
    checked
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
        sortType,
        checked
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
    sort,
    checked
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
      <div className='filters'>
        <div className='filters-top flex'>
          <div className='options-bar'>
            <ProductList setProductQuery={setProductQuery} />
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
            <Switch
              checked={checked}
              setChecked={setChecked}
              uncheckedOption={'All'}
              checkedOption={'By Roadmap Stage'}
            />
          </div>
          <SearchInput
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            userTerm={userTerm}
            setUserTerm={setUserTerm}
            setSearchQuery={setSearchQuery}
            setAuthorQuery={setAuthorQuery}
          />
        </div>
        {checked && (
          <RoadmapFilter
            selectState={selectState}
            setPage={setPage}
            currentStateSelected={currentStateSelected}
          />
        )}
      </div>
      <div className='status-container-box flex'>
        {checked &&
          Lists.stateList
            .slice(1)
            .map((state, key) => (
              <StatusContainer stories={stories} state={state} key={key} />
            ))}
      </div>
      {!checked && (
        <div className='stories-div'>
          <StoriesList stories={stories} isLoading={promiseInProgress} />
        </div>
      )}
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
