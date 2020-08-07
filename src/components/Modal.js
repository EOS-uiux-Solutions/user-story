import React from 'react'

import Button from './Button'

const Modal = (props) => {
  const {
    isActive,
    children,
    cancelText,
    okText,
    onCancel,
    onOk,
    showButtons
  } = props

  return isActive ? (
    <div className='modal'>
      <div className='modal-card'>
        <div className='flex flex-row modal-content'>{children}</div>
        {showButtons && (
          <div className='flex flex-row flex-space-around'>
            <Button className='btn btn-default' onClick={onCancel}>
              {cancelText || 'Cancel'}
            </Button>
            <Button className='btn btn-default' onClick={onOk}>
              {okText || 'Accept'}
            </Button>
          </div>
        )}
      </div>
    </div>
  ) : (
    ''
  )
}

export default Modal
