import React, { useState, useEffect, useContext, useCallback } from 'react'
import { Link } from '@reach/router'
import Button from './Button'
import Gallery from './ImageGallery'
import moment from 'moment'
import CommentForm from './CommentForm'
import Context from '../modules/Context'
import userStory from '../services/user_story'

const attachFiles = (formData, attachments) => {
  if (attachments.length) {
    attachments.forEach((file) => {
      formData.append('files.attachment', file)
    })
  }
}

const toggleReplyForm = (repliesToggled, setRepliesToggled, key) => {
  repliesToggled === key + 1
    ? setRepliesToggled(null)
    : setRepliesToggled(key + 1)
}

const toggleViewReplies = (viewRepliesToggled, setViewRepliesToggled, key) => {
  viewRepliesToggled.find((item) => item === key + 1)
    ? setViewRepliesToggled((viewRepliesToggled) =>
        viewRepliesToggled.filter((item) => item !== key + 1)
      )
    : setViewRepliesToggled((viewRepliesToggled) =>
        viewRepliesToggled.concat(key + 1)
      )
}

const Comments = (props) => {
  const { storyId } = props

  const { state } = useContext(Context)

  const id = localStorage.getItem('id')

  const [comment, setComment] = useState('')

  const [commentId, setCommentId] = useState()

  const [commentReply, setCommentReply] = useState('')

  const [comments, setComments] = useState([])

  const [repliesToggled, setRepliesToggled] = useState()

  const [viewRepliesToggled, setViewRepliesToggled] = useState([])

  const [attachments, setAttachments] = useState([])

  const [replyAttachments, setReplyAttachments] = useState([])

  const fetchStoryComments = useCallback(async () => {
    const response = await userStory.getComments(storyId)
    setComments(response.data.data.userStory.user_story_comments)
  }, [storyId])

  useEffect(() => {
    fetchStoryComments()
  }, [fetchStoryComments])

  useEffect(
    () => () => {
      attachments.forEach((file) => URL.revokeObjectURL(file.preview))
      replyAttachments.forEach((file) => URL.revokeObjectURL(file.preview))
    },
    [attachments, replyAttachments]
  )

  const addComment = async (data) => {
    const formData = new FormData()
    data.user = id
    data.user_story = storyId
    formData.append('data', JSON.stringify(data))

    attachFiles(formData, attachments)

    await userStory.postComment(formData)

    setComment('')
    setAttachments([])

    fetchStoryComments()
  }

  const addCommentReply = async (data) => {
    const formData = new FormData()

    data.user = id
    data.user_story_comment = commentId
    formData.append('data', JSON.stringify(data))

    attachFiles(formData, replyAttachments)

    await userStory.postCommentReply(formData)
    setCommentReply('')
    setReplyAttachments([])
    setRepliesToggled(null)

    fetchStoryComments()
  }

  return (
    <div className='comments-wrapper'>
      {state.auth && (
        <div>
          <CommentForm
            id={2}
            attachments={attachments}
            setAttachments={setAttachments}
            addComment={addComment}
            comment={comment}
            setComment={setComment}
            cta={'Leave a Comment'}
            placeholder={'Adding a Comment'}
          />
        </div>
      )}
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
                  <div>{moment(data.createdAt).fromNow()}</div>
                </div>
                <div dangerouslySetInnerHTML={{ __html: data.Comments }} />
                <div>
                  {!!data.attachment.length && (
                    <div className='gallery-container-comment'>
                      <Gallery imageArray={data.attachment} />
                    </div>
                  )}
                </div>
                <div className='reply-action'>
                  {state.auth && (
                    <Button
                      className='btn btn-transparent btn-reply'
                      onClick={() => {
                        setCommentId(data.id)
                        toggleReplyForm(repliesToggled, setRepliesToggled, key)
                        toggleViewReplies(
                          viewRepliesToggled,
                          setViewRepliesToggled,
                          key
                        )
                      }}
                    >
                      Reply
                    </Button>
                  )}
                  <br/> 
                  {data.user_story_comment_replies.length == 1 ? (
                  
                    <Button
                      className='btn btn-default btn-comment-edit'
                      onClick={() => {
                        toggleViewReplies(
                          viewRepliesToggled,
                          setViewRepliesToggled,
                          key
                        )
                      }}
                    >
                      {data.user_story_comment_replies.length} Reply
                    </Button>
                  ) : data.user_story_comment_replies.length == 0 ? (
                    ''
                  ) :  ( <Button
                      className='btn btn-default btn-comment-edit'
                      onClick={() => {
                        toggleViewReplies(
                          viewRepliesToggled,
                          setViewRepliesToggled,
                          key
                        )
                      }}
                    >
                      {data.user_story_comment_replies.length} Replies
                    </Button>)   }
                  
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
                        {reply.attachment.length !== 0 ? (
                          <div className='gallery-container'>
                            <Gallery imageArray={reply.attachment} />
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  ))}
                {repliesToggled === key + 1 && state.auth && (
                  <CommentForm
                    id={1}
                    attachments={replyAttachments}
                    setAttachments={setReplyAttachments}
                    addComment={addCommentReply}
                    comment={commentReply}
                    setComment={setCommentReply}
                    cta={'Add Reply'}
                    placeholder={'Adding a Reply'}
                  />
                )}
              </div>
            </div>
          )
        })
      ) : (
        <h3>No comments yet</h3>
      )}
    </div>
  )
}

export default Comments
