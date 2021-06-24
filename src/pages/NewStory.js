import React, { useLayoutEffect, useState, useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'

import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import axios from 'axios'
import { apiURL } from '../config.json'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'
import { Helmet } from 'react-helmet'

import FormError from '../components/FormError'
import Navigation from '../components/Navigation'
import LoadingIndicator from '../modules/LoadingIndicator'
import Button from '../components/Button'
import Search from '../modules/TitleSearch'
import Dragdrop from '../components/Dragdrop'
import { navigate } from '@reach/router'
import Context from '../modules/Context'
import Login from './Login'

const mdParser = new MarkdownIt().set({ html: true })

const initialDescriptionInputsValue = {
  None: ''
}

const filterDescriptionText = (text) => {
  text = text.replace(/"/g, '\\"') // Replace all occurences of " with \"
  text = text.replace(/[\r\n]/g, '') // Remove the line endings
  return text
}

const NewStory = () => {
  const { state } = useContext(Context)

  const { register, handleSubmit, errors, watch } = useForm()

  const [currentProductSelected, setCurrentProductSelected] = useState('None')

  const [descriptionError, setDescriptionError] = useState(false)

  const [descriptionInputs, setDescriptionInputs] = useState(
    initialDescriptionInputsValue
  )

  const [description, setDescription] = useState('')

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
            user_story_template {
              Name
              Template
            }
          }
        }`
        },
        {
          withCredentials: true
        }
      )
      const { products } = response.data.data
      setProducts(products)
      const productToTemplateTextMap = {}
      products.forEach((product) => {
        productToTemplateTextMap[product.id] =
          product.user_story_template?.Template ?? ''
      })
      setDescriptionInputs({
        ...initialDescriptionInputsValue,
        ...productToTemplateTextMap
      })
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
  const handleProductSelectChange = (event) => {
    const id = event.target.value
    const selectedProduct = products.find((product) => product.id === id)
    setCurrentProductSelected(selectedProduct?.id ?? 'None')
  }

  const onSubmit = async (data) => {
    if (description === undefined || description.length <= 0) {
      setDescriptionError(true)
      return
    }
    data.description = filterDescriptionText(description)
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
                user_story_status: "60b5cef600971013c4f269c2"
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

  return state.auth ? (
    <>
      <Helmet>
        <title>New story | EOS User story</title>
        <meta name='robots' content='noindex' />
      </Helmet>
      <Navigation />
      {promiseInProgress ? (
        <LoadingIndicator />
      ) : (
        <div className='body-content'>
          <div className='flex flex-row body-wrapper'>
            <div className='newstory'>
              <h3>New Story</h3>
              <form className='form-default' onSubmit={handleSubmit(onSubmit)}>
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
                    onChange={handleProductSelectChange}
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
                  {errors.category && <FormError type={errors.category.type} />}
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
                  {errors.priority && <FormError type={errors.priority.type} />}
                </div>
                <div className='form-element'>
                  <label htmlFor='description'>Description</label>
                  <MdEditor
                    plugins={[
                      'header',
                      'font-bold',
                      'font-italic',
                      'list-unordered',
                      'list-ordered',
                      'link',
                      'mode-toggle'
                    ]}
                    style={{ height: '350px' }}
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={({ html, text }) => {
                      setDescription(html)
                      setDescriptionError(false)
                      const result = {}
                      result[currentProductSelected] = text
                      setDescriptionInputs({
                        ...descriptionInputs,
                        ...result
                      })
                    }}
                    value={descriptionInputs[currentProductSelected]}
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
        </div>
      )}
    </>
  ) : (
    <Login message='Please login to create a new story' />
  )
}

export default NewStory
