import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext
} from 'react'
import axios from 'axios'
import { Link, useLocation } from '@reach/router'
import { parse } from 'query-string'
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
import SearchInput from '../components/SearchInput'

import Lists from '../utils/Lists'
import SortParams from '../utils/SortParams'
import useAuth from '../hooks/useAuth'
import Context from '../modules/Context'

const Home = () => {
  const location = useLocation()

  const searchParams = useRef(parse(location.search))
  if (
    SortParams.map((param) => param.name).indexOf(
      searchParams.current.sortBy
    ) === -1
  ) {
    delete searchParams.current.sortBy
  }

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

  const [sort, setSort] = useState(searchParams.current.sortBy ?? 'Most Voted')

  const [category, setCategory] = useState('All')

  const [products, setProducts] = useState([])

  const [categories, setCategories] = useState([])

  const [searchTerm, setSearchTerm] = useState('')

  const { promiseInProgress } = usePromiseTracker()

  const [productQuery, setProductQuery] = useState(``)

  const [categoryQuery, setCategoryQuery] = useState(``)

  const [searchQuery, setSearchQuery] = useState('')

  const [userTerm, setUserTerm] = useState('')

  const [userQuery, setUserQuery] = useState('')

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
    if (userTerm === '') {
      setUserQuery('')
    }
  }, [product, category, searchTerm, userTerm])

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
                author: {
                  username_contains: "${userQuery}"
                }
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
                profilePicture {
                  id
                  url
                }
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
  }, [
    categoryQuery,
    currentStateSelected,
    page,
    productQuery,
    searchQuery,
    userQuery
  ])

  useEffect(() => {
    const fetchStoryCount = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `
          query {
            userStoriesConnection(where: {
              user_story_status: {
                Status: "${currentStateSelected}"
              },
              author: {
                username_contains: "${userQuery}"
              }
              ${productQuery},
              ${searchQuery}
            }) {
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
  }, [currentStateSelected, product, productQuery, searchQuery, userQuery])

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

      const productsList =
        response.data.data.products !== null
          ? [
              'All',
              ...response.data.data.products?.map((ele) => {
                return ele.Name
              })
            ]
          : ['All']

      setProducts(productsList)

      if (productsList.indexOf(searchParams.current.product) !== -1) {
        setProduct(searchParams.current.product)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.post(`${apiURL}/graphql`, {
        query: '{ __type(name: "ENUM_USERSTORY_CATEGORY") {enumValues {name}}}'
      })

      const categoriesList = [
        'All',
        ...response.data.data.__type.enumValues.map((ele) => {
          return ele.name
        })
      ]
      setCategories(categoriesList)

      if (categoriesList.indexOf(searchParams.current.category) !== -1) {
        setCategory(searchParams.current.category)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const updateStories = async () => {
      SortParams.forEach((param) => {
        if (sort === param.name) {
          setStories(stories.sort(param.comparator))
        }
      })
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
            <SearchInput
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              userTerm={userTerm}
              setUserTerm={setUserTerm}
              setSearchQuery={setSearchQuery}
              setUserQuery={setUserQuery}
            />
            <div className='flex flex-row options-bar'>
              <Dropdown
                title='Product'
                reference={productDropdownContainer}
                curr={product}
                setCurr={setProduct}
                itemList={products}
                searchFilters={searchParams.current}
                objKey='product'
              />
              <Dropdown
                title='Categories'
                reference={categoryDropdownContainer}
                curr={category}
                setCurr={setCategory}
                itemList={categories}
                searchFilters={searchParams.current}
                objKey='category'
              />
              <Dropdown
                title='Sort By'
                reference={sortDropdownContainer}
                curr={sort}
                setCurr={setSort}
                itemList={Lists.sortByList}
                searchFilters={searchParams.current}
                objKey='sortBy'
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
            searchFilters={searchParams.current}
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
