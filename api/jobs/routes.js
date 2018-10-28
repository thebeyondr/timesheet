const router = require('express').Router()
const auth = require('../auth')
const Job = require('./model')
const Users = require('../users/model')
const Duration = require('duration')

/**
 * @route POST /api/jobs/
 * @desc Add a job
 * @access Private
*/
router.post('/', auth.required, (req, res) => {
  const { payload: { id }, body: { job } } = req

  if (!job.client) {
    return res.status(422).json({
      errors: {
        client: 'This is required'
      }
    })
  }
  if (!job.title) {
    return res.status(422).json({
      errors: {
        title: 'This is required'
      }
    })
  }

  Users.findById(id)
    .then(user => {
      const newJob = new Job({
        title: job.title,
        client: job.client,
        addedBy: id
      })
      newJob.save().then(job => res.status(200).json(job)).catch(err => {
        if (err) {
          res.status(400).json({
            error: {
              message: 'Save failed'
            }
          })
        }
      })
    })
    .catch(err => {
      if (err) {
        res.status(400).json({
          error: {
            message: "You can't make this request."
          }
        })
      }
    })
})

/**
 * @route GET /api/jobs/:jobId
 * @desc Get specific job
 * @access Private
*/
router.get('/:jobId', auth.required, (req, res) => {
  Job.findOne({ isCompleted: false, _id: req.params.jobId })
    // We don't need these fields
    .select('-__v  -isCompleted')
    .populate('client')
    .populate('addedBy', 'name')
    .populate('tasks.user', 'name')
    .exec()
    .then(job => {
      // Make new tasks, adding the duration
      const newTasks = job.tasks.map(task => {
        let duration = new Duration(
          new Date(task.time_start),
          new Date(task.time_end)
        )
        duration = duration.toString('%Hsh %Mm')
        // console.log('duration', taskdur)
        return {
          _id: task._id,
          comments: task.comments,
          time_start: task.time_start,
          time_end: task.time_end,
          user: task.user,
          duration
        }
      })
      const newJob = {
        _id: job._id,
        title: job.title,
        client: job.client,
        addedBy: job.addedBy,
        tasks: newTasks
      }
      res.status(200).json(newJob)
    })
    .catch(err => {
      if (err) {
        res.status(404).json({
          error: {
            message: 'Could not find this job',
            err: err.message
          }
        })
      }
    })
})

/**
 * @route PATCH /api/jobs/:jobId
 * @desc Mark job as completed
 * @access Private
*/
router.patch('/:jobId', auth.required, (req, res) => {
  Job.findByIdAndUpdate(req.params.jobId, { isCompleted: true }, { new: true })
    .then(job => {
      res.status(200).json(job)
    })
    .catch(err => {
      if (err) {
        res.status(404).json({
          error: {
            message: 'Could not find this job',
            err: err.message
          }
        })
      }
    })
})

/**
 * @route POST /api/jobs/:jobId/tasks
 * @desc Get specific job
 * @access Private
*/
router.post('/:jobId/tasks', auth.required, (req, res) => {
  const { payload: { id }, body: { task } } = req
  if (!task.comments) {
    return res.status(422).json({
      errors: {
        comments: 'This is required'
      }
    })
  }
  if (!task.time_start) {
    return res.status(422).json({
      errors: {
        time_start: 'This is required'
      }
    })
  }
  if (!task.time_end) {
    return res.status(422).json({
      errors: {
        time_end: 'This is required'
      }
    })
  }

  if (
    new Date(task.time_end).getTime() <= new Date(task.time_start).getTime()
  ) {
    return res.status(400).json({
      errors: {
        time: 'End time must be after start time'
      }
    })
  }

  Users.findById(id)
    .then(user => {
      Job.findOne({ isCompleted: false, _id: req.params.jobId })
        .then(job => {
          // Make new tasks, adding the duration
          const newTask = {
            comments: task.comments,
            time_start: task.time_start,
            time_end: task.time_end,
            user: user._id
          }
          job.tasks.unshift(newTask)
          job.save().then(job => res.json(job))
        })
        .catch(err => {
          throw new Error(err)
        })
    })
    .catch(err => {
      if (err) {
        res.status(404).json({
          error: {
            message: 'Could not update tasks'
          }
        })
      }
    })
})

/**
 * @route GET /api/jobs/
 * @desc Get all jobs that are not complete
 * @access Private
*/
router.get('/', auth.required, (req, res) => {
  Job.find({ isCompleted: false })
    // We don't need these fields
    .select('-__v  -isCompleted')
    .populate('client', 'name')
    .populate('addedBy', 'name')
    .exec()
    .then(jobs => {
      // replaces the tasks for a taskCount
      const newJobs = jobs.map(job => {
        return {
          _id: job._id,
          title: job.title,
          client: job.client,
          addedBy: job.addedBy,
          taskCount: job.tasks.length
        }
      })
      res.status(200).json(newJobs)
    })
    .catch(err => {
      if (err) {
        res.status(404).json({
          error: {
            message: 'Could not find any jobs',
            err: err.message
          }
        })
      }
    })
})

module.exports = router
