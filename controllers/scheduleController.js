const {
  CreateSchedule,
  UpdateSchedule,
  RemoveScheduleById,
  QueryScheduleById
} = require('../services/Schedule');
const { QueryProjectById, CreateNewProject } = require('../services/Projects');
const { QueryByEmail } = require('../services/User');
const Projects = require('../models/ProjectSchema');

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
            scheduledUser.projects.push(project);
            await scheduledUser.save();

            project.schedule.push(await CreateSchedule(object));
            await project.save();
          }
        };
        return res.status(200).json({
          message: 'Schedule created successfully',
          schedule,
        });
      } else {
        const schedule = await CreateSchedule(object);
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
  try {
    const schedule = await QueryScheduleById(req.params._id);

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ message: 'Key value pair cannot be null or empty' });
    }

    const object = { updated_at: new Date(), ...req.body };

    if (object.user) {
      object.user = JSON.parse(object.user);
      const projects = await Projects.find({});

      if (!projects || projects.length === 0) {
        return res.status(404).json({ message: 'Projects not found' });
      }

      // Check if the schedule exists in any project
      const projectWithSchedule = projects.find((proj) =>
        proj.schedule.some((ele) => ele._id.toString() === req.params._id)
      );

      if (!projectWithSchedule) {
        return res.status(404).json({
          message: 'Schedule not found in any project',
        });
      }

      // Iterate through users and handle edge cases
      for (const userEmail of object.user) {
        const scheduledUser = await QueryByEmail(userEmail).populate(
          'projects'
        );

        if (scheduledUser) {
          const userHasProject = scheduledUser.projects.some(
            (proj) => proj._id.toString() === projectWithSchedule._id.toString()
          );

          if (!userHasProject) {
            // Case 1: User exists but does not have the project
            scheduledUser.projects.push(projectWithSchedule);
            await scheduledUser.save();
          }

          const userHasSchedule = scheduledUser.projects.some(
            (proj) =>
              proj.schedule.some(
                (ele) => ele._id.toString() === req.params._id
              )
          );

          if (!userHasSchedule) {
            // Case 2: User has the project but does not have the schedule
            const userProject = scheduledUser.projects.find(
              (proj) => proj._id.toString() === projectWithSchedule._id.toString()
            );
            userProject.schedule.push(schedule);
            await userProject.save();
          }
        }
      }
      // Case 3: User has the project and the schedule
      const updatedSchedule = await UpdateSchedule(schedule._id, object);
      return res.status(200).json({
        message: 'Schedule updated successfully',
        updatedSchedule,
      });
    } else {
      // Case 4: No user specified in the update
      const updatedSchedule = await UpdateSchedule(schedule._id, object);
      return res.status(200).json({
        message: 'Schedule updated successfully',
        updatedSchedule,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


//delete schedule
const DeleteSchedule = async (req, res) => {
  try{
    const schedule = await QueryScheduleById(req.params._id)
    if(!schedule)
      res.status(404).json({mesage: "schedule not found"})
    // const projects = await Projects.find({ schedule: req.params._id });
    // console.log(projects)
    // for (const project of projects) {
    //   const index = project.schedule.indexOf(req.params._id);
    //   if (index !== -1) {
    //     project.schedule.splice(index, 1);
    //     await project.save();
    //   }
    // }
    await RemoveScheduleById(req.params._id)
    res.status(200).json({message: "schedule deleted successfully"})
  }
  catch(err){
    res.status(500).json(err)
  }
}
module.exports = {
  CreateNewSchedule,
  UpdateScheduleById,
  DeleteSchedule
};
