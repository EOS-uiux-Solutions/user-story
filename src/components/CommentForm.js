import React from 'react'
import { useForm } from 'react-hook-form'

import Button from './Button'
import FormError from './FormError'
import MediaPreview from './MediaPreview'

const CommentForm = (props) => {
  const {
    attachments,
    setAttachments,
    commentReply,
    setCommentReply,
    isCommentReply,
    isComment,
    comment,
    setComment
  } = props

  const { register: registerReply, errors: errorsReply } = useForm()

  const { register: registerComment, errors: errorsComment } = useForm()

  const handleFileChange = async (event) => {
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

  return (
    <>
      {' '}
      {isCommentReply ? (
        <div>
          <div className='comment-input'>
            <textarea
              rows='5'
              cols='25'
              name='addReply'
              ref={registerReply({ required: true })}
              value={commentReply}
              onChange={(e) => setCommentReply(e.target.value)}
            ></textarea>
            <div className='file-input'>
              <input
                type='file'
                id='file'
                className='file'
                multiple={true}
                onChange={handleFileChange}
              />
              <label htmlFor='file' className='file-button-label'>
                <i className='eos-icons'>attachment</i>
              </label>
            </div>
          </div>
          {errorsReply.Comments && (
            <FormError message='Reply cannot be empty' />
          )}
          <MediaPreview
            attachments={attachments}
            setAttachments={setAttachments}
          />
        </div>
      ) : (
        ''
      )}
      {isComment ? (
        <div>
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
              onChange={handleFileChange}
              multiple={true}
            />
            <label for='imgupload'>
              <Button className='eos-icons comment-attachment'>
                attachment
              </Button>
            </label>
          </div>
          {errorsComment.addComment && (
            <FormError message='Comment cannot be empty' />
          )}
          <MediaPreview
            attachments={attachments}
            setAttachments={setAttachments}
          />
        </div>
      ) : (
        ''
      )}
    </>
  )
}

export default CommentForm
