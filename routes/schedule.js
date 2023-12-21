const express = require('express')
const scheduleRouter = express.Router();
const {
    CreateNewSchedule
  } = require('../controllers/scheduleController');


scheduleRouter.post('/api/schedule/create/:_id', CreateNewSchedule)

module.exports = scheduleRouter