import React, { useLayoutEffect, useState, useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'

import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import axios from 'axios'
import { apiURL } from '../config.json'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'

import FormError from '../components/FormError'
import Navigation from '../components/Navigation'
import LoadingIndicator from '../modules/LoadingIndicator'
import Button from '../components/Button'
import Search from '../modules/TitleSearch'
import Dragdrop from '../components/Dragdrop'
import { navigate } from '@reach/router'
import Context from '../modules/Context'
import Login from './Login'

const NewStory = () => {
  const { state } = useContext(Context)

  const { register, handleSubmit, errors, setValue, watch } = useForm()

  const [descriptionError, setDescriptionError] = useState(false)

  const [categories, setCategories] = useState([])

  const [priorities, setPriorities] = useState([])

  const [products, setProducts] = useState([])

  const [storiesData, setStoriesData] = useState([])

  const { promiseInProgress } = usePromiseTracker()

  const [screenSize, setScreenSize] = useState(0)

  useLayoutEffect(() => {
    function updateScreenSize() {
      setScreenSize(window.innerWidth)
    }
    window.addEventListener('resize', updateScreenSize)
    updateScreenSize()
    return () => window.removeEventListener('resize', updateScreenSize)
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
    }

    trackPromise(fetchCategories())

    const fetchProducts = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
          products {
            id
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

    const fetchPriorities = async () => {
      const response = await axios.post(`${apiURL}/graphql`, {
        query: `query {
          __type(name: "ENUM_USERSTORY_PRIORITY") {
            enumValues {
              name
            }
          }
        }`
      })

      setPriorities(
        response.data.data.__type.enumValues.map((ele) => {
          return ele.name
        })
      )
    }

    trackPromise(fetchPriorities())

    const fetchStoriesData = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
            userStories(sort: "votes:desc,createdAt:desc") {
              id
              Title
              Description
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
      setStoriesData(response.data.data.userStories)
    }
    fetchStoriesData()
  }, [])

  /*
  const handleFileUpload = (event) => {
    setData({ ...data, mediaCollection: event.target.files })
  }
  feature coming in next PR
  */

  const onSubmit = async (data) => {
    if (data.description === undefined || data.description.length === 0) {
      setDescriptionError(true)
      return
    }
    await axios.post(
      `${apiURL}/graphql`,
      {
        query: `mutation {
          createUserStory(
            input: {
              data: {
                Description: "${data.description}"
                Title: "${data.title}"
                Category: ${data.category}
                user_story_status: "5f0f33205f5695666b0d2e7e"
                product: "${data.product}"
                Priority: ${data.priority}
              }
            }
          ) {
            userStory {
              createdAt
            }
          }
        }
        `
      },
      { withCredentials: true }
    )
    navigate('/')
  }
  useEffect(() => {
    register('description')
  })

  return state.auth ? (
    <>
      <div className='base-wrapper'>
        <div className='base-container'>
          <Navigation />
          {promiseInProgress ? (
            <LoadingIndicator />
          ) : (
            <div className='flex flex-row newstory-content'>
              <div className='newstory'>
                <h3>New Story</h3>
                <form
                  className='form-default'
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className='form-element'>
                    <label htmlFor='title'>Title</label>
                    <input
                      className='input-default'
                      type='text'
                      name='title'
                      autoComplete='off'
                      ref={register({ required: true })}
                    />
                    {errors.title && <FormError type={errors.title.type} />}
                  </div>
                  {screenSize <= 1120 ? (
                    <Search
                      listToBeSearched={storiesData}
                      title={watch('title') || ''}
                    />
                  ) : (
                    ''
                  )}
                  <div className='form-element'>
                    <label htmlFor='product'>Product</label>
                    <select
                      className='select-default'
                      name='product'
                      ref={register({ required: true })}
                    >
                      <option defaultValue={true} value=''>
                        Select a product
                      </option>
                      {products &&
                        products.map((ele, key) => {
                          return (
                            <option key={key} value={ele.id}>
                              {ele.Name}
                            </option>
                          )
                        })}
                    </select>
                    {errors.product && <FormError type={errors.product.type} />}
                  </div>
                  <div className='form-element'>
                    <label htmlFor='category'>Category</label>
                    <select
                      className='select-default'
                      name='category'
                      ref={register({ required: true })}
                    >
                      <option defaultValue={true} value=''>
                        Select a category
                      </option>
                      {categories &&
                        categories.map((ele, key) => {
                          return (
                            <option key={key} value={ele}>
                              {ele}
                            </option>
                          )
                        })}
                    </select>
                    {errors.category && (
                      <FormError type={errors.category.type} />
                    )}
                  </div>
                  <div className='form-element'>
                    <label htmlFor='priority'>Priority</label>
                    <select
                      className='select-default'
                      name='priority'
                      ref={register({ required: true })}
                    >
                      <option defaultValue={true} value=''>
                        Select priority
                      </option>
                      {priorities &&
                        priorities.map((ele, key) => {
                          return (
                            <option key={key} value={ele}>
                              {ele}
                            </option>
                          )
                        })}
                    </select>
                    {errors.priority && (
                      <FormError type={errors.priority.type} />
                    )}
                  </div>
                  <div className='form-element'>
                    <label htmlFor='description'>Description</label>
                    <CKEditor
                      editor={ClassicEditor}
                      config={{
                        toolbar: [
                          'heading',
                          '|',
                          'bold',
                          'italic',
                          '|',
                          'link',
                          'bulletedList',
                          'numberedList'
                        ]
                      }}
                      onChange={(event, editor) => {
                        setValue('description', editor.getData())
                        setDescriptionError(false)
                      }}
                      ref={register}
                    />
                    {descriptionError && <FormError type='emptyDescription' />}
                  </div>
                  <Dragdrop />
                  <div className='flex flex-row flex-center'>
                    <Button type='submit' className='btn btn-default'>
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
              {screenSize > 1120 ? (
                <Search
                  listToBeSearched={storiesData}
                  title={watch('title') || ''}
                />
              ) : (
                ''
              )}
            </div>
          )}
        </div>
      </div>
    </>
  ) : (
    <Login message='Please login to create a new story' />
  )
}

export default NewStory
