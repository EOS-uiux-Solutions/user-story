import React from 'react'

const Button = ({ children, className, action, type, onClick, disabled }) => {
  return (
    <button
      className={className}
      action={action}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
