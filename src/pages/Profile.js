import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { apiURL } from '../config.json'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { Helmet } from 'react-helmet'
import { navigate } from '@reach/router'

import LoadingIndicator from '../modules/LoadingIndicator'
import StoriesList from '../components/StoriesList'
import Navigation from '../components/Navigation'
import Button from '../components/Button'
import Dropdown from '../components/Dropdown'
import UserProfile from '../components/UserProfile'
import Lists from '../utils/Lists'

import userStory from '../services/user_story'

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
      const response = await userStory.getProducts()
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
      const response = await userStory.getCategories()

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
      const response = await userStory.getUserDetails(profileId)
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
                Attachment {
                  id
                  url
                }
                author {
                  id
                  username
                }
                user_story_comments {
                  Comments
                }
                Category
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

  if (user === null) {
    navigate('/404', { replace: true })
    return null
  }

  return (
    <>
      <Helmet>
        <title>{`${user.username} | EOS User story`}</title>
        <meta name='description' content={`${user.Bio}`} />
        <meta name='keywords' content='user story, issue tracker' />
      </Helmet>
      <Navigation />
      {promiseInProgress ? (
        <LoadingIndicator />
      ) : (
        <div className='body-content'>
          <div className='body-wrapper'>
            <div className='flex flex-row flex-space-around'>
              <div className='flex flex-column'>
                <UserProfile user={user} />
              </div>
            </div>
            {
              <div className='flex flex-column'>
                <h3>Stories by this user</h3>
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
                <div className='flex flex-row flex-space-between rdmap'>
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
        </div>
      )}
    </>
  )
}

export default Profile
