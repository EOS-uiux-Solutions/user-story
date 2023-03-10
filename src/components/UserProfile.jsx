import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import ProfileImageUploader from './ProfileImageUploader'
import EditableLabel from './EditableLabel'
import EditProfileBadge from './EditProfileBadge'
import Tag from './Tag'

export const UserProfile = ({
  allowEditing,
  user,
  handleInputChange,
  updateProfile
}) => {
  return (
    <>
      <div className='user-profile margin-top-xxl margin-bottom-m'>
        <UserAvatar user={user} allowEditing={allowEditing} />
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

export const UserAvatar = ({ user, allowEditing }) => {
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <div className='user-profile-avatar'>
      <EditProfileBadge
        allowEditing={allowEditing}
        showModal={() => setModalVisible(true)}
      />
      {!user ? (
        <Skeleton circle width={150} height={150} />
      ) : (
        <img
          className='user-profile-avatar-img'
          src={
            user?.profilePicture?.url ??
            `https://avatars.dicebear.com/api/jdenticon/${user.username}.svg`
          }
          alt='User avatar'
        />
      )}
      {modalVisible && (
        <ProfileImageUploader
          userId={user.id}
          show={modalVisible}
          setShow={setModalVisible}
          profilePicURL={user?.profilePicture?.url ?? null}
          profilePicId={user?.profilePicture?.id ?? null}
        />
      )}
    </div>
  )
}

export const UserSettings = ({ user }) => {
  return (
    <div className='user-profile-settings'>
      {!user ? (
        <Skeleton width={200} />
      ) : (
        <ul>
          <li data-cy='user-email'>
            Email address:
            <span>{user?.email}</span>
          </li>
          <li data-cy='user-username'>
            Username:
            <span>{user?.username}</span>
          </li>
          <li>
            <a className='link link-default' href='/changePassword'>
              Change password
            </a>
          </li>
        </ul>
      )}
    </div>
  )
}

export const UserDetails = ({
  user,
  handleInputChange,
  allowEditing,
  updateProfile
}) => {
  const checkNull = (value) => {
    if (value === 'null') return true
    else return false
  }
  return (
    <div className='user-profile-details'>
      {!user ? (
        <Skeleton count={2} />
      ) : (
        <>
          <EditableLabel
            type='text'
            name={'Name'}
            value={user.Name ?? user.username}
            className='input-default'
            handleInputChange={handleInputChange}
            allowEditing={allowEditing}
            updateProfile={updateProfile}
            placeholder='Your name'
            data-cy='edit-Name'
          >
            <h2 className='user-profile-name' data-cy='user-Name'>
              {user.Name
                ? checkNull(user.Name)
                  ? user.username
                  : user.Name
                : user.username}
            </h2>
          </EditableLabel>
          {!!(
            user &&
            user.access_role &&
            user.access_role.length &&
            user.access_role[0].name === 'Manager'
          ) && <Tag content={'Manager'} />}
          <EditableLabel
            type='textArea'
            name={'Bio'}
            value={user.Bio}
            handleInputChange={handleInputChange}
            allowEditing={allowEditing}
            updateProfile={updateProfile}
            placeholder='Say something about yourself'
            data-cy='edit-Bio'
          >
            <p data-cy='user-Bio'>
              {(user.Bio && !checkNull(user.Bio)) ||
                (allowEditing ? 'Say something about yourself' : 'Hi There!')}
            </p>
          </EditableLabel>
        </>
      )}

      <div className='user-profile-extra'>
        {!user ? (
          <Skeleton height={70} />
        ) : (
          <ul>
            {allowEditing || user.Profession ? (
              <li>
                Profession
                <EditableLabel
                  type='text'
                  name={'Profession'}
                  value={user.Profession}
                  handleInputChange={handleInputChange}
                  allowEditing={allowEditing}
                  updateProfile={updateProfile}
                  placeholder='Your job title'
                  data-cy='edit-Profession'
                >
                  <span data-cy='user-Profession'>
                    {!user.Profession
                      ? 'Your job title'
                      : checkNull(user.Profession)
                      ? 'Your job title'
                      : user.Profession}
                  </span>
                </EditableLabel>
              </li>
            ) : null}
            {allowEditing || user.Company ? (
              <li>
                Company
                <EditableLabel
                  type='text'
                  name={'Company'}
                  value={user.Company}
                  handleInputChange={handleInputChange}
                  allowEditing={allowEditing}
                  updateProfile={updateProfile}
                  placeholder='Your company name'
                  data-cy='edit-Company'
                >
                  <span data-cy='user-Company'>
                    {!user.Company
                      ? 'Your company name'
                      : checkNull(user.Company)
                      ? 'Your company name'
                      : user.Company}
                  </span>
                </EditableLabel>
              </li>
            ) : null}
            {allowEditing || user.LinkedIn ? (
              <li>
                LinkedIn
                <EditableLabel
                  type='text'
                  name={'LinkedIn'}
                  value={user.LinkedIn}
                  handleInputChange={handleInputChange}
                  allowEditing={allowEditing}
                  updateProfile={updateProfile}
                  placeholder='Your LinkedIn username'
                  data-cy='edit-LinkedIn'
                >
                  <span data-cy='user-LinkedIn'>
                    {user.LinkedIn ? (
                      checkNull(user.LinkedIn) ? (
                        'Your LinkedIn username'
                      ) : (
                        <a
                          className='link link-default'
                          href={`https://www.linkedin.com/in/${user?.LinkedIn}`}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          {user.LinkedIn}
                        </a>
                      )
                    ) : (
                      'Your LinkedIn username'
                    )}
                  </span>
                </EditableLabel>
              </li>
            ) : null}
            {allowEditing || user.Twitter ? (
              <li>
                Twitter
                <EditableLabel
                  type='text'
                  name={'Twitter'}
                  value={user.Twitter}
                  handleInputChange={handleInputChange}
                  allowEditing={allowEditing}
                  updateProfile={updateProfile}
                  placeholder='Your Twitter handle'
                  data-cy='edit-Twitter'
                >
                  <span data-cy='user-Twitter'>
                    {user.Twitter ? (
                      checkNull(user.Twitter) ? (
                        'Your Twitter handle'
                      ) : (
                        <a
                          className='link link-default'
                          href={`https://twitter.com/${user?.Twitter}`}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          {user.Twitter ? `@${user.Twitter}` : ''}
                        </a>
                      )
                    ) : (
                      'Your Twitter handle'
                    )}
                  </span>
                </EditableLabel>
              </li>
            ) : null}
          </ul>
        )}
      </div>
    </div>
  )
}

export default UserProfile
