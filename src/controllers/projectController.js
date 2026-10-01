const Project = require("../models/Project");
const Task = require("../models/Task");
const { ApiError } = require("../middleware/errorHandler");

const findOwnedProject = async (projectId, userId) => {
  const project = await Project.findOne({ _id: projectId, user: userId });
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  return project;
};

const getProjects = async (req, res) => {
  const projects = await Project.find({ user: req.user.id }).sort({ createdAt: 1 });

  const counts = await Task.aggregate([
    { $match: { project: { $in: projects.map((p) => p._id) } } },
    { $group: { _id: "$project", count: { $sum: 1 } } },
  ]);
  const countByProject = Object.fromEntries(counts.map((c) => [c._id.toString(), c.count]));

  res.json(
    projects.map((project) => ({
      ...project.toJSON(),
      taskCount: countByProject[project.id] || 0,
    }))
  );
};

const createProject = async (req, res) => {
  const project = await Project.create({ user: req.user.id, name: req.body.name });
  res.status(201).json({ ...project.toJSON(), taskCount: 0 });
};

const getProject = async (req, res) => {
  const project = await findOwnedProject(req.params.id, req.user.id);
  res.json(project);
};

const updateProject = async (req, res) => {
  const project = await findOwnedProject(req.params.id, req.user.id);
  project.name = req.body.name;
  await project.save();
  res.json(project);
};

const deleteProject = async (req, res) => {
  const project = await findOwnedProject(req.params.id, req.user.id);
  await Task.deleteMany({ project: project.id });
  await project.deleteOne();
  res.json({ message: "Project deleted" });
};

module.exports = {
  findOwnedProject,
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
};
