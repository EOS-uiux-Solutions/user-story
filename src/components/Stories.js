import React, { useState, useEffect, useRef, useCallback } from 'react'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'

import Button from './Button'
import StoriesList from './StoriesList'
import Pagination from './Pagination'
import Dropdown from './Dropdown'
import LoadingIndicator from '../modules/LoadingIndicator'
import SearchInput from '../modules/SearchInput'

import Lists from '../utils/Lists'
import userStory from '../services/user_story'

const Stories = () => {
  const [currentStateSelected, selectState] = useState('Under consideration')

  const [page, setPage] = useState(1)

  const [product, setProduct] = useState('All')

  const [sort, setSort] = useState('Most Voted')

  const [category, setCategory] = useState('All')

  const [products, setProducts] = useState([])

  const [categories, setCategories] = useState([])

  const [searchTerm, setSearchTerm] = useState('')

  const { promiseInProgress } = usePromiseTracker()

  const [storyCount, setStoryCount] = useState()

  const [stories, setStories] = useState([])

  const productDropdownContainer = useRef()

  const sortDropdownContainer = useRef()

  const categoryDropdownContainer = useRef()

  const [productQuery, setProductQuery] = useState(``)

  const [categoryQuery, setCategoryQuery] = useState(``)

  const [searchQuery, setSearchQuery] = useState('')

  const [userTerm, setUserTerm] = useState('')

  const [authorQuery, setAuthorQuery] = useState('')

  const getPage = useCallback((page) => {
    setPage(page)
  }, [])

  useEffect(() => {
    const fetchStoryCount = async () => {
      const response = await userStory.getStoryCount(
        currentStateSelected,
        authorQuery,
        categoryQuery,
        productQuery,
        searchQuery
      )
      setStoryCount(response.data.data.userStoriesConnection.aggregate.count)
    }
    fetchStoryCount()
  }, [
    currentStateSelected,
    product,
    categoryQuery,
    productQuery,
    searchQuery,
    authorQuery
  ])

  useEffect(() => {
    if (product !== 'All') {
      setProductQuery(`product : {Name: "${product}"}`)
    } else {
      setProductQuery(``)
    }
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
  }, [product, category, searchTerm, userTerm])

  useEffect(() => {
    const fetchStories = async () => {
      const response = await userStory.getStories(
        page,
        currentStateSelected,
        authorQuery,
        categoryQuery,
        productQuery,
        searchQuery
      )
      setStories(response.data.data.userStories)
    }
    trackPromise(fetchStories())
  }, [
    categoryQuery,
    currentStateSelected,
    page,
    productQuery,
    searchQuery,
    authorQuery
  ])

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await userStory.getProducts()
      return response.data.data.product !== null
        ? setProducts([
            'All',
            ...response.data.data.products?.map((ele) => {
              return ele.Name
            })
          ])
        : setProducts(['All'])
    }
    fetchProducts()
  }, [])

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
    trackPromise(updateStories())
  }, [sort, stories, setStories])

  return (
    <div>
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
                <i className='eos-icons'>{state.icon}</i>
                {state.status}
              </Button>
            )
          })}
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
            title='Product'
            reference={productDropdownContainer}
            curr={product}
            setCurr={setProduct}
            itemList={products}
          />
          <Dropdown
            title='Categories'
            reference={categoryDropdownContainer}
            curr={category}
            setCurr={setCategory}
            itemList={categories}
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
      {promiseInProgress ? (
        <LoadingIndicator />
      ) : (
        <>
          <StoriesList
            stories={stories}
            state={currentStateSelected}
            product={product}
          />
        </>
      )}
      <Pagination
        getPage={getPage}
        storyCount={storyCount}
        status={currentStateSelected}
        product={product}
      />
    </div>
  )
}

export default Stories
