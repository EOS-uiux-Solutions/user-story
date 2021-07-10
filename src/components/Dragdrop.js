import React, { useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import MediaPreview from './MediaPreview'

const Dragdrop = ({ attachments, setAttachments }) => {
  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    onDrop: (acceptedFiles) => {
      setAttachments((attachments) => [
        ...attachments,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      ])
    }
  })

  useEffect(
    () => () => {
      attachments.forEach((attachment) =>
        URL.revokeObjectURL(attachment.preview)
      )
    },
    [attachments]
  )

  return (
    <section className='container'>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <MediaPreview attachments={attachments} setAttachments={setAttachments} />
    </section>
  )
}

export default Dragdrop
