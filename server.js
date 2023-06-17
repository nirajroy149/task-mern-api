import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import "dotenv/config";

const app = express();

app.use(express.json());
app.use(cors());

// for getting the data in post request
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.port;

const DB_URL = process.env.DB_URL;

// connection to mongodb
mongoose
  .connect(DB_URL, {
    dbName: "backend",
  })
  .then(() => console.log("Database Connected"))
  .catch(() => console.log("Error occured while connecting database"));

//mongoose Schema Creation
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  isCompleted: Boolean
});

//creating modal(collection) in the db-backend
const Task = mongoose.model("Task", taskSchema);

// api for getting all tasks
app.get("/getTasks", async (req, res) => {
  try{
    const tasks = await Task.find();
    res.send(tasks);
  }catch(err){
    console.log(err);
  }
});

// api for adding a task
app.post("/addTask", async (req, res) => {
  const { title, description, isCompleted } = req.body;
  Task.create({ title, description, isCompleted })
    .then((data) => {
      console.log("Added Successfully...");
      console.log(data);
      res.send(data);
    })
    .catch((err) => console.log(err));
});

// api for deleting a task
app.post("/deleteTask", async (req, res) => {
  const { _id } = req.body;

  Task.findByIdAndDelete(_id)
    .then(() => res.set(201).send("Deleted Successfully..."))
    .catch((err) => console.log(err));
});

// api for deleting all task
app.post("/deleteAll", async (req, res) => {
  Task.deleteMany()
  .then(() => res.set(201).send("Deleted All Successfully..."))
  .catch((err) => console.log(err));
});
// api for updating task
app.post("/updateTask",async (req,res)=>{
    const {_id} = req.body;
    const { title, description, statuisCompleteds } = req.body;
    Task.findByIdAndUpdate(_id,{title,description,isCompleted})
    .then(() => res.send("Updated..."))
    .catch((err) => console.log(err));
})

app.listen(PORT, (req, res) => {
  console.log("Server running on port " + PORT);
});
