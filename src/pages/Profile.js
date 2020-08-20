import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { apiURL } from '../config.json'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'

import LoadingIndicator from '../modules/LoadingIndicator'
import StoriesList from '../components/StoriesList'
import Navigation from '../components/Navigation'
import Button from '../components/Button'
import DropdownOptions from '../components/DropdownOptions'

import Lists from '../utils/Lists'

const Profile = (props) => {
  const { profileId } = props
  const [stories, setStories] = useState([])
  const [user, setUser] = useState('')

  const [currentStateSelected, selectState] = useState('Under consideration')

  const { promiseInProgress } = usePromiseTracker()

  const productDropdownContainer = useRef()
  const sortDropdownContainer = useRef()
  const categoryDropdownContainer = useRef()

  const [product, setProduct] = useState('All')
  const [sort, setSort] = useState('Most Voted')
  const [category, setCategory] = useState('All')

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])

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
      setProducts(
        response.data.data.products.map((ele) => {
          return ele.Name
        })
      )
      setProducts((products) => ['All', ...products])
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.post(`${apiURL}/graphql`, {
        query: '{ __type(name: "ENUM_USERSTORY_CATEGORY") {enumValues {name}}}'
      })

      setCategories(
        response.data.data.__type.enumValues.map((ele) => {
          return ele.name
        })
      )
      setCategories((categories) => ['All', ...categories])
    }
    trackPromise(fetchCategories())
  }, [])

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
                  <div className='flex flex-row options-bar'>
                    <DropdownOptions
                      title='Product'
                      reference={productDropdownContainer}
                      curr={product}
                      setCurr={setProduct}
                      itemList={products}
                    />
                    <DropdownOptions
                      title='Categories'
                      reference={categoryDropdownContainer}
                      curr={category}
                      setCurr={setCategory}
                      itemList={categories}
                    />
                    <DropdownOptions
                      title='Sort By'
                      reference={sortDropdownContainer}
                      curr={sort}
                      setCurr={setSort}
                      itemList={Lists.sortByList}
                    />
                  </div>
                  <div className='flex flex-row flex-space-between'>
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
                            onClick={() => selectState(state.status)}
                          >
                            <i className='eos-icons'>{state.icon}</i>
                            {state.status}
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
