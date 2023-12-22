const {
  CreateSchedule,
  UpdateSchedule,
  RemoveById,
  QueryScheduleById
} = require('../services/Schedule');
const { QueryProjectById, CreateNewProject } = require('../services/Projects');
const { QueryByEmail } = require('../services/User');

const CreateNewSchedule = async (req, res) => {
  try {
    const project = await QueryProjectById(req.params);
    if (project) {
      const { description, deadline, status, user } = req.body;
      const object = {
        description: description,
        deadline: deadline,
        status: status,
        user: user ? JSON.parse(user) : null,
        created_at: new Date(),
      }
      if (user && object.user.length > 0) {
        for (const userEmail of object.user) {
          const scheduledUser = await QueryByEmail(userEmail)
            .populate('projects')
          if (scheduledUser) {
            const scheduledProject = await CreateNewProject({
              title: project.title,
              description: project.description,
              created_at: new Date(),
            });
            const schedule = await CreateSchedule(object);
            scheduledProject.schedule.push(schedule)
            await scheduledProject.save();
            scheduledUser.projects.push(scheduledProject);
            await scheduledUser.save();
            project.schedule.push(schedule);
            await project.save();
            return res.status(200).json({
              message: 'Schedule created successfully',
              schedule,
            });
          }
        }
      } else {
        const schedule = await CreateSchedule({ ...req.body });
        project.schedule.push(schedule);
        await project.save();
        return res.status(200).json({
          message: 'Schedule created successfully',
        });
      }
    }
    return res.status(404).json({ message: 'Project not found' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//update a schedule
const UpdateScheduleById = async (req, res) => {
  try{
    const schedule = await QueryScheduleById(req.params);
    if(!schedule){
      return res.status(404).json({message: "Schedule not found"})
    }
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Key value pair cannot be null or empty' });
    }
    const object = {...req.params};
    if(object.user){
      object.user = JSON.parse(object.user);
      if(object.user.length > 0){
        for (const userEmail of object.user) {
          const scheduledUser = await QueryByEmail(userEmail)
            .populate('projects')
          if (scheduledUser) {
            const updatedSchedule = await UpdateSchedule(schedule._id, object);
            return res.status(200).json({
              message: 'Schedule updated successfully',
              updatedSchedule,
            });
          }
        }
      }
    }
    else{
      const updatedSchedule = await UpdateSchedule(schedule._id, object);
      return res.status(200).json({
        message: 'Schedule updated successfully',
        updatedSchedule,
      });
    }
  }
  catch(err){
    return res.status(500).json({message: 'Internal server Error'})
  }
}

module.exports = {
  CreateNewSchedule,
  UpdateScheduleById,
};
