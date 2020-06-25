import React, { useState, useEffect } from 'react'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import axios from 'axios'
import { apiURL } from '../config.json'

import Navigation from '../components/Navigation'
import Button from '../components/Button'
import Search from '../modules/TitleSearch'

const tempList = ['devesh vijaywargiya', 'aditya', 'Ola moom']

export const NewRequest = () => {
  const initialState = {
    title: '',
    category: '',
    description: '',
    mediaCollection: null
  }

  const [data, setData] = useState(initialState)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.post(`${apiURL}/graphql`, {
        query:
          "{\n  __type(name: 'ENUM_FEATUREREQUESTS_CATEGORY') {\n    enumValues {\n      name\n    }\n  }\n}"
      })
      setCategories(
        response.data.__type.enumValues.map((ele) => {
          return ele.name
        })
      )
    }
    fetchCategories()
  }, [])

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    })
  }

  const handleFileUpload = (event) => {
    setData({ ...data, mediaCollection: event.target.files })
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()
  }
  return (
    <>
      <div className='base-wrapper'>
        <div className='base-container'>
          <Navigation />
          <div className='home-content'>
            <h3>New Request</h3>
            <form className='form-default' onSubmit={handleFormSubmit}>
              <label htmlFor='title'>Title</label>
              <input
                className='input-default'
                type='text'
                name='title'
                onChange={handleInputChange}
              />
              <Search listToBeSearched={tempList} title={data.title} />
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
              <label htmlFor='media'>Upload Files</label>
              <input
                className='input-default'
                type='file'
                name='media'
                onChange={(e) => handleFileUpload(e)}
                multiple={true}
              />
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
        </div>
      </div>
    </>
  )
}

export default NewRequest
