import React, { useEffect, useState } from 'react'

import Lists from '../utils/Lists'

const Timeline = (props) => {
  const { currentStatus } = props

  const [previousStatuses, setPreviousStatuses] = useState([])
  useEffect(() => {
    const setStatuses = () => {
      let tempList = []
      for (let i = 0; i < Lists.stateList.length; i++) {
        if (Lists.stateList[i].status === currentStatus) break
        tempList.push(Lists.stateList[i].status)
      }

      setPreviousStatuses(tempList)
    }
    setStatuses()
  }, [currentStatus])

  return (
    <div className='timeline-wrapper'>
      <div className='timeline-container'>
        <div className='status'>
          {console.log(previousStatuses)}
          {previousStatuses.map((ele, key) => {
            return (
              <div className='status-wrapper status-wrapper-complete' key={key}>
                {/* <div className='timestamp'>
                  <span className='author'> {ele.approver} </span>
                  <span className='date'> {ele.date} </span>
                </div> */}
                <div className='status'>
                  <h5> {ele} </h5>
                </div>
              </div>
            )
          })}
          <div className='status-wrapper'>
            {/* <div className='timestamp'>
              <span className='author'> {ele.approver} </span>
              <span className='date'> {ele.date} </span>
            </div> */}
            <div className='status'>
              <h5> {currentStatus} </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Timeline
