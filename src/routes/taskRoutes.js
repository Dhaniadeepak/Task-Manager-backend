const router = require("express").Router();
const protect = require("../middleware/auth");
const validators = require("../middleware/validators");
const task = require("../controllers/taskController");

router.use(protect);

router.patch("/:id", validators.updateTask, task.updateTask);
router.delete("/:id", validators.id, task.deleteTask);

module.exports = router;
