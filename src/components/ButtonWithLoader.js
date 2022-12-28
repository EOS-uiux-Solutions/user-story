import React, { useState } from 'react'
import { EOS_LOADING_ANIMATED } from 'eos-icons-react'

const ButtonWithLoader = ({ onClick, children, ...rest }) => {
  const [isLoading, setLoading] = useState(false)
  const handleClick = async () => {
    setLoading(true)
    await onClick()
    setLoading(false)
  }
  return (
    <button onClick={handleClick} disabled={isLoading} {...rest}>
      {isLoading ? (
        <div>
          <EOS_LOADING_ANIMATED className='eos-icons' color='grey' />
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  )
}

export default ButtonWithLoader
