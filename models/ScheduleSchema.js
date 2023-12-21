const mongoose = require('mongoose');

const schedule = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  deadline: {
    type: String,
    required: true
  },
  status: String,
  user: {
    type: [String]
  }
});

const Schedule = mongoose.model('Schedule', schedule);
module.exports = Schedule;