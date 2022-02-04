import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Modal from './Modal'
import axios from 'axios'
import LoadingIndicator from '../modules/LoadingIndicator'
import FormError from './FormError'
import { EOS_DELETE } from 'eos-icons-react'
const { apiURL } = require('../config.json')

const ProfileImageUploader = ({
  userId,
  show,
  setShow,
  profilePicURL,
  profilePicId
}) => {
  const [error, setError] = useState(null)
  const [file, setFile] = useState(null)
  const [removedProfilePic, setRemovedProfilePic] = useState(!profilePicURL)
  const [isUploading, setIsUploading] = useState(false)
  const clearModal = () => {
    URL.revokeObjectURL(file?.preview)
    setFile(null)
    setShow(false)
  }
  const upload = async () => {
    if (!file && (!removedProfilePic || !profilePicId)) {
      clearModal()
      return
    }
    if (profilePicURL && removedProfilePic && !file) {
      try {
        setIsUploading(true)
        await axios.delete(`${apiURL}/upload/files/${profilePicId}`, {
          withCredentials: true
        })
      } catch (err) {
        setError('Unable to update profile picture. Please try again later.')
      }
    } else {
      const formData = new FormData()
      formData.append('files', file)
      formData.append('ref', 'user')
      formData.append('refId', userId)
      formData.append('source', 'users-permissions')
      formData.append('field', 'profilePicture')

      try {
        setIsUploading(true)
        if (profilePicURL && removedProfilePic) {
          await axios.all([
            axios.delete(`${apiURL}/upload/files/${profilePicId}`, {
              withCredentials: true
            }),
            axios.post(`${apiURL}/upload`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              withCredentials: true
            })
          ])
        } else {
          await axios.post(`${apiURL}/upload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
          })
        }
      } catch (err) {
        setError('Error updating profile picture. Try updating later')
      }
    }
    setIsUploading(false)
    setShow(false)
    window.location.reload()
  }

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: 'image/jpeg, image/png, image/gif',
    minSize: 0,
    maxSize: 153600,
    onDrop: ([newFile], [rejectedFile]) => {
      try {
        setFile(
          Object.assign(newFile, {
            preview: URL.createObjectURL(newFile)
          })
        )
        setError(null)
      } catch (err) {
        const fileErrors = rejectedFile.errors.map((error) => error.code)
        if (fileErrors.indexOf('file-too-large') !== -1) {
          setError('Please upload a file smaller than 150 kB')
        }
        if (fileErrors.indexOf('file-invalid-type') !== -1) {
          setError(
            'Please upload a file with .png, .jpg/.jpeg or .gif extensions'
          )
        }
      }
    }
  })

  useEffect(
    () => () => {
      URL.revokeObjectURL(file?.preview)
    },
    [file]
  )

  return isUploading ? (
    <Modal isActive={true} showButtons={false}>
      <LoadingIndicator />
    </Modal>
  ) : (
    <Modal
      isActive={show}
      handleClose={() => setShow(false)}
      onCancel={clearModal}
      okText={'Save'}
      onOk={upload}
      showButtons
    >
      <section className='container'>
        {!removedProfilePic && (
          <aside className='preview-container'>
            <span
              className='remove-img-icon'
              onClick={() => {
                setRemovedProfilePic(true)
                setFile(null)
              }}
            >
              <EOS_DELETE className='eos-icons' />
            </span>
            <img
              src={profilePicURL}
              className='user-profile-avatar-img'
              alt='preview'
            />
          </aside>
        )}
        {removedProfilePic &&
          (!file ? (
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <p>
                Drag 'n' drop your image here, or click to select one. For best
                results upload images with 1:1 aspect ratio. Maximum allowed
                file-size is 150 kB.
              </p>
            </div>
          ) : (
            <aside className='preview-container'>
              <span
                className='remove-img-icon'
                onClick={() => {
                  URL.revokeObjectURL(file.preview)
                  setFile(null)
                }}
              >
                <EOS_DELETE className='eos-icons' />
              </span>
              <img
                src={file.preview}
                className='user-profile-avatar-img'
                alt='preview'
              />
            </aside>
          ))}
        {!!error && <FormError message={error} />}
      </section>
    </Modal>
  )
}

export default ProfileImageUploader
