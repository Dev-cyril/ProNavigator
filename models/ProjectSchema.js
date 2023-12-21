const mongoose = require('mongoose');

const projects = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  schedule: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', autopopulate: true }],
});

const Projects = mongoose.model('Projects', projects);
module.exports = Projects;
