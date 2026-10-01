const router = require("express").Router();

router.get("/health", (req, res) => res.json({ status: "ok" }));
router.use("/auth", require("./authRoutes"));
router.use("/projects", require("./projectRoutes"));
router.use("/tasks", require("./taskRoutes"));

module.exports = router;
