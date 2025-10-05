const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
        firstName: { 
            type: String, 
            required: true, 
        },
        lastName: { 
            type: String, 
            required: true
        },
        phone: { 
            type: String, 
            required: true,
            minlength: 10,
            maxlength: 20
        },
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            required: true
        }
    },
);

module.exports = mongoose.model('Contact', contactSchema);