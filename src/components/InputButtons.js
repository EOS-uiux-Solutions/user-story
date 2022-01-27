import React from 'react'

export const CheckBox = ({ checked, id, textLabel, icon, onChange }) => {
  if (!textLabel) {
    textLabel = id
  }

  return (
    <>
      <label className='checkbox-container'>
        <input type='checkbox' id={id} checked={checked} onChange={onChange} />
        <span className='checkmark'></span>
      </label>
      <label htmlFor={id}>
        {icon && <i className='eos-icons'>{icon}</i>}
        {textLabel}
      </label>
    </>
  )
}

export const RadioButton = ({ id, checked, onChange }) => {
  return (
    <>
      <label className='radio-button-container'>
        <input type='radio' id={id} checked={checked} onChange={onChange} />
        <span className='radio-button-mark'></span>
      </label>
      <label htmlFor={id}>{id}</label>
    </>
  )
}
