import React from 'react'

const Header = ({ user, logoutUser }) => {
  return (
    <div className='container div-center center'>
      <h3 className='teal-text'>
    Vertis Time Tracker
      </h3>
      {Object.keys(user).length > 0 &&
      <div className='container'>
        <p>
          <i className='tiny material-icons mat-color'>
          account_circle
          </i>
          {' '}
          {user.name} | {user.email} |
          {' '}
          <u className='clickable red-text' onClick={logoutUser}>
          Logout
          </u>
        </p>

      </div>}
    </div>
  )
}

export default Header
