const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const mySecret = process.env['MONGO_URI'];
const router = require("./routes/users");
const projectRoute = require("./routes/projects")
const scheduleRouter = require("./routes/schedule")
const bodyParser = require('body-parser')

mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use("/", router);
app.use("/", projectRoute)
app.use("/", scheduleRouter)

app.listen(3000, () => console.log("Listening to port 3000"));
