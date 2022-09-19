import React, { useState, useRef } from 'react'
import Dropdown from './Dropdown'
import Lists from '../utils/Lists'

const RoadmapFilter = (props) => {
  const { selectState, setPage } = props
  const [status, setStatus] = useState('All')
  const statusDropdownContainer = useRef()

  const statusOptions = [...Lists.stateList].reduce(
    (acc, cur) => [...acc, cur.status],
    []
  )

  return (
    <>
      <div className='roadmap-dropdown'>
        <Dropdown
          title='Status'
          reference={statusDropdownContainer}
          curr={status}
          setCurr={setStatus}
          itemList={statusOptions}
          data-cy='status-dropdown'
          selectstate={selectState}
          setpage={setPage}
        />
      </div>
    </>
  )
}

export default RoadmapFilter
