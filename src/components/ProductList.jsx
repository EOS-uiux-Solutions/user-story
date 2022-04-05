import React, { useState, useEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import userStory from '../services/user_story'
import { useLocation } from '@reach/router'
import queryString from 'query-string'

const ProductSkeleton = () => {
  return (
    <div className='flex flex-row flex-center product-card'>
      <div className='product-logo'>
        <Skeleton height={80} />
      </div>
      <div className='circle-container'>
        <div className='circle'></div>
      </div>
    </div>
  )
}

const ProductCard = ({ product, selected, setProduct }) => {
  const location = useLocation()

  useEffect(() => {
    const param = queryString.parse(location.search)
    if (param.product) setProduct(param.product)
  }, [location, setProduct])

  return (
    <div
      className={`flex flex-center flex-align-center product-card ${
        selected ? 'product-card-selected' : ''
      }`}
      data-cy={`${product.Name.split(' ').join('-')}-card`}
      onClick={() => {
        if (!selected) {
          setProduct(product.Name)
          window.history.pushState(null, null, `?product=${product.Name}`)
        } else {
          setProduct('All')
        }
      }}
    >
      <div className='product-logo'>
        <img src={product.logo?.url} alt={`${product.Name} logo`} />
      </div>
      <div className='circle-container'>
        <div className='circle'></div>
      </div>
    </div>
  )
}

const ProductList = ({ setProductQuery }) => {
  const [productCount, setProductCount] = useState(3)

  const [product, setProduct] = useState('All')

  const [products, setProducts] = useState(null)

  useEffect(() => {
    const fetchProductCount = async () => {
      const response = await userStory.getProductCount()
      setProductCount(response.data.data.productsConnection.aggregate.count)
    }
    const fetchProducts = async () => {
      const response = await userStory.getProducts()
      return response.data.data.product !== null
        ? setProducts([...response.data.data.products])
        : setProducts([])
    }
    fetchProductCount()
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
    <div className='product-list-container'>
      <h4>Select a Product</h4>
      <div className='flex flex-row flex-center product-list'>
        {!products &&
          Array(productCount)
            .fill()
            .map((_, index) => <ProductSkeleton key={index} />)}
        {products !== null &&
          products.map((p) => (
            <ProductCard
              key={p.Name}
              product={p}
              selected={p.Name === product}
              setProduct={setProduct}
            />
          ))}
      </div>
    </div>
  )
}

export default ProductList
