import React from 'react'

export const Input = ({ type, updateState }) => {
  return (
    <div class='input-group'>
      <input
        class='form-control eos-input-password'
        id='password'
        type='password'
      >
        <div class='input-group-append'>
          <i class='eos-icons eos-18 toggle-password js-toggle-password'>
            visibility
          </i>
        </div>
      </input>
    </div>
  )
}
