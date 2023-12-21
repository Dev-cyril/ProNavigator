const Schedule = require('../models/ScheduleSchema');

//return a created schedule
const CreateSchedule = (object) => {
  return Schedule.create(object)
}

//updated a schedule
const UpdateSchedule = (scheduleId, update) => {
  return Schedule.findOneAndUpdate(
    {_id: scheduleId},
    {$set: update},
    { new: true }) 
}

//delete schedule
const RemoveById = (scheduleId) => {
  return projectId.findByIdAndDelete(scheduleId)
}

module.exports = {
  CreateSchedule,
  UpdateSchedule,
  RemoveById
}