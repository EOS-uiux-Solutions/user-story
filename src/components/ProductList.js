import React, { useState, useEffect, useRef } from 'react'
import userStory from '../services/user_story'
import Dropdown from './Dropdown'

const ProductList = ({ setProductQuery }) => {
  const productsContainer = useRef()

  const [product, setProduct] = useState('All')

  const [products, setProducts] = useState(['All'])

  const productsList = [...products].reduce(
    (acc, cur) => [...acc, cur.Name],
    ['All']
  )

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await userStory.getProducts()
      return response.data.data.product !== null
        ? setProducts([...response.data.data.products])
        : setProducts([])
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    if (product !== 'All') {
      setProductQuery(`product : {Name: "${product}"}`)
    } else {
      setProductQuery(``)
    }
  }, [product, setProductQuery])

  return (
    <>
      <Dropdown
        title='Products'
        reference={productsContainer}
        curr={product}
        setCurr={setProduct}
        itemList={productsList}
      />
    </>
  )
}

export default ProductList
