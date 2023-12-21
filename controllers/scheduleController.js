const {
  CreateSchedule,
  UpdateSchedule,
  RemoveById
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
        user: user ? JSON.parse(user) : null
      }
      if (user && object.user.length > 0) {
        for (const userEmail of object.user) {
          const scheduledUser = await QueryByEmail(userEmail)
            .populate('projects.schedule');
          if (scheduledUser) {
            const scheduledProject = await CreateNewProject({
              title: project.title,
              description: project.description,
            });
            const schedule = await CreateSchedule(object);
            scheduledUser.projects.push(scheduledProject);
            await scheduledUser.save();
            const projectIndex = scheduledUser.projects
              .indexOf(scheduledProject)
            const arrayOfSchedules = scheduledUser
              .projects[projectIndex]
            console.log(projectIndex)
            console.log(arrayOfSchedules)
            arrayOfSchedules.push(schedule);
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

module.exports = {
  CreateNewSchedule,
};
