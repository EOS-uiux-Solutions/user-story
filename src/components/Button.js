import React from 'react'

const Button = ({
  children,
  className,
  action,
  type,
  onClick,
  disabled,
  dataCy
}) => {
  return (
    <button
      className={className}
      action={action}
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-cy={dataCy}
    >
      {children}
    </button>
  )
}

export default Button
