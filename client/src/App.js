import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Jobs from './components/Jobs/'
import Login from './components/Login'
import './App.css'
import Job from './components/Job'
import setAuthHeader from './utils/setAuthHeader'
import Header from './components/common/Header'
import jwtDecode from 'jwt-decode'

const initialState = {
  isSignedIn: false,
  errors: {},
  user: {},
  jobId: '',
  completed: ''
}

if (window.localStorage.jwtToken) {
  const { jwtToken } = window.localStorage
  setAuthHeader(jwtToken)
  const decoded = jwtDecode(jwtToken)
  initialState.user = decoded
  initialState.isSignedIn = true
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

  // changeRoute = route => {
  //   if (route === 'login') {
  //     this.setState(initialState)
  //   } else if (route === 'home') {
  //     this.setState({ isSignedIn: true })
  //   }
  //   this.setState({ route })
  // }

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
    const { user, errors, jobId, completed } = this.state
    return (
      <BrowserRouter>
        <div className='App container'>
          <Header user={user} logoutUser={this.logoutUser} />
          <Route exact path='/' render={routeProps => (
            <Login
              {...routeProps}
              loadUser={this.loadUser}
              errors={errors}
              handleErrors={this.handleErrors}
              clearErrors={this.clearErrors}
            />
          )} />
          <Route exact path='/home' render={routeProps => (
            <Jobs
              {...routeProps}
              handleErrors={this.handleErrors}
              clearErrors={this.clearErrors}
              handleJob={this.handleJob}
              completed={completed}
            />
          )} />

          {/* {route === 'login'
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
                />} */}
        </div>
      </BrowserRouter>
    )
  }
}

export default App
