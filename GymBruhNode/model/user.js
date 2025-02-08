const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    age: { type: Number },
    weight: { type: Number },
    height: { type: Number },
    goal: { 
        type: String, 
        enum: ["muscle_gain", "weight_loss", "maintenance"] 
    },
    trainer: { 
        type: Boolean, 
        default: false 
    },
    payment_status: { 
        type: Boolean, 
        default: false 
    },
    createdWorkouts: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Workout" 
    }],
    createdExercises: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Exercise" 
    }],
    sessions: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Session" 
    }]
});

module.exports = mongoose.model('User', userSchema);
