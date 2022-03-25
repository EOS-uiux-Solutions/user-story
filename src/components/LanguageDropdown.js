import React, { useState, useEffect, useRef } from 'react'
import Button from './Button'
import { EOS_KEYBOARD_ARROW_UP, EOS_KEYBOARD_ARROW_DOWN } from 'eos-icons-react'

const LanguageDropdown = (props) => {
  const { translator } = props
  const container = useRef()

  const [dropdownState, setDropdownState] = useState(false)
  const handleButtonClick = (event) => {
    setDropdownState(!dropdownState)
  }
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (container.current && !container.current.contains(event.target)) {
        setDropdownState(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [container])

  return (
    <div className='dropdown-container' ref={container}>
      <Button
        type='button'
        className='btn btn-secondary flex'
        onClick={handleButtonClick}
      >
        {dropdownState ? (
          <EOS_KEYBOARD_ARROW_UP className='eos-icons1' />
        ) : (
          <EOS_KEYBOARD_ARROW_DOWN className='eos-icons1' />
        )}
        <div className='curr'> Language </div>
      </Button>
      {dropdownState ? (
        <div className='dropdown'>
          <ul className='dropdown-list'>
            <li
              className='dropdown-element'
              onClick={() => {
                translator.changeLanguage('en')
                setDropdownState(false)
              }}
            >
              English
            </li>
            <li
              className='dropdown-element'
              onClick={() => {
                translator.changeLanguage('es')
                setDropdownState(false)
              }}
            >
              Spanish
            </li>
          </ul>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

export default LanguageDropdown
