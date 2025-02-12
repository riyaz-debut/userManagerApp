const mongoose = require('mongoose');
const Task = require('../models/Task'); // Import Task model


// create task function
exports.createTask = async (req, res) => {
    try {
        console.log("User in createTask:", req.user);

        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: "Unauthorized: Invalid user" });
        }

        const { title } = req.body;
        if (!title) return res.status(400).json({ error: "Title is required" });

        const userId = new mongoose.Types.ObjectId(req.user.userId); // Convert to ObjectId

        const task = new Task({ userId, title }); 
        await task.save();

        res.status(201).json({ message: "Task added successfully", task });
    } catch (err) {
        console.error("Error creating task:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// mark/unmark status of task
exports.toggleTask = async (req, res) => {
    try {
        console.log("User in toggleTask:", req.user);
        console.log("Task ID in request:", req.params.id);

        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(req.params.id) || !mongoose.Types.ObjectId.isValid(req.user.userId)) {
            return res.status(400).json({ error: "Invalid Task ID or User ID" });
        }

        // Convert IDs
        const userId = new mongoose.Types.ObjectId(req.user.userId);
        const taskId = new mongoose.Types.ObjectId(req.params.id);

        console.log("Converted taskId:", taskId.toString());
        console.log("Converted userId:", userId.toString());

        // Find the task for updating the status
        const task = await Task.findOne({ _id: taskId, userId: userId });

        if (!task) {
            console.log("Task not found in DB");
            return res.status(404).json({ error: 'Task not found' });
        }

        // Toggle task completion
        task.completed = !task.completed;
        await task.save();

        res.json({ message: 'Task updated successfully', task });
    } catch (error) {
        console.error("Error in toggleTask:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// get task lists with paination
exports.getTasks = async (req, res) => {
    try {
        console.log("User in toggleTask:", req.user);
        const { search = '', limit = 10, cursor } = req.query;
        const query = { userId: req.user.userId };

        // Search filter
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        // Cursor-based pagination
        if (cursor) {
            query._id = { $lt: cursor }; // Get tasks created before the cursor
        }

        const tasks = await Task.find(query)
            .sort({ _id: -1 }) // Sorting in descending order (newest first)
            .limit(Number(limit) + 1);

        const hasNextPage = tasks.length > limit;
        if (hasNextPage) tasks.pop();

        res.json({ 
            tasks, 
            nextCursor: hasNextPage ? tasks[tasks.length - 1]._id : null 
        });
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ error: 'Server error' });
    }
};
