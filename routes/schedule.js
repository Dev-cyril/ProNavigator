const express = require('express')
const scheduleRouter = express.Router();
const {
    CreateNewSchedule,
    UpdateScheduleById
  } = require('../controllers/scheduleController');


scheduleRouter.post('/api/schedule/create/:_id', CreateNewSchedule)
scheduleRouter.put('/api/schedule/update/:_id', UpdateScheduleById)

module.exports = scheduleRouter