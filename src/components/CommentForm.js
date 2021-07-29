import React from 'react'
import { useForm } from 'react-hook-form'

import Button from './Button'
import FormError from './FormError'
import MediaPreview from './MediaPreview'

const CommentForm = (props) => {
  const {
    id,
    attachments,
    setAttachments,
    addComment,
    comment,
    setComment,
    cta,
    placeholder
  } = props

  const { register, errors, handleSubmit } = useForm()

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
    <form className='comment-form' onSubmit={handleSubmit(addComment)}>
      <div className='flex flex-row'>
        <div className='comment-input'>
          <textarea
            rows='5'
            cols='65'
            name='Comments'
            value={comment}
            data-cy={`comment-input-${id}`}
            ref={register({ required: true })}
            onChange={(e) => setComment(e.target.value)}
            placeholder={placeholder}
          ></textarea>
          <div className='file-input'>
            <input
              type='file'
              id={`file-${id}`}
              className='file'
              multiple={true}
              onChange={handleFileChange}
            />
            <label htmlFor={`file-${id}`} className='file-button-label'>
              <Button className='eos-icons file-btn-attachment'>
                attachment
              </Button>
            </label>
          </div>
          <Button
            className='btn btn-secondary btn-comment'
            data-cy={`btn-comment-${id}`}
          >
            {cta}
          </Button>
        </div>
      </div>
      {errors.Comments && <FormError message='Reply cannot be empty' />}
      <MediaPreview attachments={attachments} setAttachments={setAttachments} />
    </form>
  )
}

export default CommentForm
