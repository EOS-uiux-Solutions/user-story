import React from 'react'

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
          <div className='flex flex-row'>
            <div
              className='flex-content modal-btn modal-btn-cancel'
              align='center'
              onClick={onCancel}
            >
              {cancelText || 'Cancel'}
            </div>
            <div
              className='flex-content modal-btn modal-btn-accept'
              align='center'
              onClick={onOk}
            >
              {okText || 'Accept'}
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    ''
  )
}

export default Modal
