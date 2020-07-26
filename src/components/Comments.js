import React, { useState } from 'react'
import { Link } from '@reach/router'
import Button from './Button'
import axios from 'axios'
import { apiURL } from '../config.json'

const Comments = (props) => {
  const { storyId } = props

  const id = localStorage.getItem('id')

  const [comment, setComment] = useState('')

  const [comments, setComments] = useState(props.comments)

  const addComment = async (event) => {
    event.preventDefault()
    const response = await axios.post(
      `${apiURL}/graphql`,
      {
        query: `
      mutation {
        createUserStoryComment(input: {
          data: {
            Comments: "${comment}"
            user_story: "${storyId}"
            user: "${id}"
          }
        }) {
          userStoryComment {
            user {
              username
            }
            Comments
            createdAt
          }
        }
      }
      `
      },
      {
        withCredentials: true
      }
    )
    setComments([
      ...comments,
      response.data.data.createUserStoryComment.userStoryComment
    ])
    setComment('')
  }

  return (
    <div className='comments-wrapper'>
      <h3>Comments</h3>
      {comments.length ? (
        comments.map((data, key) => {
          return (
            <div className='comment' key={key}>
              <div className='user-avatar'>
                <img
                  className='avatar'
                  src={`https://api.adorable.io/avatars/100/${data.user.username}`}
                  alt='Default User Avatar'
                ></img>
              </div>
              <div className='comment-content'>
                <Link className='link link-default' to='#'>
                  {data.user.username}
                </Link>
                <div className='metadata'>
                  <div>
                    {`${data.createdAt.slice(0, 10)}  ${data.createdAt.slice(
                      11,
                      19
                    )}`}
                  </div>
                </div>
                <p>{data.Comments}</p>
              </div>
            </div>
          )
        })
      ) : (
        <h3>No comments yet</h3>
      )}
      <form className='comment-form'>
        <div className='field'>
          <textarea
            rows='4'
            cols='16'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>
        <Button className='btn btn-default' onClick={addComment}>
          Add Comment
        </Button>
      </form>
    </div>
  )
}

export default Comments
