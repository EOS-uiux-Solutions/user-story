import React from 'react'
import { EOS_ERROR } from 'eos-icons-react'

export const FormError = (props) => {
  const { type, status, message } = props

  return (
    <div>
      {status ? (
        <div className='form-error alert alert-section alert-danger'>
          <EOS_ERROR className='alert-icon eos-icons' color='red' />
          <div class='alert-body'>
            {status !== null && status}
            {message !== null && message}
          </div>
        </div>
      ) : (
        <div className='form-error'>
          <EOS_ERROR className='eos-icons' color='red' />
          {type === 'required' && 'This is required'}
          {type === 'validate' && 'Passwords do not match'}
          {type === 'emptyDescription' && 'Description cannot be empty'}
          {message !== null && message}
        </div>
      )}
    </div>
  )
}

export default FormError
