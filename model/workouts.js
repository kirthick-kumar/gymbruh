const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    created_by: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    exercises: [{
        exercise_id: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Exercise", 
            required: true 
        },
        sets: { 
            type: Number, 
            required: true 
        },
        reps: { 
            type: Number, 
            required: true 
        }
    }]
});

module.exports = mongoose.model('Workout', workoutSchema);
