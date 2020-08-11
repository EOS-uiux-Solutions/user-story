import React from 'react'

export const FormError = (props) => {
  const { type } = props

  return (
    <div className='form-error'>
      <i className='eos-icons'>error</i>{' '}
      {type === 'required' && 'This is required'}
    </div>
  )
}

export default FormError
