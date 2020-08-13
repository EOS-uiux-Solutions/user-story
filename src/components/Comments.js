import React, { useState, useEffect } from 'react'
import { Link } from '@reach/router'
import Button from './Button'
import axios from 'axios'
import { apiURL } from '../config.json'

const Comments = (props) => {
  const { storyId } = props

  const id = localStorage.getItem('id')

  const [comment, setComment] = useState('')

  const [fetchComments, setFetchComments] = useState(false)

  const [commentId, setCommentId] = useState()

  const [commentReply, setCommentReply] = useState('')

  const [comments, setComments] = useState([])

  const [repliesToggled, setRepliesToggled] = useState([])

  const [viewRepliesToggled, setViewRepliesToggled] = useState([])

  useEffect(() => {
    const fetchComments = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `
        query {
          userStory(id: "${storyId}") {
            user_story_comments {
              id
              Comments
              user {
                username
              }
              createdAt
              user_story_comment_replies {
                createdAt
                Comments
                user {
                  username
                }
              }
            }
          }
        }
        `
        },
        {
          withCredentials: true
        }
      )
      setComments(response.data.data.userStory.user_story_comments)
    }
    fetchComments()
  }, [storyId, fetchComments])

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
            id
            user {
              username
            }
            Comments
            createdAt
            user_story_comment_replies {
              createdAt
              Comments
              user {
                username
              }
            }
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

  const addCommentReply = async (event) => {
    event.preventDefault()
    await axios.post(
      `${apiURL}/graphql`,
      {
        query: `
      mutation {
        createUserStoryCommentThread (input: {
          data: {
            Comments: "${commentReply}"
            user_story_comment: "${commentId}"
            user: "${id}"
          }
        }){
          userStoryCommentThread {
            createdAt
          }
        }
      }
      `
      },
      { withCredentials: true }
    )
    setCommentReply('')
    setFetchComments((fetchComments) => !fetchComments)
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
                <div className='reply-action'>
                  <Button
                    className='btn btn-default'
                    onClick={() => {
                      setCommentId(data.id)
                      repliesToggled.find((item) => item === key + 1)
                        ? setRepliesToggled((repliesToggled) =>
                            repliesToggled.filter((item) => item !== key + 1)
                          )
                        : setRepliesToggled((repliesToggled) =>
                            repliesToggled.concat(key + 1)
                          )
                    }}
                  >
                    Reply
                  </Button>{' '}
                  {data.user_story_comment_replies.length > 0 ? (
                    <Button
                      className='btn btn-default'
                      onClick={() => {
                        viewRepliesToggled.find((item) => item === key + 1)
                          ? setViewRepliesToggled((viewRepliesToggled) =>
                              viewRepliesToggled.filter(
                                (item) => item !== key + 1
                              )
                            )
                          : setViewRepliesToggled((viewRepliesToggled) =>
                              viewRepliesToggled.concat(key + 1)
                            )
                      }}
                    >
                      View Replies ({data.user_story_comment_replies.length})
                    </Button>
                  ) : (
                    ''
                  )}
                </div>
                {viewRepliesToggled.find((item) => item === key + 1) &&
                  data.user_story_comment_replies.map((reply, key) => (
                    <div className='comment' key={key}>
                      <div className='user-avatar'>
                        <img
                          className='avatar'
                          src={`https://api.adorable.io/avatars/100/${reply.user.username}`}
                          alt='Default User Avatar'
                        ></img>
                      </div>
                      <div className='comment-content'>
                        <Link className='link link-default' to='#'>
                          {reply.user.username}
                        </Link>
                        <div className='metadata'>
                          {
                            <div>
                              {`${reply.createdAt.slice(
                                0,
                                10
                              )}  ${reply.createdAt.slice(11, 19)}`}
                            </div>
                          }
                        </div>
                        <p>{reply.Comments}</p>
                      </div>
                    </div>
                  ))}
                {repliesToggled.find((item) => item === key + 1) && (
                  <form className='comment-form'>
                    <div className='field'>
                      <textarea
                        rows='4'
                        cols='16'
                        value={commentReply}
                        onChange={(e) => setCommentReply(e.target.value)}
                      ></textarea>
                    </div>
                    <Button
                      className='btn btn-default'
                      onClick={addCommentReply}
                    >
                      Add Reply
                    </Button>
                  </form>
                )}
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
