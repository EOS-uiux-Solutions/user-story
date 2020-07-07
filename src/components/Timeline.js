import React from 'react'

const Timeline = (props) => {
  const { status } = props
  return (
    <div className='timeline-wrapper'>
      <div className='timeline-container'>
        <div className='status'>
          <h5> {status} </h5>
          {/* {status.map((ele, key) => {
          return (
            <div
              className={
                ele.approved
                  ? 'status-wrapper status-wrapper-complete'
                  : 'status-wrapper'
              }
              key={key}
            >
              <div className='timestamp'>
                <span className='author'> {ele.approver} </span>
                <span className='date'> {ele.date} </span>
              </div>
              <div className='status'>
                <h5> {ele.status} </h5>
              </div>
            </div>
          )
        })} */}
        </div>
      </div>
    </div>
  )
}

export default Timeline
