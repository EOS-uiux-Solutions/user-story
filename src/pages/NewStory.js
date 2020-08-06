import React, { useState, useEffect } from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import axios from 'axios'
import { apiURL } from '../config.json'
import { trackPromise, usePromiseTracker } from 'react-promise-tracker'

import Navigation from '../components/Navigation'
import LoadingIndicator from '../modules/LoadingIndicator'
import Button from '../components/Button'
import Search from '../modules/TitleSearch'
import Dragdrop from '../components/Dragdrop'
import { navigate } from '@reach/router'

const NewStory = () => {
  const initialState = {
    title: '',
    product: '',
    category: '',
    description: '',
    mediaCollection: null
  }

  const [data, setData] = useState(initialState)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [storiesData, setStoriesData] = useState([])

  const { promiseInProgress } = usePromiseTracker()

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
    trackPromise(fetchStoriesData())
  }, [])

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    })
  }

  /*
  const handleFileUpload = (event) => {
    setData({ ...data, mediaCollection: event.target.files })
  }
  feature coming in next PR
  */

  const handleFormSubmit = async (event) => {
    event.preventDefault()
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

  return (
    <>
      <div className='base-wrapper'>
        <div className='base-container'>
          <Navigation />
          {promiseInProgress ? (
            <LoadingIndicator />
          ) : (
            <div className='newstory-content'>
              <h3>New Story</h3>
              <form className='form-default' onSubmit={handleFormSubmit}>
                <label htmlFor='title'>Title</label>
                <input
                  className='input-default'
                  type='text'
                  name='title'
                  onChange={handleInputChange}
                  autoComplete='off'
                />
                <Search listToBeSearched={storiesData} title={data.title} />
                <label htmlFor='product'>Product</label>
                <select
                  className='select-default'
                  name='product'
                  onChange={handleInputChange}
                >
                  <option defaultValue={true}>Select a product</option>
                  {products &&
                    products.map((ele, key) => {
                      return (
                        <option key={key} value={ele.id}>
                          {ele.Name}
                        </option>
                      )
                    })}
                </select>
                <label htmlFor='category'>Category</label>
                <select
                  className='select-default'
                  name='category'
                  onChange={handleInputChange}
                >
                  <option defaultValue={true}>Select a category</option>
                  {categories &&
                    categories.map((ele, key) => {
                      return (
                        <option key={key} value={ele}>
                          {ele}
                        </option>
                      )
                    })}
                </select>
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
                    const response = editor.getData()
                    setData({
                      ...data,
                      description: response
                    })
                  }}
                />
                <Dragdrop />
                <div className='flex flex-row flex-center'>
                  <Button
                    type='submit'
                    className='btn btn-default'
                    disabled={data.isSubmitting}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default NewStory
