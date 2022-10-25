import React, { useState, useRef } from 'react'
import Dropdown from './Dropdown'

const RoadmapFilter = (props) => {
  const { selectState, setPage } = props
  const [status, setStatus] = useState('All')
  const statusDropdownContainer = useRef()

  const statusOptions = [...props.statusList].reduce(
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
