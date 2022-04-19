import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { EOS_ATTACHMENT } from 'eos-icons-react'

import Button from './Button'
import FormError from './FormError'
import MediaPreview from './MediaPreview'
import userStory from '../services/user_story'
import { MentionsInput, Mention } from 'react-mentions'

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

  const {
    formState: { errors }
  } = useForm({ defaultValues: { Comments: '' } })

  const [users, setUsers] = useState([])

  const fetchUsers = async () => {
    const response = await userStory.getUsers()
    setUsers(response.data?.data?.users ?? [])
  }

  const displayTransform = (id, display) => {
    return `@${display}`
  }

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

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <form className='comment-form'>
      <div className='flex flex-row'>
        <div className='comment-input'>
          <MentionsInput
            id='Comments'
            data-cy={`comment-input-${id}`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={placeholder}
            allowSuggestionsAboveCursor={true}
            className='mentions'
          >
            <Mention
              trigger='@'
              data={users}
              displayTransform={displayTransform}
              markup={`<a class='mentions' href=${window.location.origin}/profile/__id__>@__display__</a>`}
            />
          </MentionsInput>
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
          <Button
            className='btn btn-secondary btn-comment margin-y'
            data-cy={`btn-comment-${id}`}
            onClick={(e) => addComment(e, { Comments: comment })}
            type='button'
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
