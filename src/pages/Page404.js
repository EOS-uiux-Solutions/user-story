import React from 'react'
import Button from '../components/Button'
import { navigate } from '@reach/router'
import { Helmet } from 'react-helmet'

const Page404 = () => {
  return (
    <>
      <Helmet>
        <title>404 Not Found | EOS User story</title>
      </Helmet>

      <div className='body-content'>
        <div className='body-wrapper pg-404'>
          <svg
            className='svg-right flex flex-column'
            width='121'
            height='240'
            viewBox='0 0 121 240'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g id='g-right'>
              <path
                id='r-4'
                d='M120 240H75C66.72 240 60 233.28 60 225V180H105C113.28 180 120 186.72 120 195V240Z'
                fill='#0AA5A5'
              />
              <path
                id='r-2'
                d='M61 120H106C114.28 120 121 113.28 121 105V60H76C67.72 60 61 66.72 61 75V120Z'
                fill='#0AA5A5'
              />
              <path
                id='r-3'
                d='M0 180H45C53.28 180 60 173.28 60 165V120H15C6.72 120 0 126.72 0 135V180Z'
                fill='#00CCD1'
              />
              <path
                id='r-1'
                d='M60 60H15C6.72 60 0 53.28 0 45V0H45C53.28 0 60 6.72 60 15V60Z'
                fill='#00CCD1'
              />
            </g>
          </svg>

          <h1 className='heading-404'>404</h1>
          <hr className='hr-404' />
          <p className='p-404'>
            The page you are looking for could not be found.
          </p>
          <Button
            className='btn btn-default btn-404'
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>

          <svg
            className='svg-left flex flex-column'
            width='121'
            height='240'
            viewBox='0 0 121 240'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g id='g-left'>
              <path
                id='l-4'
                d='M120 240H75C66.72 240 60 233.28 60 225V180H105C113.28 180 120 186.72 120 195V240Z'
                fill='#1A2A3A'
              />
              <path
                id='l-2'
                d='M61 120H106C114.28 120 121 113.28 121 105V60H76C67.72 60 61 66.72 61 75V120Z'
                fill='#1A2A3A'
              />
              <path
                id='l-3'
                d='M0 180H45C53.28 180 60 173.28 60 165V120H15C6.72 120 0 126.72 0 135V180Z'
                fill='#00CCD1'
              />
              <path
                id='l-1'
                d='M60 60H15C6.72 60 0 53.28 0 45V0H45C53.28 0 60 6.72 60 15V60Z'
                fill='#00CCD1'
              />
            </g>
          </svg>
        </div>
      </div>
    </>
  )
}

export default Page404
