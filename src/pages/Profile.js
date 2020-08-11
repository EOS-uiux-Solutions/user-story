import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { apiURL } from '../config.json'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'

import LoadingIndicator from '../modules/LoadingIndicator'
import StoriesList from '../components/StoriesList'
import Navigation from '../components/Navigation'
import Button from '../components/Button'

const stateList = [
  'Under consideration',
  'Planned',
  'Designing',
  'Implementing',
  'Testing',
  'Deployed'
]

const sortByList = ['Most Voted', 'Most Discussed']

const Profile = (props) => {
  const { profileId } = props
  const [stories, setStories] = useState([])
  const [user, setUser] = useState('')

  const [currentStateSelected, selectState] = useState('Under consideration')

  const { promiseInProgress } = usePromiseTracker()
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
    const fetchUserInfo = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
          user(id: "${profileId}") {
            profilePicture {
              url
            }
            Name
            Bio
            username
            Company
            Profession
            email
            LinkedIn
            Twitter
          }
        }
        `
        },
        {
          withCredentials: true
        }
      )
      setUser(response.data.data.user)
    }
    if (profileId) {
      trackPromise(fetchUserInfo())
    }
  }, [profileId])

  useEffect(() => {
    const fetchMyStories = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
            user(id: "${profileId}") {
              user_stories {
                id
                Title
                Description
                user_story_status {
                  Status
                }
                followers {
                  username
                }
                product {
                  Name
                }
                user_story_comments {
                  Comments
                }
              }
            }
          }`
        },
        {
          withCredentials: true
        }
      )
      setStories(response.data.data.user.user_stories)
    }
    trackPromise(fetchMyStories())
  }, [profileId])

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
          {promiseInProgress ? (
            <LoadingIndicator />
          ) : (
            <div className='profile-content'>
              <div className='flex flex-row flex-space-around'>
                <div className='flex flex-column'>
                  <div className='profile-picture-container'>
                    {user && user.profilePicture ? (
                      <img
                        className='profile-picture'
                        src={user.profilePicture.url}
                        alt='Profile'
                      />
                    ) : (
                      <img
                        className='profile-picture'
                        src={`https://api.adorable.io/avatars/100/${user.username}`}
                        alt='Profile'
                      />
                    )}
                  </div>
                  <textarea
                    rows='6'
                    cols='17'
                    readOnly={true}
                    defaultValue={user.Bio}
                  ></textarea>
                </div>
                <div className='flex flex-column'>
                  <div className='basic-about'>
                    <div className='flex flex-row flex-space-between'>
                      <div className='about-element about-element-label'>
                        {' '}
                        Username:{' '}
                      </div>
                      <div className='about-element '> {user.username} </div>
                    </div>
                    <div className='flex flex-row flex-space-between'>
                      <div className='about-element about-element-label'>
                        {' '}
                        Name:{' '}
                      </div>
                      <div className='about-element '>
                        {' '}
                        {user.Name !== 'null' ? user.Name : ''}{' '}
                      </div>
                    </div>
                    <div className='flex flex-row flex-space-between'>
                      <div className='about-element about-element-label'>
                        {' '}
                        Profession:{' '}
                      </div>
                      <div className='about-element '>
                        {' '}
                        {user.Profession !== 'null' ? user.Profession : ''}{' '}
                      </div>
                    </div>
                    <div className='flex flex-row flex-space-between'>
                      <div className='about-element about-element-label'>
                        {' '}
                        Company/Institute:{' '}
                      </div>
                      <div className='about-element '>
                        {' '}
                        {user.Company !== 'null' ? user.Company : ''}{' '}
                      </div>
                    </div>
                    <div className='flex flex-row flex-space-between'>
                      <div className='about-element about-element-label'>
                        {' '}
                        LinkedIn:{' '}
                      </div>
                      <div className='about-element '>
                        {' '}
                        {user.Linkedin !== 'null' ? user.Linkedin : ''}{' '}
                      </div>
                    </div>
                    <div className='flex flex-row flex-space-between'>
                      <div className='about-element about-element-label'>
                        {' '}
                        Twitter:{' '}
                      </div>
                      <div className='about-element '>
                        {' '}
                        {user.Twitter !== 'null' ? user.Twitter : ''}{' '}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {
                <div className='flex flex-column'>
                  <h3>Stories by this user</h3>
                  <div className='flex flex-row'>
                    <div className='filter-title'>Filter by product</div>
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
                    <div
                      className='dropdown-container'
                      ref={sortDropdownContainer}
                    >
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
                            onClick={() => selectState(state)}
                          >
                            {state}
                          </Button>
                        )
                      })}
                  </div>
                  <StoriesList
                    stories={stories}
                    state={currentStateSelected}
                    product={product}
                  />
                </div>
              }
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Profile
