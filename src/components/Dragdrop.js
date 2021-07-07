import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'

const Dragdrop = ({ setAttachments }) => {
  const [files, setFiles] = useState([])

  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    onDrop: (acceptedFiles) => {
      setAttachments(acceptedFiles)
      setFiles((files) => [
        ...files,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      ])
    }
  })

  const mediaPreview = files.map((file) => (
    <div className='preview-root' key={file.name}>
      <div className='preview-inner'>
        <img src={file.preview} className='preview-image' alt='preview' />
      </div>
    </div>
  ))

  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview))
    },
    [files]
  )

  return (
    <section className='container'>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside className='preview-container'>{mediaPreview}</aside>
    </section>
  )
}

export default Dragdrop
