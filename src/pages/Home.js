import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext
} from 'react'
import { Link } from '@reach/router'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { Helmet } from 'react-helmet'

import Button from '../components/Button'
import StoriesList from '../components/StoriesList'
import LoadingIndicator from '../modules/LoadingIndicator'
import Navigation from '../components/Navigation'
import Pagination from '../components/Pagination'
import Dropdown from '../components/Dropdown'
import Modal from '../components/Modal'
import UsersSuggestionDropdown from '../components/UsersSuggestionDropdown'

import Lists from '../utils/Lists'
import useAuth from '../hooks/useAuth'
import Context from '../modules/Context'
import userStory from '../services/user_story'

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

  const fieldToSearchDropdownContainer = useRef()

  const [fieldToSearch, setFieldToSearch] = useState('Title')

  const [usersSuggestionOpen, setUsersSuggestionOpen] = useState(false)

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
      const response = await userStory.getStories(
        page,
        currentStateSelected,
        userQuery,
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
    userQuery
  ])

  useEffect(() => {
    const fetchStoryCount = async () => {
      const response = await userStory.getStoryCount(
        currentStateSelected,
        userQuery,
        productQuery,
        searchQuery
      )
      setStoryCount(response.data.data.userStoriesConnection.aggregate.count)
    }
    fetchStoryCount()
  }, [currentStateSelected, product, productQuery, searchQuery, userQuery])

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

  useEffect(() => {
    const fetchPolicyNotifications = async () => {
      const response = await userStory.getPolicyNotifications()
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
    await userStory.updateNotifications(policyUpdate.id, seenBy)
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
                {
                  <UsersSuggestionDropdown
                    isOpen={usersSuggestionOpen}
                    userTerm={userTerm}
                    setUserTerm={setUserTerm}
                    setUserQuery={setUserQuery}
                    setUsersSuggestionOpen={setUsersSuggestionOpen}
                  />
                }
                <input
                  type='text'
                  name='search'
                  placeholder='Search'
                  autoComplete='off'
                  value={fieldToSearch === 'Title' ? searchTerm : userTerm}
                  onChange={(event) => {
                    if (fieldToSearch === 'Title') {
                      setSearchTerm(event.target.value)
                    } else {
                      setUserTerm(event.target.value)
                      setUsersSuggestionOpen(true)
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      if (fieldToSearch === 'Title' && searchTerm.length > 0) {
                        setSearchQuery(`Title_contains: "${searchTerm}"`)
                      } else if (userTerm.length > 0) {
                        setUserQuery(userTerm)
                        setUsersSuggestionOpen(false)
                      }
                    }
                  }}
                  onFocus={() => {
                    if (fieldToSearch === 'Author' && userTerm.length > 0) {
                      setUsersSuggestionOpen(true)
                    }
                  }}
                />
                <div className='close-btn-div'>
                  <span
                    className='close-btn'
                    onClick={() => {
                      if (fieldToSearch === 'Title' && searchTerm.length > 0) {
                        setSearchTerm('')
                      } else if (userTerm.length > 0) {
                        setUserTerm('')
                      }
                    }}
                  >
                    {((fieldToSearch === 'Title' && searchTerm.length > 0) ||
                      (fieldToSearch === 'Author' && userTerm.length > 0)) && (
                      <i className='eos-icons'>close</i>
                    )}
                  </span>
                </div>
                <Dropdown
                  title=''
                  reference={fieldToSearchDropdownContainer}
                  curr={fieldToSearch}
                  setCurr={setFieldToSearch}
                  itemList={['Title', 'Author']}
                />
              </div>
              <Button
                type='submit'
                className='btn btn-default'
                onClick={() => {
                  if (fieldToSearch === 'Title' && searchTerm.length > 0) {
                    setSearchQuery(`Title_contains: "${searchTerm}"`)
                  } else if (userTerm.length > 0) {
                    setUserQuery(userTerm)
                  }
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
