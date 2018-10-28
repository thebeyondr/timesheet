import React, { Component } from 'react'
import JobDisplay from './JobDisplay'
import PropTypes from 'prop-types'
import axios from 'axios'
import TaskForm from './TaskForm'

const propTypes = {
  jobId: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  changeRoute: PropTypes.func.isRequired
}

class Job extends Component {
  constructor (props) {
    super(props)
    this.state = {
      job: {}
    }
  }
  getJob = () => {
    axios
      .get(`/api/jobs/${this.props.jobId}`)
      .then(res => {
        // const { tasks } = res.data
        // const { user } = this.props
        // const newTasks = tasks.filter(task => task.user._id === user.id)
        // res.data.tasks = newTasks
        this.setState({ job: res.data })
      })
      .catch(err => {
        if (err) {
          console.log('Error', err.message)
        }
      })
  }
  addTask = task => {
    this.setState(prevState => ({
      job: { ...prevState.job, tasks: [...prevState.job.tasks, task] }
    }))
  }
  componentDidMount = () => {
    // Get job
    this.getJob()
  }

  render () {
    return (
      <div className='container'>
        <JobDisplay
          job={this.state.job}
          changeRoute={this.props.changeRoute}
          markCompleted={this.props.markCompleted}
        />
        <TaskForm
          addTask={this.addTask}
          job={this.state.job}
          handleErrors={this.props.handleErrors}
          clearErrors={this.props.clearErrors}
          errors={this.props.errors}
        />
        {/* <JobForm addTask={this.addTask} /> */}
      </div>
    )
  }
}

Job.propTypes = propTypes
export default Job
