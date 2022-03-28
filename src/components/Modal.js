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
    showButtons,
    active
  } = props

  return (
    <>
      {' '}
      {isActive ? (
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
      )}
      {active ? (
        <>
          <div className='modal' onClick={props.handleClose}>
            <div
              className='modal-card-vote'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='modal-content'>
                <span className='close-icon' onClick={props.handleClose}>
                  &times;
                </span>
                {props.content}
              </div>
            </div>
          </div>
        </>
      ) : (
        ''
      )}
    </>
  )
}

export default Modal
