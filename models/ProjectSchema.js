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
  schedule: [{type: mongoose.schema.Types.ObjectId,
              ref:'Schedule'}]
});

export const Projects = mongoose.model('Projects', projects);