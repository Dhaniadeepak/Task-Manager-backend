const mongoose = require("mongoose");
const { TASK_STATUSES } = require("../config/constants");

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    title: { type: String, required: [true, "Task title is required"], trim: true, maxlength: 200 },
    status: { type: String, enum: TASK_STATUSES, default: "todo" },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.projectId = ret.project.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.project;
        delete ret.user;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Task", taskSchema);
