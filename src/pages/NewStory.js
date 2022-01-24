import React, { useLayoutEffect, useState, useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import MarkdownEditor from '../components/MarkdownEditor'
import { filterDescriptionText } from '../utils/filterText'
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

import userStory from '../services/user_story'

const initialDescriptionInputsValue = {
  None: ''
}

const NewStory = () => {
  const { state } = useContext(Context)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()

  const [currentProductSelected, setCurrentProductSelected] = useState('None')

  const [descriptionError, setDescriptionError] = useState(false)

  const [descriptionInputs, setDescriptionInputs] = useState(
    initialDescriptionInputsValue
  )

  const [description, setDescription] = useState('')

  const [categories, setCategories] = useState([])

  const [priorities, setPriorities] = useState([])

  const [products, setProducts] = useState([])

  const { promiseInProgress } = usePromiseTracker()

  const [screenSize, setScreenSize] = useState(0)

  const [attachments, setAttachments] = useState([])

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
      const response = await userStory.getCategories()

      setCategories(
        response.data.data.__type.enumValues.map((ele) => {
          return ele.name
        })
      )
    }

    trackPromise(fetchCategories())

    const fetchProducts = async () => {
      const response = await userStory.getProductsWithTemplates()
      const { products } = response.data.data
      setProducts(products)
      const productToTemplateTextMap = {}
      products.forEach((product) => {
        productToTemplateTextMap[product.id] = product.product_template ?? ''
      })
      setDescriptionInputs({
        ...initialDescriptionInputsValue,
        ...productToTemplateTextMap
      })
    }

    trackPromise(fetchProducts())

    const fetchPriorities = async () => {
      const response = await userStory.getPriorities()

      setPriorities(
        response.data.data.__type.enumValues.map((ele) => {
          return ele.name
        })
      )
    }

    trackPromise(fetchPriorities())
  }, [])

  const handleProductSelectChange = (event) => {
    const id = event.target.value
    const selectedProduct = products.find((product) => product.id === id)
    setCurrentProductSelected(selectedProduct?.id ?? 'None')
  }

  const descError = () => {
    if (!description?.length) {
      setDescriptionError(true)
    }
  }

  const onSubmit = async (data) => {
    data.Description = filterDescriptionText(description)
    const formData = new FormData()
    formData.append('data', JSON.stringify(data))
    if (attachments.length) {
      attachments.forEach((file) => {
        formData.append('files.Attachment', file)
      })
    }
    await userStory.createStory(formData)
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
                    data-cy='title'
                    autoComplete='off'
                    {...register('Title', {
                      required: 'Title cannot be empty'
                    })}
                  />
                  {errors.Title && <FormError message={errors.Title.message} />}
                </div>
                {screenSize <= 1120 ? <Search title={watch('Title')} /> : ''}
                <div className='form-element'>
                  <label htmlFor='product'>Product</label>
                  <select
                    className='select-default'
                    data-cy='product'
                    onChange={handleProductSelectChange}
                    {...register('product', {
                      required: 'Product must be set'
                    })}
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
                  {errors.product && (
                    <FormError message={errors.product.message} />
                  )}
                </div>
                <div className='form-element'>
                  <label htmlFor='category'>Category</label>
                  <select
                    className='select-default'
                    data-cy='category'
                    {...register('Category', {
                      required: 'Category must be set'
                    })}
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
                  {errors.Category && (
                    <FormError message={errors.Category.message} />
                  )}
                </div>
                <div className='form-element'>
                  <label htmlFor='priority'>Priority</label>
                  <select
                    className='select-default'
                    data-cy='priority'
                    {...register('Priority', {
                      required: 'Priority must be set'
                    })}
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
                  {errors.Priority && (
                    <FormError message={errors.Priority.message} />
                  )}
                </div>
                <div className='form-element' data-cy='description-editor'>
                  <label htmlFor='description'>Description</label>
                  <MarkdownEditor
                    callback={(html, text) => {
                      const result = {}
                      result[currentProductSelected] = text
                      setDescription(html)
                      setDescriptionError(false)
                      setDescriptionInputs({
                        ...descriptionInputs,
                        ...result
                      })
                    }}
                    value={descriptionInputs[currentProductSelected]}
                  />
                  {descriptionError && <FormError type='emptyDescription' />}
                </div>
                <Dragdrop
                  attachments={attachments}
                  setAttachments={setAttachments}
                />
                <div className='flex flex-row flex-center'>
                  <Button
                    type='submit'
                    data-cy='btn-submit'
                    className='btn btn-default'
                    onClick={descError}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
            {screenSize > 1120 ? <Search title={watch('Title')} /> : ''}
          </div>
        </div>
      )}
    </>
  ) : (
    <Login message='Please login to create a new story' />
  )
}

export default NewStory
