const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const TodoSchema = new mongoose.Schema({
    // title : {
    //     type: String,
    //     required:true,
    // },
    // completed: {
    //     type: Boolean,
    //     default: false,
    // },
    // createDate: {
    //     type: Date,
    //     default: Date.now,
    // },
    // email :{
    //     type: String,
    //     'required': true,
    // },
    //  description: { 
    //     type: String 
    // }

      id: { type: String, default: uuidv4 },  // UUID for unique task identification
    text: { type: String, required: true }, // Task Title
    isComplete: { type: Boolean, default: false }, // Task Complete or Incomplete
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdTime: { type: Date, default: Date.now },  // Timestamp for task creation
    completedTime: { type: Date },  // Timestamp for task completion
    description: { type: String }  // Optional description field
})

module.exports = mongoose.model("Todo", TodoSchema);