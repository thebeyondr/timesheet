import React, { Component } from 'react'
import axios from 'axios'

class JobForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      title: '',
      client: ''
    }
  }
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  handleSubmit = e => {
    e.preventDefault()
    const { title, client } = this.state
    const jobData = {
      job: {
        title,
        client
      }
    }
    this.setState({
      title: '',
      client: ''
    })
    axios
      .post('/api/jobs', jobData)
      .then(res => {
        axios.get(`/api/jobs/${res.data._id}`).then(res => {
          this.props.addJob(res.data)
        })
      })
      .catch(err => {
        if (err) {
          console.log('Error', err.message)
        }
      })
  }
  render () {
    const { client, title } = this.state
    const { clients } = this.props
    const clientOptions = clients.map(client => {
      return (
        <option value={client._id} key={client._id}>
          {client.name}: {client.managerName}, {client.managerPosition}
        </option>
      )
    })
    return (
      <div className='container'>
        <div className='card-panel'>
          <h5>Add Job</h5>
          <br />
          <form onSubmit={this.handleSubmit}>
            <div className='input-field col m6'>
              <input
                id='title'
                type='text'
                name='title'
                className='validate'
                value={title}
                onChange={this.handleChange}
                required
              />
              <label htmlFor='title'>Job Title</label>
            </div>
            <div className='input-field col m6'>
              <select
                name='client'
                className='browser-default'
                value={client}
                onChange={this.handleChange}
                required
              >
                <option value='0'>Select a client</option>
                {clientOptions}
              </select>
            </div>
            <button className='btn waves-effect waves-light' type='submit'>
              Add Job
              <i className='material-icons right'>send</i>
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default JobForm
