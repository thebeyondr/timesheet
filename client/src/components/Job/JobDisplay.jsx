import React from 'react'
import { PropTypes } from 'prop-types'
import Loader from '../common/Loader'
import Time from 'react-time-format'
import axios from 'axios'

const JobDisplay = ({ job, changeRoute, markCompleted }) => {
  const handleBackClick = e => {
    changeRoute('home')
  }
  const handleMarkCompleted = e => {
    axios.patch(`/api/jobs/${job._id}`).then(res => {
      markCompleted(res.data.title)
      changeRoute('home')
    })
  }
  const hasTasks = job.tasks && job.tasks.length > 0

  const tasksContent = hasTasks
    ? job.tasks.map(task => {
      return (
        <div className='collection-item' key={task._id}>
          <div className='row'>
            <div className='col m6'>
              <h5 className='mat-color'>
                <strong><time>{task.duration}</time></strong>
              </h5>
              <span className='grey-text lighten-1'>
                <em>by {task.user.name}</em>
              </span>
              <div>
                <strong>Started at: </strong>
                <Time
                  value={new Date(task.time_start)}
                  date='YYYY-MM-DD HH:MM'
                />
                <br />
                <strong>Lasted until: </strong>
                <Time
                  value={new Date(task.time_end)}
                  date='YYYY-MM-DD HH:MM'
                />
              </div>
            </div>
            <div className='col m6'>
              <h6 className='grey-text'>
                <em>Comments</em>
              </h6>
              <blockquote>
                {task.comments}
              </blockquote>
            </div>
          </div>
        </div>
      )
    })
    : <div className='collection-item'><h5>No tasks yet...</h5></div>
  return (
    <div>
      {Object.keys(job).length
        ? <div className='card-panel div-center container'>
          <u onClick={handleBackClick} className='clickable blue-text'>
              Back to Jobs
          </u>
          <h5>
            <span className='cyan-text'>{job.title}</span>
            {hasTasks &&
            <span className='secondary-content'>
              <button
                type='button'
                className='btn btn-small waves-effect waves-green'
                onClick={handleMarkCompleted}
              >
                <i className='material-icons left'>check_circle</i>
                {' '}Mark as complete{' '}
              </button>
            </span>}
          </h5>
          <p>
            <strong className='grey-text'>Client</strong> <br />
            <span>{job.client.name}</span>
          </p>
          <p>
            <strong className='grey-text'>Manager</strong> <br />
            <span>
              {job.client.managerName}, {job.client.managerPosition}
            </span>
          </p>
        </div>
        : <Loader />}
      <br />
      <div className='collection container'>
        {tasksContent}
      </div>
    </div>
  )
}

JobDisplay.propTypes = {
  job: PropTypes.object.isRequired
}

export default JobDisplay
