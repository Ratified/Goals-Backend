const express = require('express');
const router = express.Router();
const GoalController = require('../controllers/goalController')

const { getGoals, getGoalById, createGoal, updateGoal, deleteGoal } = GoalController;

const protect = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getGoals)
    .post(protect, createGoal);

router.route('/:id')
    .get(protect, getGoalById)
    .put(protect, updateGoal)
    .delete(protect, deleteGoal);

module.exports = router;