const Projects = require('../models/ProjectSchema');

// create a project
const CreateNewProject = (projectData) => {
  return Projects.create(projectData);
};

// Return all projects
const QueryProjectById = (id) => {
  return Projects.findOne({_id: id})
}

// Return Updated project after edit
const UpdateProject = (projectId, update) => {
  return Projects.findOneAndUpdate(
    {_id: projectId},
    {$set: update},
    { new: true })
}

//Return updated project list after deletion
const RemoveById = (projectId) => {
  return Projects.findByIdAndDelete(projectId)
}

module.exports = {
  CreateNewProject,
  QueryProjectById,
  UpdateProject,
  RemoveById
}