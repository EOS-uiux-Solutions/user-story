import React from 'react'
import EditableLabel from './EditableLabel'

export const UserProfile = ({
  children,
  allowEditing,
  user,
  handleInputChange,
  updateProfile
}) => {
  return (
    <>
      <div className='user-profile margin-top-xxl margin-bottom-m'>
        <UserAvatar
          avatarURL={
            user?.profilePicture?.url ??
            'https://avatars.dicebear.com/api/jdenticon/eos.svg'
          }
        />
        <UserDetails
          user={user}
          handleInputChange={handleInputChange}
          updateProfile={updateProfile}
          allowEditing={allowEditing}
        />
      </div>
      {allowEditing && <UserSettings user={user} />}
    </>
  )
}

export const UserAvatar = ({ avatarURL }) => {
  return (
    <div className='user-profile-avatar'>
      <img src={avatarURL} alt='User avatar' />
    </div>
  )
}

export const UserSettings = ({ user }) => {
  return (
    <div className='user-profile-settings'>
      <ul>
        <li>
          Email address:
          <span>{user?.email}</span>
        </li>
        <li>
          Username:
          <span>{user?.username}</span>
        </li>
        <li>
          <a className='link link-default' href='/changePassword'>
            Change password
          </a>
        </li>
      </ul>
    </div>
  )
}

export const UserDetails = ({
  user,
  handleInputChange,
  allowEditing,
  updateProfile
}) => {
  return (
    <div className='user-profile-details'>
      <EditableLabel
        type='text'
        name={'Name'}
        value={user.Name ?? user.username}
        className='input-default'
        handleInputChange={handleInputChange}
        allowEditing={allowEditing}
        updateProfile={updateProfile}
      >
        <h2 className='user-profile-name'>{user.Name ?? user.username}</h2>
      </EditableLabel>
      <EditableLabel
        type='textArea'
        name={'Bio'}
        value={user.Bio}
        handleInputChange={handleInputChange}
        allowEditing={allowEditing}
        updateProfile={updateProfile}
      >
        <p>{user?.Bio ?? 'Not defined yet'}</p>
      </EditableLabel>

      <div className='user-profile-extra'>
        <ul>
          <li>
            Profession
            <EditableLabel
              type='text'
              name={'Profession'}
              value={user.Profession}
              handleInputChange={handleInputChange}
              allowEditing={allowEditing}
              updateProfile={updateProfile}
            >
              <span>{user?.Profession ?? 'as'}</span>
            </EditableLabel>
          </li>
          <li>
            Company
            <EditableLabel
              type='text'
              name={'Company'}
              value={user.Company}
              handleInputChange={handleInputChange}
              allowEditing={allowEditing}
              updateProfile={updateProfile}
            >
              <span>{user?.Company}</span>
            </EditableLabel>
          </li>
          <li>
            LinkedIn
            <EditableLabel
              type='text'
              name={'LinkedIn'}
              value={user.LinkedIn}
              handleInputChange={handleInputChange}
              allowEditing={allowEditing}
              updateProfile={updateProfile}
            >
              <a
                className='link link-default'
                href={`https://www.linkedin.com/in/${user?.LinkedIn}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                {user?.LinkedIn}
              </a>
            </EditableLabel>
          </li>
          <li>
            Twitter
            <EditableLabel
              type='text'
              name={'Twitter'}
              value={user.Twitter}
              handleInputChange={handleInputChange}
              allowEditing={allowEditing}
              updateProfile={updateProfile}
            >
              <span>
                <a
                  className='link link-default'
                  href={`https://twitter.com/${user?.Twitter}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {user?.Twitter ? `@${user?.Twitter}` : ''}
                </a>
              </span>
            </EditableLabel>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default UserProfile
