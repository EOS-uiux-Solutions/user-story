import React from 'react'
import {
  EOS_ALL_INCLUSIVE,
  EOS_SCHEDULE,
  EOS_CHECK_CIRCLE,
  EOS_MODE_EDIT,
  EOS_CODE,
  EOS_PATCH_FIXES,
  EOS_DEPLOY
} from 'eos-icons-react'

const Lists = {
  stateList: [
    {
      icon: <EOS_ALL_INCLUSIVE className='eos-icons' />,
      status: 'All'
    },
    {
      icon: <EOS_SCHEDULE className='eos-icons' />,
      status: 'Under consideration'
    },
    {
      icon: <EOS_CHECK_CIRCLE className='eos-icons' />,
      status: 'Planned'
    },
    {
      icon: <EOS_MODE_EDIT className='eos-icons' />,
      status: 'Designing'
    },
    {
      icon: <EOS_CODE className='eos-icons' />,
      status: 'Implementing'
    },
    {
      icon: <EOS_PATCH_FIXES className='eos-icons' />,
      status: 'Testing'
    },
    {
      icon: <EOS_DEPLOY className='eos-icons' />,
      status: 'Deployed'
    }
  ],
  sortByList: ['Most Voted', 'Most Discussed']
}

export default Lists
