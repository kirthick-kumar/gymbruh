const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    workout_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Workout", 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    exercises: [{
        exercise_id: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Exercise", 
            required: true 
        },
        sets: [{
            weight: { 
                type: Number, 
                required: true 
            },
            reps: { 
                type: Number, 
                required: true 
            },
            rpe: { 
                type: Number, 
                min: 1, 
                max: 10 
            },
            set_rating: { 
                type: Number, 
                min: 1, 
                max: 5 
            }
        }]
    }]
});

module.exports = mongoose.model('Session', sessionSchema);
