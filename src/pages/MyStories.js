import React, { useState, useEffect, useRef, useContext } from 'react'
import { apiURL } from '../config.json'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'

import axios from 'axios'

import LoadingIndicator from '../modules/LoadingIndicator'
import Button from '../components/Button'
import StoriesList from '../components/StoriesList'
import Navigation from '../components/Navigation'

import Lists from '../utils/Lists'
import Context from '../modules/Context'
import Login from './Login'

const MyStories = () => {
  const { state } = useContext(Context)

  const [stories, setStories] = useState([])

  const [currentStateSelected, selectState] = useState('My Submissions')

  const [storyStateSelected, selectStoryState] = useState('Under consideration')

  const productDropdownContainer = useRef()
  const sortDropdownContainer = useRef()

  const { promiseInProgress } = usePromiseTracker()

  const id = localStorage.getItem('id')

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

  useEffect(() => {
    const fetchMyStories = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
            userStories(where: { author: "${id}" }) {
              id
              Title
              Description
              followers {
                id
              }
              user_story_comments {
                Comments
              }
              product {
                Name
              }
              user_story_status {
                Status
              }
            }
          }`
        },
        {
          withCredentials: true
        }
      )
      setStories(response.data.data.userStories)
    }
    const fetchFollowingStories = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
            userStories(where: { followers: "${id}" }) {
              id
              Title
              Description
              followers {
                id
              }
              user_story_comments {
                Comments
              }
              product {
                Name
              }
              user_story_status {
                Status
              }
            }
          }`
        },
        {
          withCredentials: true
        }
      )
      setStories(response.data.data.userStories)
    }
    if (currentStateSelected === 'My Submissions')
      trackPromise(fetchMyStories())
    else trackPromise(fetchFollowingStories())
  }, [currentStateSelected, id])

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
    trackPromise(fetchProducts())
  }, [id])

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

  return state.auth ? (
    <>
      <div className='base-wrapper'>
        <div className='base-container'>
          <Navigation />
          <div className='mystories-content'>
            <h3>My Stories</h3>
            <div className='flex flex-row'>
              <Button
                className={
                  currentStateSelected === 'My Submissions'
                    ? 'btn btn-tabs btn-tabs-selected'
                    : 'btn btn-tabs'
                }
                onClick={() => selectState('My Submissions')}
              >
                My Submissions
              </Button>
              &nbsp; &nbsp;
              <Button
                className={
                  currentStateSelected === 'Following'
                    ? 'btn btn-tabs btn-tabs-selected'
                    : 'btn btn-tabs'
                }
                onClick={() => selectState('Following')}
              >
                Following
              </Button>
            </div>
            <div className='flex flex-row flex-space-between'>
              {Lists.stateList &&
                Lists.stateList.map((state, key) => {
                  return (
                    <Button
                      className={
                        storyStateSelected === state.status
                          ? 'btn btn-tabs btn-tabs-selected'
                          : 'btn btn-tabs'
                      }
                      key={key}
                      onClick={() => selectStoryState(state.status)}
                    >
                      <i className='eos-icons'>{state.icon}</i>
                      {state.status}
                    </Button>
                  )
                })}
            </div>
            <div className='flex flex-row options-bar'>
              <div className='filter-title'>Product</div>
              <div
                className='dropdown-container'
                ref={productDropdownContainer}
              >
                <Button
                  type='button'
                  className='btn btn-transparent'
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
                  className='btn btn-transparent'
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
                    {Lists.sortByList.map((item, key) => (
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
            {promiseInProgress ? (
              <LoadingIndicator />
            ) : (
              <div className='flex flex-column'>
                <StoriesList
                  stories={stories}
                  state={storyStateSelected}
                  product={product}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  ) : (
    <Login message='Please login to access your stories' />
  )
}

export default MyStories
