import React, { useState, useEffect, useRef, useContext } from 'react'
import { apiURL } from '../config.json'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { Helmet } from 'react-helmet'

import axios from 'axios'

import LoadingIndicator from '../modules/LoadingIndicator'
import Button from '../components/Button'
import StoriesList from '../components/StoriesList'
import Navigation from '../components/Navigation'
import Dropdown from '../components/Dropdown'

import Lists from '../utils/Lists'
import Context from '../modules/Context'
import Login from './Login'

const MyStories = () => {
  const { state } = useContext(Context)

  const [stories, setStories] = useState([])

  const [currentStateSelected, selectState] = useState('My Submissions')

  const [storyStateSelected, selectStoryState] = useState('Under consideration')

  const [product, setProduct] = useState('All')
  const [sort, setSort] = useState('Most Voted')
  const [category, setCategory] = useState('All')

  const productDropdownContainer = useRef()
  const sortDropdownContainer = useRef()
  const categoryDropdownContainer = useRef()

  const [categories, setCategories] = useState([])

  const { promiseInProgress } = usePromiseTracker()

  const id = localStorage.getItem('id')

  const [products, setProducts] = useState([])

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
                username
              }
              user_story_comments {
                Comments
              }
              product {
                Name
              }
              author {
                id
                username
              }
              user_story_status {
                Status
              }
              Category
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
              author {
                id
                username
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
      setProducts(
        response.data.data.products.map((ele) => {
          return ele.Name
        })
      )
      setProducts((products) => ['All', ...products])
    }
    trackPromise(fetchProducts())
  }, [id])

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

  return state.auth ? (
    <>
      <Helmet>
        <title>My stories | EOS User story</title>
        <meta name='robots' content='noindex' />
      </Helmet>
      <Navigation />
      <div className='body-content'>
        <div className='body-wrapper my-stories'>
          <h3>My Stories</h3>
          <div className='flex flex-row roadmap-one'>
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
          <div className='flex flex-row flex-space-between roadmap-one'>
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
    </>
  ) : (
    <Login message='Please login to access your stories' />
  )
}

export default MyStories
