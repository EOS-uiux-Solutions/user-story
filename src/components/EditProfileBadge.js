import React from 'react'

const EditProfileBadge = ({ allowEditing, showModal }) => {
  return allowEditing ? (
    <div className='user-profile-edit-badge' onClick={showModal}>
      Edit <i className='eos-icons'>mode_edit</i>
    </div>
  ) : null
}

export default EditProfileBadge
