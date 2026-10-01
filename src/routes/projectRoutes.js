const router = require("express").Router();
const protect = require("../middleware/auth");
const validators = require("../middleware/validators");
const project = require("../controllers/projectController");
const task = require("../controllers/taskController");

router.use(protect);

router.get("/", project.getProjects);
router.post("/", validators.createProject, project.createProject);
router.get("/:id", validators.id, project.getProject);
router.patch("/:id", validators.updateProject, project.updateProject);
router.delete("/:id", validators.id, project.deleteProject);

router.get("/:id/tasks", validators.id, task.getProjectTasks);
router.post("/:id/tasks", validators.createTask, task.createTask);

module.exports = router;
