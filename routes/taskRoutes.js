const express = require('express');
const { createTask, toggleTask, getTasks } = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createTask);
router.put('/:id/toggle', authMiddleware, toggleTask);
router.get('/', authMiddleware, getTasks);

module.exports = router;
