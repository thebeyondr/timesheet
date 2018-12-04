import React, { Component } from 'react'
import './Login.css'
import axios from 'axios'
import setAuthHeader from '../../utils/setAuthHeader'
import { withRouter } from 'react-router-dom'

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    e.target.reset()
    const userData = {
      user: {
        email: this.state.email,
        password: this.state.password
      }
    }
    this.setState({
      email: '',
      password: ''
    })
    axios
      .post('/api/users/login', userData)
      .then(res => {
        // Extract token from result
        const { user } = res.data
        window.localStorage.setItem('jwtToken', user.token)
        setAuthHeader(user.token)
        const data = {
          id: user._id,
          address: user.address,
          email: user.email,
          name: user.name
        }
        this.props.clearErrors()
        this.props.loadUser(data)
        this.props.history.push('/home')
      })
      .catch(err => {
        if (err) {
          this.props.handleErrors(err)
        }
      })
  }

  render () {
    const { password, email } = this.state
    const { errors } = this.props
    return (
      <div className='container'>
        <div className='card-panel login-panel'>
          <h4>Login</h4>
          {Object.keys(errors).length > 0 &&
            <div className='red-text'>
              Please enter a valid email and password
            </div>}
          <br />
          <form onSubmit={this.handleSubmit}>
            <div className='input-field col m6'>
              <input
                id='email'
                type='email'
                name='email'
                className='validate'
                value={email}
                onChange={this.handleChange}
                autoComplete='current-email'
                required
              />
              <label htmlFor='email'>Email</label>
            </div>
            <div className='input-field col m6'>
              <input
                id='password'
                type='password'
                name='password'
                className='validate'
                value={password}
                onChange={this.handleChange}
                autoComplete='off'
                required
              />
              <label htmlFor='email'>Password</label>
            </div>
            <button className='btn waves-effect waves-light' type='submit'>
              Sign In
              <i className='material-icons right'>chevron_right</i>
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default withRouter(Login)
