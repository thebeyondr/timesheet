import React from 'react'
import { PropTypes } from 'prop-types'
import Loader from '../common/Loader'

const JobsDisplay = ({ jobs, handleJob }) => {
  const jobsContent = jobs.length > 0
    ? jobs.map(job => {
      return (
        <div className='collection-item' key={job._id}>
          <h5>
            {job.title} {job.taskCount > 0 &&
            <span className='new badge' data-badge-caption='tasks'>
              {job.taskCount}
            </span>}
          </h5>
          <div className='secondary-content'>
            <span>
              <u
                className='clickable blue-text'
                onClick={handleJob}
                data-job-id={job._id}
              >
                  Add/View Tasks
              </u>
            </span>
            {' '}
          </div>
          <h6 className='blue-grey-text lighten-2'>
              for <strong>{job.client.name}</strong>
          </h6>
          <span className='blue-grey-text lighten-5'>
            <em>added by {job.addedBy.name}</em>
          </span>
        </div>
      )
    })
    : <Loader />
  return (
    <div className='collection with-header container'>
      <div className='collection-header'>
        <h4 className='teal-text'>Active Jobs</h4>
      </div>
      {jobsContent}
    </div>
  )
}

JobsDisplay.propTypes = {
  handleJob: PropTypes.func.isRequired,
  jobs: PropTypes.array.isRequired
}

export default JobsDisplay
