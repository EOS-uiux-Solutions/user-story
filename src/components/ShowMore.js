import React, { useState } from 'react'
import Button from './Button'
import ReactHtmlParser from 'react-html-parser'

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
          className='story-description flex-column'
          data-cy='story-description'
        >
          {ReactHtmlParser(resultString)}
        </div>
      ) : (
        <div className='flex flex-column story-description'>
          <div data-cy='story-description'>{ReactHtmlParser(resultString)}</div>
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
