const express = require('express')
const scheduleRouter = express.Router();
const {
    CreateNewSchedule,
    UpdateScheduleById,
  DeleteSchedule
  } = require('../controllers/scheduleController');


scheduleRouter.post('/api/schedule/create/:_id', CreateNewSchedule)
scheduleRouter.put('/api/schedule/update/:_id', UpdateScheduleById)
scheduleRouter.delete('/api/schedule/delete/:_id', DeleteSchedule)

module.exports = scheduleRouter