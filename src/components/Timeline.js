import React, { useEffect, useState } from 'react'
import { EOS_CHECK } from 'eos-icons-react'
import userStory from '../services/user_story'

const Timeline = (props) => {
  const { currentStatus } = props

  const [previousStatuses, setPreviousStatuses] = useState([])

  const [statusList, setStatusList] = useState([])

  useEffect(() => {
    const setStatuses = async () => {
      const statusResponse = userStory.getStatuses()
      const _statusList = statusResponse.data.data.userStoryStatuses

      setStatusList(_statusList)

      const tempList = []
      for (let i = 0; i < _statusList.length; i++) {
        tempList.push(_statusList[i].status)
        if (_statusList[i].status === currentStatus) break
      }

      setPreviousStatuses(tempList)
    }
    setStatuses()
  }, [currentStatus])

  return (
    <div className='flex flex-row flex-space-around status-wrapper'>
      {statusList.map((ele, key) => {
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
