const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const { authenticateToken } = require("../utilities.js");
const User = require('../models/user');
// const postmarkClient = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);
// const { body, validationResult } = require('express-validator');


// router.get('/', async(req, res) => {
//     try {
//         const { email } = req.body;
//         const todos = await Todo.find({email});
//         res.json(todos);
//     } catch(err){
//         res.status(500).json({ message: err.message });
//     }

// })

router.get('/', async (req, res) => {
     res.json({ data: "hello" });
})

// router.post('/new', async(req, res) => {
//     // const todo = new Todo({
//     //     title : req.body.title
//     // })
//     const {title, email} = req.body;
//     const todo = new Todo({
//         title,
//         email
//     });
 
//     try {
//         const newTodo = await todo.save();
//         res.status(201).json(newTodo);
//     } catch(err){
//         res.status(400).json({ message: err.message });
//     }
// })


router.get("/tasks", authenticateToken, async (req, res) => {
    const  user  = req.user;

    try {
        const tasks = await Todo.find({ userId: user._id });
        return res.json({
            error: false,
            tasks,
            message: "Tasks fetched successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
})


// Add Task API
router.post("/add-task", authenticateToken, async (req, res) => {
    const { text, isComplete, description } = req.body;
    const  user  = req.user;

    if (!text.trim()) {
        return res.status(400).json({ error: true, message: "Please add a task" });
    }

    try {
        const task = new Todo({
            text,
            isComplete: isComplete ?? false,
            userId: user._id,
            createdTime: new Date(),  // Set createdTime to now
            description
        });
        await task.save();
        return res.json({
            error: false,
            task,
            message: "Task added successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// Update Task API
router.post("/update-task/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { isComplete, description } = req.body;

    try {
        let update = { isComplete: isComplete, description: description };

        if (isComplete) {
            update.completedTime = new Date();  // Set completedTime to now
        } else {
            update.completedTime = null;  // Clear completedTime
        }

        const task = await Todo.findOneAndUpdate(
            { _id: id, userId: req.user._id},
            update,
            { new: true },
        );

        if (!task) {
            return res.status(404).json({
                error: true,
                message: "Task not found or unauthorized",
            });
        }

          return res.json({
            error: false,
            task,
            message: "Task updated successfully",
        });

        // if (isComplete) {
        //     const user = await User.findById(task.userId);
        //     const mailOptions = {
        //         From: process.env.EMAIL_USER,
        //         To: user.email,
        //         Subject: 'Task Completed',
        //         TextBody: `Your task "${task.text}" has been marked as completed.\n\nCreated: ${new Date(task.createdTime).toLocaleString()}\nCompleted: ${new Date(task.completedTime).toLocaleString()}`
        //     };

        //     postmarkClient.sendEmail(mailOptions, (error, result) => {
        //         if (error) {
        //             console.error('Error sending email:', error);
        //             return res.status(500).json({
        //                 error: true,
        //                 message: "Error sending email",
        //             });
        //         } else {
        //             console.log('Email sent:', result);
        //             return res.json({
        //                 error: false,
        //                 task,
        //                 message: "Task updated and email sent successfully",
        //             });
        //         }
        //     });
        // } else {
        //     return res.json({
        //         error: false,
        //         task,
        //         message: "Task updated successfully",
        //     });
        // }
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message || "Internal Server Error",
        });
    }
});



// router.delete('/delete/:id', async(req,res) => {
//     try {
//         const todo = await Todo.findByIdAndDelete(req.params.id);
//         if(!todo) return res.status(404).json({ message: "Todo not found" });
//         res.json({ message: "Todo deleted" });
//     } catch(err){
//         res.status(500).json({ message: err.message });
//     }
// })

// Delete Task API
router.delete("/delete-task/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Todo.findOneAndDelete({ _id: id, userId: req.user._id });

        if (!task) {
            return res.status(404).json({
                error: true,
                message: "Task not found or unauthorized",
            });
        }

        return res.json({
            error: false,
            message: "Task deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting task:", error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

module.exports = router;
