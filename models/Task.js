const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

TaskSchema.index({ userId: 1, title: 1 }, { unique: true });

module.exports = mongoose.model('Task', TaskSchema);
