import React from 'react'
import ImageGallery from 'react-image-gallery'

const Gallery = ({ imageArray }) => {
  const images =
    imageArray?.map((attachment) => {
      return {
        original: attachment.url,
        thumbnail: attachment.url
        // originalHeight: 200,
        // originalWidth: 150
      }
    }) ?? []

  return imageArray.length !== 1 ? (
    <ImageGallery items={images} showBullets={true} lazyLoad={true} />
  ) : (
    <ImageGallery
      items={images}
      lazyLoad={true}
      showPlayButton={false}
      showThumbnails={false}
    />
  )
}

export default Gallery
