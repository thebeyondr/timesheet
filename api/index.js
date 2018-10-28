const express = require('express')
const router = express.Router()

router.use('/api/users', require('./users/routes'))
router.use('/api/clients', require('./clients/routes'))
router.use('/api/jobs', require('./jobs/routes'))

module.exports = router
