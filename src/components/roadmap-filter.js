import React, { useState, useRef } from 'react'
import Dropdown from './Dropdown'
import Lists from '../utils/Lists'
import Button from './Button'

const RoadmapFilter = (props) => {
  const { selectState, setPage, currentStateSelected } = props
  const [status, setStatus] = useState('Under consideration')
  const statusDropdownContainer = useRef()

  const statusOptions = [...Lists.stateList].reduce(
    (acc, cur) => [...acc, cur.status],
    []
  )

  return (
    <>
      <div className='roadmap-container'>
        <div className='roadmap'>
          {Lists.stateList &&
            Lists.stateList.slice(1).map((state, key) => {
              return (
                <span className='btn-tabs-wrapper'>
                  <Button
                    className={`btn btn-tabs
                      ${
                        currentStateSelected === state.status
                          ? 'btn-tabs-selected'
                          : ''
                      }`}
                    key={key}
                    onClick={() => {
                      selectState(state.status)
                      setPage(1)
                    }}
                  >
                    {state.icon}
                    {state.status}
                  </Button>
                </span>
              )
            })}
        </div>
      </div>
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
