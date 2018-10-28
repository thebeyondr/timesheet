const router = require('express').Router()
const auth = require('../auth')
const Clients = require('./model')

/**
 * @route GET /api/clients/
 * @desc Get all clients
 * @access Private
*/
router.get('/', auth.optional, (req, res) => {
  Clients.find({})
    .select('-__v')
    .then(clients => {
      res.status(200).json(clients)
    })
    .catch(err => {
      if (err) {
        res.status(404).json({
          error: {
            message: 'Could not find clients'
          }
        })
      }
    })
})

module.exports = router
