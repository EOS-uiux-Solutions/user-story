import React from 'react'
import { EOS_MODE_EDIT } from 'eos-icons-react'

const EditProfileBadge = ({ allowEditing, showModal }) => {
  return allowEditing ? (
    <div className='user-profile-edit-badge' onClick={showModal}>
      Edit <EOS_MODE_EDIT className='eos-icons' color='white' />
    </div>
  ) : null
}

export default EditProfileBadge
