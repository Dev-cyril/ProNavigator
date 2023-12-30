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
  created_at: Date,
  updated_at: {type: Date, required:false},
  schedule: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' }],
});

const Projects = mongoose.model('Projects', projects);
module.exports = Projects;
