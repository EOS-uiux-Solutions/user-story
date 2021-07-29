import React from 'react'
import Skeleton from 'react-loading-skeleton'

const ProductSkeleton = () => {
  return (
    <div className='flex flex-row flex-center product-card'>
      <div className='flex flex-center'>
        <div className='product-logo'>
          <Skeleton height={56} />
        </div>
      </div>
      <div className='circle-container'>
        <div className='circle'></div>
      </div>
    </div>
  )
}

const ProductCard = ({ product, selected, setProduct }) => {
  return (
    <div
      className={`flex flex-center flex-align-center product-card ${
        selected ? 'product-card-selected' : ''
      }`}
      data-cy={`${product.Name.split(' ').join('-')}-card`}
      onClick={() => {
        if (!selected) {
          setProduct(product.Name)
        } else {
          setProduct('All')
        }
      }}
    >
      <div className='flex flex-center'>
        <div className='flex flex-center product-logo'>
          <img src={product.logo?.url} alt={`${product.Name} logo`} />
        </div>
      </div>
      <div className='circle-container'>
        <div className='circle'></div>
      </div>
    </div>
  )
}

const ProductSelect = ({ product, products, setProduct }) => {
  return (
    <div className='product-select-container'>
      <h4>Select a Product</h4>
      <div className='flex flex-row flex-center product-select'>
        {!products && [1, 2, 3].map((i) => <ProductSkeleton key={i} />)}
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

export default ProductSelect
