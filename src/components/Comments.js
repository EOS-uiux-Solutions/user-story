import React, { useState, useEffect, useContext } from 'react'
import { Link } from '@reach/router'
import Button from './Button'

import CommentForm from './CommentForm'
import Context from '../modules/Context'
import userStory from '../services/user_story'

const Comments = (props) => {
  const { storyId } = props

  const { state } = useContext(Context)

  const id = localStorage.getItem('id')

  const [comment, setComment] = useState('')

  const [fetchComments, setFetchComments] = useState(false)

  const [commentId, setCommentId] = useState()

  const [commentReply, setCommentReply] = useState('')

  const [comments, setComments] = useState([])

  const [repliesToggled, setRepliesToggled] = useState()

  const [viewRepliesToggled, setViewRepliesToggled] = useState([])

  const [attachments, setAttachments] = useState([])

  const [replyAttachments, setReplyAttachments] = useState([])

  useEffect(() => {
    const fetchStoryComments = async () => {
      const response = await userStory.getComments(storyId)
      setComments(response.data.data.userStory.user_story_comments)
    }
    fetchStoryComments()
  }, [storyId, fetchComments])

  useEffect(
    () => () => {
      attachments.forEach((file) => URL.revokeObjectURL(file.preview))
    },
    [attachments]
  )

  useEffect(
    () => () => {
      replyAttachments.forEach((file) => URL.revokeObjectURL(file.preview))
    },
    [replyAttachments]
  )

  const addComment = async (data) => {
    const formData = new FormData()
    data.user = id
    data.user_story = storyId
    formData.append('data', JSON.stringify(data))

    if (attachments.length) {
      attachments.forEach((file) => {
        formData.append('files.attachment', file)
      })
    }

    await userStory.postComment(formData)
    setComment('')
    setAttachments([])
  }

  const addCommentReply = async (data) => {
    const formData = new FormData()

    data.user = id
    data.user_story_comment = commentId
    formData.append('data', JSON.stringify(data))

    if (replyAttachments.length) {
      replyAttachments.forEach((file) => {
        formData.append('files.attachment', file)
      })
    }

    await userStory.postCommentReply(formData)
    setCommentReply('')
    setReplyAttachments([])
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
                <div>
                  {Comments.Attachment?.map((obj) => (
                    <img src={obj.url} alt='attachment' key={obj.id} />
                  ))}
                </div>
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
                        {reply.attachment &&
                          reply.attachment.map((a) => (
                            <img src={a.url} key={a.id} alt='' width='100' />
                          ))}

                        {repliesToggled === key + 1 && state.auth && (
                          <CommentForm
                            attachments={replyAttachments}
                            setAttachments={setReplyAttachments}
                            addComment={addCommentReply}
                            comment={commentReply}
                            setComment={setCommentReply}
                            submitButtonText={'Add Reply'}
                          />
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )
        })
      ) : (
        <h3>No comments yet</h3>
      )}
      {state.auth && (
        <div>
          <CommentForm
            attachments={attachments}
            setAttachments={setAttachments}
            addComment={addComment}
            comment={comment}
            setComment={setComment}
            submitButtonText={'Add Comment'}
          />
        </div>
      )}
    </div>
  )
}

export default Comments
