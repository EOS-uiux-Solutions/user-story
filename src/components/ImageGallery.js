import React from 'react'
import ImageGallery from 'react-image-gallery'

const Gallery = ({ imageArray }) => {
  const images =
    imageArray?.map((attachment) => {
      return {
        original: attachment.url,
        thumbnail: attachment.url
      }
    }) ?? []

  return <ImageGallery items={images} showBullets={true} />
}

export default Gallery
