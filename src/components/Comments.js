import React, { useState, useEffect, useContext, useCallback } from 'react'
import { Link } from '@reach/router'
import Button from './Button'
import Gallery from './ImageGallery'
import moment from 'moment'
import CommentForm from './CommentForm'
import Context from '../modules/Context'
import userStory from '../services/user_story'
import { EOS_DELETE, EOS_EDIT } from 'eos-icons-react'

const attachFiles = (formData, attachments) => {
  if (attachments.length) {
    attachments.forEach((file) => {
      formData.append('files.attachment', file)
    })
  }
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
  const { storyId, userId } = props

  const { state } = useContext(Context)

  const id = localStorage.getItem('id')

  const [comment, setComment] = useState('')

  const [commentReply, setCommentReply] = useState('')

  const [comments, setComments] = useState([])

  const [viewRepliesToggled, setViewRepliesToggled] = useState([])

  const [attachments, setAttachments] = useState([])

  const [replyAttachments, setReplyAttachments] = useState([])

  const [editMode, setEditMode] = useState(false)

  const [commentEdit, setCommentEdit] = useState('')

  const [replyEditMode, setreplyEditMode] = useState(false)

  const [replyEdit, setReplyEdit] = useState('')

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

  const addComment = async (e, data, _storyId = storyId) => {
    e.preventDefault()

    const formData = new FormData()
    data.user = id
    data.user_story = _storyId
    if (data.Comments.trim() !== '') {
      formData.append('data', JSON.stringify(data))

      attachFiles(formData, attachments)

      await userStory.postComment(formData)

      setComment('')
      setAttachments([])

      fetchStoryComments()
    }
  }

  const addCommentReply = async (e, data, commentId) => {
    const formData = new FormData()

    data.user = id
    data.user_story_comment = commentId
    if (data.Comments.trim() !== '') {
      formData.append('data', JSON.stringify(data))

      attachFiles(formData, replyAttachments)

      await userStory.postCommentReply(formData)
      setCommentReply('')
      setReplyAttachments([])

      fetchStoryComments()
    }
  }

  const editComment = async (e, data, commentId) => {
    await userStory.updateComment(commentId, data.Comments)
    setEditMode(false)
    fetchStoryComments()
  }

  const deleteComment = async (id) => {
    await userStory.deleteComment(id)
    fetchStoryComments()
  }

  const editCommentReply = async (e, data, id) => {
    console.log(data)
    await userStory.updateCommentReply(id, data.Comments)
    setreplyEditMode(false)
    fetchStoryComments()
  }

  const deleteCommentReply = async (id) => {
    await userStory.deleteCommentReply(id)
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
      <h2 className='comments-heading'>Comments</h2>
      <hr />
      {comments.length ? (
        comments.map((data, key) => {
          return (
            <div className='comment' key={key}>
              <div className='user-avatar'>
                <img
                  className='avatar'
                  src={
                    data.user &&
                    data.user.profilePicture &&
                    data.user.profilePicture.url
                      ? data.user.profilePicture.url
                      : `https://avatars.dicebear.com/api/jdenticon/${
                          data.user && data.user.username
                        }.svg`
                  }
                  alt='Default User Avatar'
                ></img>
              </div>
              <div className='comment-content'>
                <div className='comment-content-body'>
                  <div className='top'>
                    <Link
                      className='link link-default'
                      data-cy='comment-username'
                      to={`/profile/${data.user && data.user.username}`}
                    >
                      {data.user && data.user.username}
                    </Link>
                    <div className='metadata'>
                      <div>{moment(data.createdAt).fromNow()}</div>
                    </div>
                    {data?.user?.id === userId && (
                      <div className='buttons'>
                        <div className='metadata'>
                          <Button
                            className='editbutton'
                            onClick={() => {
                              setEditMode(true)
                              setCommentEdit(data.Comments)
                            }}
                          >
                            <EOS_EDIT className='svg' />
                          </Button>
                        </div>
                        <div className='metadata'>
                          <Button
                            className='deletebutton'
                            onClick={() => {
                              deleteComment(data.id)
                            }}
                          >
                            <EOS_DELETE className='svg' />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  {!editMode && (
                    <div
                      dangerouslySetInnerHTML={{ __html: data.Comments }}
                      className='text'
                      data-cy='comment-content'
                    />
                  )}
                  {editMode && state.auth && (
                    <CommentForm
                      id={data.id}
                      comment={commentEdit}
                      attachments={attachments}
                      setAttachments={setAttachments}
                      setComment={setCommentEdit}
                      addComment={editComment}
                      cta={'save'}
                      placeholder={data.Comments}
                      className='editform'
                      type='edit'
                    />
                  )}
                  <div>
                    {!!data.attachment.length && (
                      <div className='gallery-container-comment media'>
                        <Gallery imageArray={data.attachment} />
                      </div>
                    )}
                  </div>
                </div>
                <div className='reply-action'>
                  <Button
                    className={`btn btn-default btn-comment-reply ${
                      viewRepliesToggled.find((item) => item === key + 1) &&
                      'toggled'
                    }`}
                    onClick={() => {
                      toggleViewReplies(
                        viewRepliesToggled,
                        setViewRepliesToggled,
                        key
                      )
                    }}
                  >
                    {data.user_story_comment_replies.length}
                    {data.user_story_comment_replies.length <= 1
                      ? ` Reply`
                      : ` Replies`}
                  </Button>
                </div>
                {viewRepliesToggled.find((item) => item === key + 1) &&
                  data.user_story_comment_replies.map((reply, key) => (
                    <div className='comment' key={key}>
                      <div className='user-avatar'>
                        <img
                          className='avatar'
                          src={
                            reply.user.profilePicture &&
                            reply.user.profilePicture.url
                              ? reply.user.profilePicture.url
                              : `https://avatars.dicebear.com/api/jdenticon/${reply.user.username}.svg`
                          }
                          alt='Default User Avatar'
                        ></img>
                      </div>
                      <div className='comment-content comment-content-body'>
                        <div className='top'>
                          <Link
                            className='link link-default'
                            to={`/profile/${data.user.username}`}
                          >
                            {reply.user.username}
                          </Link>
                          <div className='metadata'>
                            <div>{moment(data.createdAt).fromNow()}</div>
                          </div>
                          {data?.user?.id === userId && (
                            <div className='buttons'>
                              <div className='metadata'>
                                <Button
                                  className='editbutton'
                                  onClick={() => {
                                    setreplyEditMode(true)
                                    setReplyEdit(reply.Comments)
                                  }}
                                >
                                  <EOS_EDIT className='svg' />
                                </Button>
                              </div>
                              <div className='metadata'>
                                <Button
                                  className='deletebutton'
                                  onClick={() => {
                                    deleteCommentReply(reply.id)
                                  }}
                                >
                                  <EOS_DELETE className='svg' />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                        {!replyEditMode && (
                          <div
                            dangerouslySetInnerHTML={{ __html: reply.Comments }}
                            className='text'
                          />
                        )}
                        {replyEditMode && state.auth && (
                          <CommentForm
                            id={reply.id}
                            comment={replyEdit}
                            attachments={replyAttachments}
                            setAttachments={setReplyAttachments}
                            setComment={setReplyEdit}
                            addComment={editCommentReply}
                            cta={'save'}
                            placeholder={reply.Comments}
                            className='editform'
                            type='edit'
                          />
                        )}
                        {reply.attachment.length !== 0 ? (
                          <div className='gallery-container media'>
                            <Gallery imageArray={reply.attachment} />
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  ))}
                {viewRepliesToggled.find((item) => item === key + 1) &&
                  state.auth && (
                    <CommentForm
                      id={data.id}
                      attachments={replyAttachments}
                      setAttachments={setReplyAttachments}
                      addComment={addCommentReply}
                      comment={commentReply}
                      setComment={setCommentReply}
                      cta={'Add Reply'}
                      placeholder={'Adding a Reply'}
                      className='reply-form'
                      type='reply'
                    />
                  )}
              </div>
            </div>
          )
        })
      ) : (
        <div className='no-comments'>
          <h3>No comments yet</h3>
        </div>
      )}
    </div>
  )
}

export default Comments
