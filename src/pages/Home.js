import React, { useState, useEffect, useRef } from 'react'
import Button from '../components/Button'
import StoriesList from '../components/StoriesList'
import LoadingIndicator from '../modules/LoadingIndicator'

import axios from 'axios'
import { apiURL } from '../config.json'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'

const stateList = [
  'Under Consideration',
  'Planned',
  'Design in progress',
  'Development in progress',
  'Testing',
  'Launched'
]

const Home = () => {
  const [currentStateSelected, selectState] = useState('Under Consideration')

  const [stories, setStories] = useState([])

  const productDropdownContainer = useRef()

  const [productDropdownState, setProductDropdownState] = useState(false)

  const [product, setProduct] = useState('All')

  const [products, setProducts] = useState([])

  const handleProductSelection = (value) => {
    setProduct(value)
    setProductDropdownState(false)
  }
  const handleProductDropdownState = (event) => {
    setProductDropdownState(!productDropdownState)
  }

  const { promiseInProgress } = usePromiseTracker()

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
    const fetchStories = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
            userStories(sort: "votes:desc,createdAt:desc") {
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
          }`
        },
        {
          withCredentials: true
        }
      )
      setStories(response.data.data.userStories)
    }
    trackPromise(fetchStories())
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
  }, [])

  return (
    <>
      <div className='base-wrapper'>
        <div className='base-container'>
          <div className='home-content'>
            <h3>Welcome to EOS User Stories</h3>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
            {promiseInProgress ? (
              <LoadingIndicator />
            ) : (
              <>
                <div
                  className='dropdown-container no-format'
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
                  {productDropdownState && (
                    <div className='dropdown-product'>
                      <ul>
                        <li onClick={() => handleProductSelection('All')}>
                          All
                        </li>
                        {products.map((item, key) => (
                          <li
                            key={key}
                            onClick={() => handleProductSelection(item.Name)}
                          >
                            {item.Name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
                <div className='flex flex-column'>
                  <StoriesList
                    stories={stories}
                    state={currentStateSelected}
                    product={product}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
