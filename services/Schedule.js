const Schedule = require('../models/ScheduleSchema');

//return a created schedule
const CreateSchedule = (object) => {
  return Schedule.create(object)
}

//query schedule db
const QueryScheduleById = (id) => {
  return Schedule.findById({_id: id})
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
  RemoveById,
  QueryScheduleById
}