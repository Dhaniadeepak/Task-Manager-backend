const Task = require("../models/Task");
const { findOwnedProject } = require("./projectController");
const { ApiError } = require("../middleware/errorHandler");

const getProjectTasks = async (req, res) => {
  const project = await findOwnedProject(req.params.id, req.user.id);
  const tasks = await Task.find({ project: project.id }).sort({ createdAt: 1 });
  res.json(tasks);
};

const createTask = async (req, res) => {
  const project = await findOwnedProject(req.params.id, req.user.id);
  const { title, status } = req.body;

  const task = await Task.create({
    user: req.user.id,
    project: project.id,
    title,
    ...(status && { status }),
  });
  res.status(201).json(task);
};

const updateTask = async (req, res) => {
  const { title, status } = req.body || {};
  const updates = {
    ...(title !== undefined && { title }),
    ...(status !== undefined && { status }),
  };

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    updates,
    { new: true, runValidators: true }
  );
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  res.json(task);
};

const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  res.json({ message: "Task deleted" });
};

module.exports = { getProjectTasks, createTask, updateTask, deleteTask };
