import React, { Component } from 'react'
import axios from 'axios'
import Datetime from 'react-datetime'
import { PropTypes } from 'prop-types'
import './react-datetime.css'

class TaskForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      comments: '',
      startTime: '',
      endTime: ''
    }
  }
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  handleStartDateTime = e => {
    this.setState({
      startTime: e._d
    })
  }
  handleEndDateTime = e => {
    this.setState({
      endTime: e._d
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { comments, startTime, endTime } = this.state
    const taskData = {
      task: {
        comments,
        time_start: startTime.toISOString(),
        time_end: endTime.toISOString()
      }
    }
    axios
      .post(`/api/jobs/${this.props.job._id}/tasks`, taskData)
      .then(res => {
        const taskId = res.data.tasks[0]._id
        axios.get(`/api/jobs/${this.props.job._id}`).then(res => {
          const newTask = res.data.tasks.filter(task => task._id === taskId)
          this.props.addTask(newTask[0])
          this.props.clearErrors()
        })
      })
      .catch(err => {
        if (err) {
          this.props.handleErrors(err.response.data.errors)
        }
      })
    // console.log(taskData)
    // this.props.addTask(taskData)
    this.setState({
      comments: '',
      startTime: '',
      endTime: ''
    })
  }
  render () {
    const { startTime, endTime, comments } = this.state
    return (
      <div className='container'>
        <div className='card-panel'>
          <h5>New Task</h5>
          <br />
          <form onSubmit={this.handleSubmit}>
            <div className='input-field col m6'>
              <textarea
                id='comments'
                type='text'
                name='comments'
                className='materialize-textarea'
                value={comments}
                onChange={this.handleChange}
                required
              />
              <label htmlFor='comments'>Comment</label>
            </div>
            <div className='datepicker'>
              <Datetime
                name='startTime'
                value={startTime}
                onChange={this.handleStartDateTime}
                required
              />
              <label htmlFor='startTime'>Starting Date & Time</label>
              <br />
              {this.props.errors.time &&
                <span className='red-text helper-text'>
                  {this.props.errors.time}
                </span>}
            </div>
            <div className='datepicker'>
              <Datetime
                name='endTime'
                value={endTime}
                onChange={this.handleEndDateTime}
                required
              />
              <label htmlFor='endTime'>Ending Date & Time</label>
              <br />
              {this.props.errors.time &&
                <span className='red-text helper-text'>
                  {this.props.errors.time}
                </span>}
            </div>
            <br />
            <button className='btn waves-effect waves-light' type='submit'>
              Add Task
              <i className='material-icons right'>send</i>
            </button>
          </form>
        </div>
      </div>
    )
  }
}

TaskForm.propTypes = {
  addTask: PropTypes.func.isRequired,
  job: PropTypes.object.isRequired
}
export default TaskForm
