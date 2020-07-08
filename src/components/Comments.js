import React from 'react'
import { Link } from '@reach/router'

import Button from './Button'

const tempCommentsData = [
  {
    author: 'Matt',
    metadata: '12/04/2020 8:42am',
    text: 'How artistic!'
  },
  {
    author: 'Elliot',
    metadata: '12/05/2020 9:00am',
    text: 'This has been very useful for my research.'
  },
  {
    author: 'Joe',
    metadata: '15/04/2020 10:00am',
    text: 'Dude, this is awesome. Thanks so much'
  }
]

const Comments = () => {
  return (
    <div className='comments-content'>
      <div className='comments-wrapper'>
        <h3>Comments</h3>
        {tempCommentsData.map((data, key) => {
          return (
            <div className='comment' key={key}>
              <div className='user-avatar'></div>
              <div className='comment-content'>
                <Link className='link link-default' to='#'>
                  {data.author}
                </Link>
                <div className='metadata'>
                  <div>{data.metadata}</div>
                </div>
                <div className='text'>{data.text}</div>
                <div className='actions'>
                  <Link className='link link-default' to='#'>
                    Reply
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
        <form className='comment-form'>
          <div className='field'>
            <textarea rows='4'></textarea>
          </div>
          <Button className='btn btn-default'>Add Reply</Button>
        </form>
      </div>
    </div>
  )
}

export default Comments
