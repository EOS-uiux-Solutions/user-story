import React, { useState } from 'react'
import { EOS_SAVE, EOS_MODE_EDIT } from 'eos-icons-react'

export const EditableLabel = ({
  name,
  value,
  type,
  handleInputChange,
  updateProfile,
  children,
  allowEditing,
  ...props
}) => {
  const [editMode, setEditMode] = useState(false)

  const ComponentToRender = (type) => {
    switch (type) {
      case 'text': {
        return (
          <TextInput
            onChange={handleInputChange}
            defaultValue={value}
            onKeyPress={(e) => {
              handleInputChange(e)

              if (e.key === 'Enter') {
                updateProfile()
                setEditMode(!editMode)
              }
            }}
            name={name}
            {...props}
          />
        )
      }
      case 'textArea': {
        return (
          <TextArea
            onChange={handleInputChange}
            defaultValue={value}
            onKeyPress={handleInputChange}
            name={name}
            {...props}
          />
        )
      }
      default: {
        return 'No component was found'
      }
    }
  }
  return (
    <div className='editable-label'>
      {!editMode && (
        <>
          {children}
          {allowEditing && (
            <button
              className='editable-label-edit-btn'
              onClick={() => setEditMode(!editMode)}
            >
              <EOS_MODE_EDIT className='eos-icons' />
            </button>
          )}
        </>
      )}
      {editMode && (
        <>
          {ComponentToRender(type)}
          <button
            onClick={() => {
              setEditMode(!editMode)
              updateProfile()
            }}
          >
            <EOS_SAVE className='eos-icons' />
          </button>
        </>
      )}
    </div>
  )
}

const TextInput = (props) => {
  return <input className='input-default' type='text' {...props} />
}

const TextArea = (props) => {
  return <textarea type='text' {...props} rows={4} cols={60} />
}

export default EditableLabel
