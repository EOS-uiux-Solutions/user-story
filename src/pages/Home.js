import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext
} from 'react'
import axios from 'axios'
import { Link } from '@reach/router'
import { apiURL } from '../config.json'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'

import Button from '../components/Button'
import StoriesList from '../components/StoriesList'
import LoadingIndicator from '../modules/LoadingIndicator'
import Navigation from '../components/Navigation'
import Pagination from '../components/Pagination'
import Dropdown from '../components/Dropdown'
import Modal from '../components/Modal'

import Lists from '../utils/Lists'
import useAuth from '../hooks/useAuth'
import Context from '../modules/Context'

const Home = () => {
  const { logout } = useAuth()

  const userId = localStorage.getItem('id')

  const { dispatch } = useContext(Context)

  const [page, setPage] = useState(1)

  const [storyCount, setStoryCount] = useState()

  const [modal, setModal] = useState(false)

  const [policyUpdate, setPolicyUpdate] = useState()

  const [currentStateSelected, selectState] = useState('Under consideration')

  const [stories, setStories] = useState([])

  const productDropdownContainer = useRef()

  const sortDropdownContainer = useRef()

  const categoryDropdownContainer = useRef()

  const [product, setProduct] = useState('All')

  const [sort, setSort] = useState('Most Voted')

  const [category, setCategory] = useState('All')

  const [products, setProducts] = useState([])

  const [categories, setCategories] = useState([])

  const { promiseInProgress } = usePromiseTracker()

  const getPage = useCallback((page) => {
    setPage(page)
  }, [])

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
              author {
                id
                username
              }
              followers {
                id
              }
              Category
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
    const fetchStoriesWithProduct = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
            userStories(sort: "createdAt:desc", limit: 5, start: ${
              (page - 1) * 5
            }, where: {
              user_story_status : {
                Status: "${currentStateSelected}"
              },
              product: {
                Name: "${product}"
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
              author {
                id
                username
              }
              followers {
                id
              }
              Category
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
    if (product === 'All') {
      trackPromise(fetchStories())
    } else {
      trackPromise(fetchStoriesWithProduct())
    }
  }, [currentStateSelected, page, product])

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
    const fetchStoryCountWithProduct = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `
          query {
            userStoriesConnection(where: { user_story_status: { Status: "${currentStateSelected}" }, 
            product: { Name: "${product}"} }) {
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
    if (product === 'All') {
      fetchStoryCount()
    } else {
      fetchStoryCountWithProduct()
    }
  }, [currentStateSelected, product])

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
      setProducts([
        'All',
        ...response.data.data.products.map((ele) => {
          return ele.Name
        })
      ])
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.post(`${apiURL}/graphql`, {
        query: '{ __type(name: "ENUM_USERSTORY_CATEGORY") {enumValues {name}}}'
      })
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

  useEffect(() => {
    const fetchPolicyNotifications = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `
        query {
          userStoryNotifications(where: {message: "User story privacy policy has been updated"}) {
            message
            id
            users {
              id
            }
            seenBy {
              id
            }
            date
            link
          }
        }`
        },
        {
          withCredentials: true
        }
      )
      if (response.data.data.userStoryNotifications) {
        const seenBy = response.data.data.userStoryNotifications[0].seenBy.map(
          (seen) => seen.id
        )
        if (
          response.data.data.userStoryNotifications.length &&
          !seenBy.includes(userId)
        ) {
          setModal(true)
          setPolicyUpdate(response.data.data.userStoryNotifications[0])
        }
      }
    }
    if (userId) {
      fetchPolicyNotifications()
    }
  }, [userId])

  const acceptUpdatedPolicy = async () => {
    const seenBy = policyUpdate.seenBy.map((seen) => seen.id)
    seenBy.push(userId)
    await axios.post(
      `${apiURL}/graphql`,
      {
        query: `mutation updateNotifications($seenBy: [ID]){
          updateUserStoryNotification(input: {
            where: {
              id: "${policyUpdate.id}"
            }
            data: {
              seenBy: $seenBy
            }
          }) {
            userStoryNotification {
              id
            }
          }
        }`,
        variables: {
          seenBy: seenBy
        }
      },
      {
        withCredentials: true
      }
    )
    setModal(false)
  }

  const handlePolicyUpdateReject = async () => {
    if (userId) {
      await logout()
      dispatch({
        type: 'DEAUTHENTICATE'
      })
    }
    setModal(false)
  }

  return (
    <>
      <div className='base-wrapper'>
        <div className='base-container'>
          <Navigation />
          <div className='home-content'>
            <div className='product-introduction'>
              <div className='header'>TELL US YOUR STORY</div>
              <p>
                Share with us how you use our products, relate to other users'
                stories, vote them up, and we'll make sure we deliver cohesive
                solutions that enhance your experience.
              </p>
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
          {modal && policyUpdate ? (
            <Modal
              showButtons={true}
              onCancel={handlePolicyUpdateReject}
              isActive={modal}
              show={() => setModal(false)}
              onOk={acceptUpdatedPolicy}
            >
              {
                <>
                  {policyUpdate.message}
                  <Link
                    className='link link-default'
                    to={`/${policyUpdate.link}`}
                  >
                    View privacy policy
                  </Link>
                </>
              }
            </Modal>
          ) : (
            ''
          )}
        </div>
      </div>
    </>
  )
}

export default Home
