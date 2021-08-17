import React, { useEffect, useState } from 'react'
import { EOS_CHECK } from 'eos-icons-react'

import Lists from '../utils/Lists'

const Timeline = (props) => {
  const { currentStatus } = props

  const [previousStatuses, setPreviousStatuses] = useState([])
  useEffect(() => {
    const setStatuses = () => {
      const tempList = []
      for (let i = 0; i < Lists.stateList.length; i++) {
        tempList.push(Lists.stateList[i].status)
        if (Lists.stateList[i].status === currentStatus) break
      }

      setPreviousStatuses(tempList)
    }
    setStatuses()
  }, [currentStatus])

  return (
    <div className='flex flex-row flex-space-around status-wrapper'>
      {Lists.stateList.map((ele, key) => {
        return (
          <div className='status-element' key={key}>
            <div className='status flex flex-column'>
              {previousStatuses.includes(ele.status) ? (
                <EOS_CHECK className='eos-icons tick' />
              ) : (
                <i className='eos-icons no-tick'></i>
              )}
              <h4> {ele.status} </h4>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Timeline
