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

  const [attachments, setAttachments] = useState([])

  const fetchStoryComments = async () => {
    const response = await userStory.getComments(storyId)
    setComments(response.data.data.userStory.user_story_comments)
  }

  const addComment = async (data) => {
    const formData = new FormData()
    data.user = id
    data.user_story = storyId
    formData.append('data', JSON.stringify(data))
    if (attachments.length) {
      attachments.forEach((file) => {
        formData.append('files.Attachment', file)
      })
    }
    await userStory.postComment(formData)
    setComment('')
    setAttachments([])
  }

  fetchStoryComments(storyId, fetchComments)

  const addCommentReply = async (data) => {
    await userStory.postCommentReply(data.addReply, commentId, id)
    setCommentReply('')
    setFetchComments((fetchComments) => !fetchComments)
    setRepliesToggled(null)
  }

  const uploadFile = async (event) => {
    const newFiles = event.target.files
    const newFilesArray = []
    for (let i = 0; i < newFiles.length; i++) {
      newFilesArray.push(
        Object.assign(newFiles[i], {
          preview: URL.createObjectURL(newFiles[i])
        })
      )
    }
    setAttachments([...attachments, ...newFilesArray])
  }

  const mediaPreview = attachments.map((file) => (
    <div className='preview-root' key={file.name}>
      <div className='preview-inner'>
        <img src={file.preview} className='preview-image' alt='preview' />
      </div>
    </div>
  ))

  useEffect(
    () => () => {
      attachments.forEach((file) => URL.revokeObjectURL(file.preview))
    },
    [attachments]
  )

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
          attachments={attachments}
          setAttachments={setAttachments}
          addComment={addComment}
          setComment={setComment}
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
            <input
              type='file'
              id='imgupload'
              style={{ display: 'none', cursor: 'pointer' }}
              onChange={uploadFile}
              multiple={true}
            />
            <label for='imgupload'>
              <Button className='eos-icons comment-attachment'>
                attachment
              </Button>
            </label>
            {errorsComment.addComment && (
              <FormError message='Comment cannot be empty' />
            )}
          </div>
          <aside className='preview-container'>{mediaPreview}</aside>
          <Button className='btn btn-default' data-cy='btn-comment'>
            Add Comment
          </Button>
        </form>
      )}
    </div>
  )
}

export default Comments
