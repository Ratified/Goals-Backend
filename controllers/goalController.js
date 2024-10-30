const asyncHandler = require('express-async-handler');
const Goal = require('../models/goalModel');
const User = require('../models/userModel');

// @desc : Get Goals
// @route : GET /api/goals
// @access : Private
const getGoals = asyncHandler(async(req, res) => {
    const goals = await Goal.find({ user: req.user._id });

    res.status(200).json({ goals: goals });
})

// @desc : Get Goals
// @route : GET /api/goals
// @access : Private
const getGoalById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const goal = await Goal.findById(id);

    if (!goal) {
        return res.status(404).json({ message: 'Goal not found' });
    }

    const user = await User.findById(req.user._id);

    if(!user){
        res.status(404).json({ message: 'User not found' });
    }

    if(goal.user.toString() !== user.id){
        res.status(401).json({ message: 'User not authorized' });
    }

    res.status(200).json({ goal: goal });
})

// @desc : Set Goals
// @route : POST /api/goals
// @access : Private
// @access : Private
const createGoal = asyncHandler(async(req, res) => {
    // Check if the 'text' field is provided in the request body
    if (!req.body.text) {
        return res.status(400).json({ message: 'Please enter a goal' });
    }

    const goal = await Goal.create({
        text: req.body.text,
        user: req.user._id,
    });

    // Return a success response with status code 201
    res.status(201).json({
        message: 'Goal created successfully',
        goal: goal, 
    });
});

// @desc : Update Goals
// @route : PUT /api/goals/:id
// @access : Private
const updateGoal = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the goal ID from the request parameters

    // Find the goal by ID
    const goal = await Goal.findById(id);

    // Check if the goal exists
    if (!goal) {
        return res.status(404).json({ message: 'Goal not found' });
    }

    const user = await User.findById(req.user._id);

    if(!user){
        res.status(404).json({ message: 'User not found' });
    }

    if(goal.user.toString() !== user.id){
        res.status(401).json({ message: 'User not authorized' });
    }

    // Update the goal with the data from req.body
    const updatedGoal = await Goal.findByIdAndUpdate(id, req.body, {
        new: true, // This option ensures the updated document is returned
        runValidators: true, // Ensures the update respects the model's schema validation
    });

    // Send the updated goal in the response
    res.status(200).json({ message: 'Goal updated successfully', updatedGoal });
});

// @desc : Delete Goals
// @route : GET /api/goals/:id
// @access : Private
const deleteGoal = asyncHandler(async (req, res) => {

    const { id } = req.params;

    // Find the goal by ID
    const goal = await Goal.findById(id);
    
    // Check if the goal exists
    if(!goal){
        return res.status(404).json({ message: 'Goal not found' });
    } 

    const user = await User.findById(req.user._id);

    if(!user){
        res.status(404).json({ message: 'User not found' });
    }

    if(goal.user.toString() !== user.id){
        res.status(401).json({ message: 'User not authorized' });
    }

    // Delete the goal
    await Goal.findByIdAndDelete(id);

    res.status(200).json({ message: 'Goal Deleted successfully', id: id });
})

module.exports = {
    getGoals,
    getGoalById,
    createGoal,
    updateGoal,
    deleteGoal
};