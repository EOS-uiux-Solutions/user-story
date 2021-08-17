import React from 'react'
import { EOS_VISIBILITY } from 'eos-icons-react'

export const Input = ({ type, updateState }) => {
  return (
    <div class='input-group'>
      <input
        class='form-control eos-input-password'
        id='password'
        type='password'
      >
        <div class='input-group-append'>
          <EOS_VISIBILITY class='eos-icons eos-18 toggle-password js-toggle-password' />
        </div>
      </input>
    </div>
  )
}
