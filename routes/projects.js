const express = require('express');
const projectRoute = express.Router()

const {
    Createproject,
    UpdateAProject,
    GetProject,
    DeleteProject
  } = require('../controllers/projectController');

projectRoute.post('/api/project/create/:_id', Createproject)
projectRoute.put('/api/project/update/:_id', UpdateAProject)
projectRoute.get('/api/project/:_id', GetProject);
projectRoute.delete('/api/project/:_id/delete', DeleteProject)

module.exports = projectRoute