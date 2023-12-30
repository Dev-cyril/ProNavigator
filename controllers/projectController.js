const {CreateNewProject,
       QueryProjectById,
         UpdateProject,
         RemoveById} = require('../services/Projects')
const {RemoveScheduleById} = require('../services/Schedule')
const {QueryById} = require('../services/User')

// create a new Project
const Createproject = async (req, res) => {
  try {
    const user = await QueryById(req.params).populate('projects').exec();

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const { description, title } = req.body;

    if (!description || !title) {
      return res.status(400).json({ message: 'Both "description" and "title" are required in the request body' });
    }
    const newProject = await CreateNewProject({
      description: description,
      title: title,
      created_at: new Date(),
    });
    
    user.projects.push(newProject);
    await user.save();

    res.status(200).json({message: "Project created succesfully", newProject});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating project', error: err.message });
  }
};

// fetch a project
const GetProject = async (req, res) => {
  try{
    const project = await QueryProjectById(req.params)
      .populate('schedule').exec();
    if (!project) {
      res.status(404).json({message: "Project not found"});
    }
    res.status(200).json(project);
  }
  catch(err){
    res.status(500).json({message: "Error fetching project", error: err.message})
  }
}

// Update a project
const UpdateAProject = async (req, res) => {
  try {
    const project = await QueryProjectById(req.params);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Key value pair cannot be null or empty' });
    }

    const updateObject = { ...req.body, updated_at: new Date() };

    const updatedProject = await UpdateProject(project._id, updateObject);
    res.status(200).json({message: "Update successful", updatedProject});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating project', error: err.message });
  }
};

//delete a project
const DeleteProject = async (req, res) => {
  try {
    const project = await QueryProjectById(req.params);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    // console.log(userModel)
    // const users = await UserModel.find(project)
    // console.log(users)
    // res.json("Done")
    // if(users.length >0){
    //   for(const user of users){
    //     const index = user.projects.findIndex(proj => proj._id.toString() === req.params._id);
    //     if(index !== -1){
    //       user.projects.splice(index, 1);
    //       await user.save()
    //     }
    //   }
    // }
    const schedulesToDelete = project.schedule;
    if(schedulesToDelete.length > 0){
      for (const schedule of schedulesToDelete) {
        await RemoveScheduleById(schedule._id);
      } 
    }
    const deletedProject = await RemoveById(project._id);
    res.status(200).json({ message: 'Project deleted', deletedProject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting project', error: err.message });
  }
};


module.exports = {
  Createproject,
  UpdateAProject,
  DeleteProject,
  GetProject,
}