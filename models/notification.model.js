import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now  // Automatically sets the date to the current date and time
    }
});

// Export the Notification model
export const Notification = mongoose.model('Notification', notificationSchema);