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
import { Helmet } from 'react-helmet'

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

  const [searchTerm, setSearchTerm] = useState('')

  const { promiseInProgress } = usePromiseTracker()

  const [productQuery, setProductQuery] = useState(``)

  const [categoryQuery, setCategoryQuery] = useState(``)

  const [searchQuery, setSearchQuery] = useState('')

  const getPage = useCallback((page) => {
    setPage(page)
  }, [])

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
  }, [product, category, searchTerm])

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
                },
                ${categoryQuery}
                ${productQuery}
                ${searchQuery}
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
                username
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
    trackPromise(fetchStories())
  }, [categoryQuery, currentStateSelected, page, productQuery, searchQuery])

  useEffect(() => {
    const fetchStoryCount = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `
          query {
            userStoriesConnection(where: { user_story_status: { Status: "${currentStateSelected}" },
            ${productQuery}, ${searchQuery} }) {
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
  }, [currentStateSelected, product, productQuery, searchQuery])

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
        const seenBy = response.data.data.userStoryNotifications[0]?.seenBy.map(
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
      <Helmet>
        <title>Home | EOS User story</title>
        <meta
          name='description'
          content="Share with us how you use our products, relate to other users stories, vote them up, and we'll make sure we deliver cohesive solutions that enhance your experience."
        />
        <meta
          name='keywords'
          content='feature request, open roadmap, user voice, feature request tracking, issue tracker open source '
        />
      </Helmet>

      <Navigation />
      <div className='body-content'>
        <div className='body-wrapper'>
          <div className='product-introduction'>
            <div>
              <h1>TELL US YOUR STORY</h1>
              <h2 className='subheader'>
                Share with us how you use our products, relate to other users'
                stories, vote them up, and we'll make sure we deliver cohesive
                solutions that enhance your experience.
              </h2>
            </div>
            <div className='img-wrap'>
              <img
                className='profile-picture'
                src={require(`../assets/images/user-story-graphic.svg`)}
                alt='profile pic'
              />
            </div>
          </div>
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
            <div className='flex flex-row search-controls'>
              <div className='flex flex-row search-input'>
                <span>
                  <i className='eos-icons'>search</i>
                </span>
                <input
                  type='text'
                  name='search'
                  placeholder='Search'
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value)
                  }}
                />
                <div className='close-btn-div'>
                  <span
                    className='close-btn'
                    onClick={() => {
                      if (searchTerm.length > 0) setSearchTerm('')
                    }}
                  >
                    {searchTerm.length > 0 && (
                      <i className='eos-icons'>close</i>
                    )}
                  </span>
                </div>
              </div>
              <Button
                type='submit'
                className='btn btn-default'
                onClick={() => {
                  setSearchQuery(`Title_contains: "${searchTerm}"`)
                }}
              >
                Search
              </Button>
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
              <Link className='link link-default' to={`/${policyUpdate.link}`}>
                View privacy policy
              </Link>
            </>
          }
        </Modal>
      ) : (
        ''
      )}
    </>
  )
}

export default Home
