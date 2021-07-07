import React, { useState, useEffect, useContext } from 'react'
import { Link } from '@reach/router'
import Button from './Button'
import { useForm } from 'react-hook-form'

import Context from '../modules/Context'
import FormError from '../components/FormError'
import userStory from '../services/user_story'

const Comments = (props) => {
  const { storyId } = props

  const {
    register: registerComment,
    errors: errorsComment,
    handleSubmit: handleSubmitComment
  } = useForm()

  const {
    register: registerReply,
    errors: errorsReply,
    handleSubmit: handleSubmitReply
  } = useForm()

  const { state } = useContext(Context)

  const id = localStorage.getItem('id')

  const [comment, setComment] = useState('')

  const [fetchComments, setFetchComments] = useState(false)

  const [commentId, setCommentId] = useState()

  const [commentReply, setCommentReply] = useState('')

  const [comments, setComments] = useState([])

  const [repliesToggled, setRepliesToggled] = useState()

  const [viewRepliesToggled, setViewRepliesToggled] = useState([])

  useEffect(() => {
    const fetchComments = async () => {
      const response = await userStory.getComments(storyId)
      setComments(response.data.data.userStory.user_story_comments)
    }
    fetchComments()
  }, [storyId, fetchComments])

  const addComment = async (data) => {
    const response = await userStory.postComment(data.addComment, storyId, id)
    setComments([
      ...comments,
      response.data.data.createUserStoryComment.userStoryComment
    ])
    setComment('')
  }

  const addCommentReply = async (data) => {
    await userStory.postCommentReply(data.addReply, commentId, id)
    setCommentReply('')
    setFetchComments((fetchComments) => !fetchComments)
    setRepliesToggled(null)
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
                  src={`https://avatars.dicebear.com/api/jdenticon/${data.user.username}.svg`}
                  alt='Default User Avatar'
                ></img>
              </div>
              <div className='comment-content' data-cy='comment-content'>
                <Link
                  className='link link-default'
                  data-cy='comment-username'
                  to={`/profile/${data.user.id}`}
                >
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
                  {state.auth && (
                    <Button
                      className='btn btn-default'
                      onClick={() => {
                        setCommentId(data.id)
                        repliesToggled === key + 1
                          ? setRepliesToggled(null)
                          : setRepliesToggled(key + 1)
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
                      Reply
                    </Button>
                  )}
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
                          src={`https://avatars.dicebear.com/api/jdenticon/${reply.user.username}.svg`}
                          alt='Default User Avatar'
                        ></img>
                      </div>
                      <div className='comment-content'>
                        <Link
                          className='link link-default'
                          to={`/profile/${data.user.id}`}
                        >
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
                {repliesToggled === key + 1 && state.auth && (
                  <form
                    className='comment-form'
                    onSubmit={handleSubmitReply(addCommentReply)}
                  >
                    <div className='field'>
                      <textarea
                        rows='4'
                        cols='16'
                        name='addReply'
                        ref={registerReply({ required: true })}
                        value={commentReply}
                        onChange={(e) => setCommentReply(e.target.value)}
                      ></textarea>
                      {errorsReply.addReply && (
                        <FormError message='Reply cannot be empty' />
                      )}
                    </div>
                    <Button className='btn btn-default'>Add Reply</Button>
                  </form>
                )}
              </div>
            </div>
          )
        })
      ) : (
        <h3>No comments yet</h3>
      )}
      {state.auth && (
        <form
          className='comment-form'
          onSubmit={handleSubmitComment(addComment)}
        >
          <div className='field'>
            <textarea
              rows='4'
              name='addComment'
              data-cy='comment-input'
              cols='16'
              ref={registerComment({ required: true })}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            {errorsComment.addComment && (
              <FormError message='Comment cannot be empty' />
            )}
          </div>
          <Button className='btn btn-default' data-cy='btn-comment'>
            Add Comment
          </Button>
        </form>
      )}
    </div>
  )
}

export default Comments
