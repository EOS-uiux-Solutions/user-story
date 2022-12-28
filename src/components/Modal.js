import React from 'react'

import ButtonWithLoader from './ButtonWithLoader'

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
                <ButtonWithLoader
                  className='btn btn-default'
                  onClick={onCancel}
                >
                  {cancelText || 'Cancel'}
                </ButtonWithLoader>
                <ButtonWithLoader className='btn btn-default' onClick={onOk}>
                  {okText || 'Accept'}
                </ButtonWithLoader>
              </div>
            )}
          </div>
        </div>
      ) : (
        ''
      )}
      {active ? (
        <>
          <div className='modal'>
            <div className='modal-card-vote'>
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
