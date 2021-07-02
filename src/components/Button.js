import React from 'react'

const Button = ({
  children,
  className,
  action,
  type,
  onClick,
  disabled,
  ...rest
}) => {
  return (
    <button
      className={className}
      action={action}
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
