import React from 'react'
import { useForm } from 'react-hook-form'
import { EOS_ATTACHMENT } from 'eos-icons-react'

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
    cta
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
      <div className='comment-input'>
        <textarea
          rows='5'
          cols='25'
          name='Comments'
          value={comment}
          data-cy={`comment-input-${id}`}
          ref={register({ required: true })}
          onChange={(e) => setComment(e.target.value)}
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
            <EOS_ATTACHMENT className='eos-icons' size='l' />
          </label>
        </div>
      </div>
      {errors.Comments && <FormError message='Reply cannot be empty' />}
      <MediaPreview attachments={attachments} setAttachments={setAttachments} />
      <Button className='btn btn-default' data-cy={`btn-comment-${id}`}>
        {cta}
      </Button>
    </form>
  )
}

export default CommentForm
