import React, { useState, useEffect, useRef } from 'react'
import Button from '../components/Button'
import StoriesList from '../components/StoriesList'
import LoadingIndicator from '../modules/LoadingIndicator'

import axios from 'axios'
import { apiURL } from '../config.json'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import Navigation from '../components/Navigation'
import Pagination from '../components/Pagination'

const stateList = [
  'Under consideration',
  'Planned',
  'Designing',
  'Implementing',
  'Testing',
  'Deployed'
]

const sortByList = ['Most Voted', 'Most Discussed']

const Home = () => {
  const [currentStateSelected, selectState] = useState('Under consideration')

  const [page, setPage] = useState(1)

  const [storyCount, setStoryCount] = useState()

  const [stories, setStories] = useState([])

  const productDropdownContainer = useRef()
  const sortDropdownContainer = useRef()

  const [productDropdownState, setProductDropdownState] = useState(false)
  const [sortDropdownState, setSortDropdownState] = useState(false)

  const [product, setProduct] = useState('All')
  const [sort, setSort] = useState('Most Voted')

  const [products, setProducts] = useState([])

  const handleProductSelection = (value) => {
    setProduct(value)
    setProductDropdownState(false)
  }

  const handleSortSelection = (value) => {
    setSort(value)
    setSortDropdownState(false)
  }
  const handleProductDropdownState = () => {
    setProductDropdownState(!productDropdownState)
  }
  const handleSortDropdownState = () => {
    setSortDropdownState(!sortDropdownState)
  }

  const { promiseInProgress } = usePromiseTracker()

  const getPage = (page) => {
    setPage(page)
  }

  useEffect(() => {
    const fetchStories = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
            userStories(sort: "createdAt:desc", limit: 5, start: ${
              (page - 1) * 5
            }, where: {
              user_story_status : {
                Status: "${currentStateSelected}"
              }
            }) {
              id
              Title
              Description
              user_story_status {
                Status
              }
              user_story_comments {
                Comments
              }
              product {
                Name
              }
              followers {
                username
              }
            }
          }
          `
        },
        {
          withCredentials: true
        }
      )
      setStories(response.data.data.userStories)
    }
    trackPromise(fetchStories())
  }, [currentStateSelected, page])

  useEffect(() => {
    const fetchStoryCount = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `
          query {
            userStoriesConnection(where: { user_story_status: { Status: "${currentStateSelected}" } }) {
              aggregate {
                count
              }
            }
          }`
        },
        {
          withCredentials: true
        }
      )
      setStoryCount(response.data.data.userStoriesConnection.aggregate.count)
    }
    fetchStoryCount()
  }, [currentStateSelected])

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
          products {
            Name
          }
        }`
        },
        {
          withCredentials: true
        }
      )
      setProducts(response.data.data.products)
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        productDropdownContainer.current &&
        !productDropdownContainer.current.contains(event.target)
      ) {
        setProductDropdownState(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [productDropdownContainer])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sortDropdownContainer.current &&
        !sortDropdownContainer.current.contains(event.target)
      ) {
        setSortDropdownState(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [sortDropdownContainer])

  useEffect(() => {
    const comparatorVotes = (a, b) => {
      return a.followers.length < b.followers.length
    }
    const comparatorComments = (a, b) => {
      return a.user_story_comments.length < b.user_story_comments.length
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
    <>
      <div className='base-wrapper'>
        <div className='base-container'>
          <Navigation />
          <div className='home-content'>
            <h3>Welcome to EOS User Stories</h3>
            <p>
              Share with us how you use our products, relate to other users'
              stories, vote them up, and we'll make sure we deliver cohesive
              solutions that enhance your experience.
            </p>
            <div className='flex flex-row'>
              <div className='filter-title'>Filter by product</div>
              <div
                className='dropdown-container'
                ref={productDropdownContainer}
              >
                <Button
                  type='button'
                  className='btn btn-dropdown btn-flexible'
                  onClick={handleProductDropdownState}
                >
                  {productDropdownState ? (
                    <i className='eos-icons'>keyboard_arrow_up</i>
                  ) : (
                    <i className='eos-icons'>keyboard_arrow_down</i>
                  )}
                  &nbsp; {product}
                </Button>
                <div
                  className={`dropdown ${
                    productDropdownState
                      ? 'dropdown-open dropdown-right'
                      : 'dropdown-close dropdown-right'
                  }`}
                >
                  <ul className='dropdown-list'>
                    <li
                      className='dropdown-element'
                      onClick={() => handleProductSelection('All')}
                    >
                      All
                    </li>
                    {products.map((item, key) => (
                      <li
                        key={key}
                        className='dropdown-element'
                        onClick={() => handleProductSelection(item.Name)}
                      >
                        {item.Name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className='filter-title'>Sort by</div>
              <div className='dropdown-container' ref={sortDropdownContainer}>
                <Button
                  type='button'
                  className='btn btn-dropdown btn-flexible'
                  onClick={handleSortDropdownState}
                >
                  {sortDropdownState ? (
                    <i className='eos-icons'>keyboard_arrow_up</i>
                  ) : (
                    <i className='eos-icons'>keyboard_arrow_down</i>
                  )}
                  &nbsp; {sort}
                </Button>
                <div
                  className={`dropdown ${
                    sortDropdownState
                      ? 'dropdown-open dropdown-right'
                      : 'dropdown-close dropdown-right'
                  }`}
                >
                  <ul className='dropdown-list'>
                    {sortByList.map((item, key) => (
                      <li
                        key={key}
                        className='dropdown-element'
                        onClick={() => handleSortSelection(item)}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className='flex flex-row flex-space-between'>
              {stateList &&
                stateList.map((state, key) => {
                  return (
                    <Button
                      className={
                        currentStateSelected === state
                          ? 'btn btn-tabs btn-tabs-selected'
                          : 'btn btn-tabs'
                      }
                      key={key}
                      onClick={() => {
                        selectState(state)
                        setPage(1)
                      }}
                    >
                      {state}
                    </Button>
                  )
                })}
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
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
