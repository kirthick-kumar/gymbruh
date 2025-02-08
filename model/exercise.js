const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        enum: ["strength", "cardio", "muscle", "balanced"], 
        required: true 
    },
    primary_muscle: { 
        type: String, 
        required: true 
    },
    secondary_muscles: [{ 
        type: String 
    }],
    equipment: { type: String },
    difficulty: { 
        type: String, 
        enum: ["beginner", "intermediate", "advanced"], 
        required: true 
    }
});

module.exports = mongoose.model('Exercise', exerciseSchema);
