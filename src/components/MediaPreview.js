import React from 'react'

const MediaPreview = ({ attachments, setAttachments }) => {
  const removeFile = (name) => {
    setAttachments(attachments.filter((attachment) => attachment.name !== name))
  }

  const mediaPreview = attachments.map((file) => (
    <div className='preview-root' key={file.name}>
      <button
        className='preview-remove-button'
        onClick={() => removeFile(file.name)}
      >
        &times;
      </button>
      <div className='preview-inner'>
        <img src={file.preview} className='preview-image' alt='preview' />
      </div>
      <div>
        <center>{file.name}</center>
      </div>
    </div>
  ))

  return <div className='preview-container'>{mediaPreview}</div>
}

export default MediaPreview
