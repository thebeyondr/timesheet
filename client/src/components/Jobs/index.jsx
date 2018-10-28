import React, { Component } from 'react'
import JobsDisplay from './JobsDisplay'
import JobForm from './JobForm'
import PropTypes from 'prop-types'
import axios from 'axios'

const propTypes = {
  handleErrors: PropTypes.func.isRequired,
  handleJob: PropTypes.func.isRequired
}

class Jobs extends Component {
  constructor (props) {
    super(props)
    this.state = {
      jobs: [],
      clients: []
    }
  }
  getJobs = () => {
    axios
      .get('/api/jobs')
      .then(res => {
        this.setState({ jobs: res.data })
      })
      .catch(err => {
        if (err) {
          console.log('Error', err.message)
        }
      })
  }
  getClients = () => {
    axios
      .get('/api/clients')
      .then(res => {
        this.setState({ clients: res.data })
      })
      .catch(err => {
        if (err) {
          console.log('Error', err.message)
        }
      })
  }
  addJob = job => {
    this.setState(prevSate => ({
      jobs: [...prevSate.jobs, job]
    }))
  }
  componentDidMount = () => {
    // Get jobs and clients
    this.getJobs()
    this.getClients()
    if (this.props.completed) {
      window.M.toast(
        { html: `${this.props.completed} has been completed!`, classes: 'green' },
        4000
      )
    }
  }

  render () {
    const { jobs, clients } = this.state
    return (
      <div className='container'>
        {/* <div className='card-panel green white-text'>
          Package Design is now complete!
        </div> */}
        <JobsDisplay jobs={jobs} handleJob={this.props.handleJob} />
        <JobForm clients={clients} addJob={this.addJob} />
      </div>
    )
  }
}

Jobs.propTypes = propTypes
export default Jobs
