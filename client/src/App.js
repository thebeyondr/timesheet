import React, { Component } from 'react'
import Jobs from './components/Jobs/'
import Login from './components/Login'
import './App.css'
import Job from './components/Job'
import setAuthHeader from './utils/setAuthHeader'

const initialState = {
  route: 'login',
  isSignedIn: false,
  errors: {},
  user: {},
  jobId: '',
  completed: ''
}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = initialState
  }

  loadUser = data => {
    this.setState({
      user: data
    })
  }

  handleJob = e => {
    const jobId = e.target.getAttribute('data-job-id')
    this.setState({ jobId }, () => {
      this.changeRoute('job')
    })
  }

  clearErrors = () => {
    this.setState({ errors: {} })
  }

  handleErrors = err => {
    this.setState({ errors: err })
  }

  changeRoute = route => {
    if (route === 'login') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({ isSignedIn: true })
    }
    this.setState({ route })
  }

  markCompleted = completedName => {
    this.setState({ completed: completedName }, () => {
      this.changeRoute('home')
    })
  }

  logoutUser = () => {
    // remove token from localStorage
    window.localStorage.removeItem('jwtToken')
    // remove Authorization header from requests
    setAuthHeader(false)
    // empty current use and set isAuthenticated to false
    this.changeRoute('login')
  }

  render () {
    const { route, user, errors, jobId, completed } = this.state
    return (
      <div className='App container'>
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
                <u className='clickable red-text' onClick={this.logoutUser}>
                  Logout
                </u>
              </p>

            </div>}
        </div>
        {route === 'login'
          ? <Login
            changeRoute={this.changeRoute}
            loadUser={this.loadUser}
            errors={errors}
            handleErrors={this.handleErrors}
            clearErrors={this.clearErrors}
          />
          : route === 'home'
            ? <Jobs
              handleErrors={this.handleErrors}
              clearErrors={this.clearErrors}
              handleJob={this.handleJob}
              completed={completed}
            />
            : route === 'job'
              ? <Job
                handleErrors={this.handleErrors}
                clearErrors={this.clearErrors}
                errors={errors}
                jobId={jobId}
                user={user}
                changeRoute={this.changeRoute}
                markCompleted={this.markCompleted}
              />
              : <Login
                changeRoute={this.changeRoute}
                loadUser={this.loadUser}
              />}
      </div>
    )
  }
}

export default App
