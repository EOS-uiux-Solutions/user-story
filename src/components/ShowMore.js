import React, { useState } from 'react'
import Button from './Button'

const ShowMore = ({ txt, textLength, maxCharacterLimit = 350 }) => {
  const text = txt

  const [isTruncated, setIsTruncated] = useState(true)

  const resultString = isTruncated ? text.slice(0, maxCharacterLimit) : text

  const toggleIsTruncated = () => {
    setIsTruncated(!isTruncated)
  }

  return (
    <>
      {textLength <= maxCharacterLimit ? (
        <div
          dangerouslySetInnerHTML={{ __html: resultString }}
          className='story-description flex-column'
          data-cy='story-description'
        />
      ) : (
        <div className='flex flex-column story-description'>
          <div
            dangerouslySetInnerHTML={{ __html: resultString }}
            data-cy='story-description'
          />
          <Button
            className='btn btn-transparent btn-reply'
            onClick={toggleIsTruncated}
          >
            {' '}
            {isTruncated ? 'Show More' : 'Show Less'}{' '}
          </Button>
        </div>
      )}
    </>
  )
}

export default ShowMore
