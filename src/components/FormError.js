import React from 'react'

export const FormError = (props) => {
  const { type } = props

  return (
    <div className='form-error'>
      <i className='eos-icons'>error</i>{' '}
      {type === 'required' && 'This is required'}
      {type === 'validate' && 'Passwords do not match'}
      {type === 'emptyDescription' && 'Description cannot be empty'}
    </div>
  )
}

export default FormError
