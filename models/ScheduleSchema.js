const mongoose = require('mongoose');

const schedule = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  }
});

export const Schedule = mongoose.model('Schedule', schedule);