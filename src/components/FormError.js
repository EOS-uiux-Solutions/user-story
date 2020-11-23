import React from 'react'

export const FormError = (props) => {
  const { type, status, message } = props

  return (
    <div>
      {status ? (
        <div className='form-error alert alert-section alert-danger'>
          <i className='eos-icons alert-icon'>error</i>
          <div class='alert-body'>
            {status !== null && status}
            {message !== null && message}
          </div>
        </div>
      ) : (
        <div className='form-error'>
          <i className='eos-icons'>error</i>
          {type === 'required' && 'This is required'}
          {type === 'validate' && 'Passwords do not match'}
          {type === 'emptyDescription' && 'Description cannot be empty'}
        </div>
      )}
    </div>
  )
}

export default FormError
