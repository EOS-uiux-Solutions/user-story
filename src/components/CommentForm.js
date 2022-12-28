import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { EOS_ATTACHMENT } from 'eos-icons-react'

import FormError from './FormError'
import MediaPreview from './MediaPreview'
import userStory from '../services/user_story'
import { MentionsInput, Mention } from 'react-mentions'
import ButtonWithLoader from './ButtonWithLoader'

const CommentForm = (props) => {
  const {
    id,
    attachments,
    setAttachments,
    addComment,
    comment,
    setComment,
    cta,
    placeholder,
    type
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

  const handleReply = (data) => {
    const newReply = {}
    newReply[id] = data
    setComment({ ...comment, ...newReply })
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <form className={`comment-form ${props.className}`}>
      <div className='flex flex-row'>
        <div className='comment-input flex flex-column'>
          <MentionsInput
            id='Comments'
            data-cy={`comment-input-${id}`}
            value={type === 'reply' ? comment[id] : comment}
            onChange={(e) =>
              type === 'reply'
                ? handleReply(e.target.value)
                : setComment(e.target.value)
            }
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
          <div className='buttons flex flex-row-reverse'>
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
            <ButtonWithLoader
              className='btn btn-secondary btn-comment'
              data-cy={`btn-comment-${id}`}
              onClick={(e) =>
                type === 'reply'
                  ? addComment(e, { Comments: comment[id] }, id)
                  : type === 'edit'
                  ? addComment(e, { Comments: comment }, id)
                  : addComment(e, { Comments: comment })
              }
              type='button'
            >
              {cta}
            </ButtonWithLoader>
          </div>
        </div>
      </div>
      {errors.Comments && <FormError message='Reply cannot be empty' />}
      <MediaPreview attachments={attachments} setAttachments={setAttachments} />
    </form>
  )
}

export default CommentForm
