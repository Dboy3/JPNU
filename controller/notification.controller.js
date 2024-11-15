import { Notification } from '../models/notification.model.js';


export const addNotification = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required.' });
        }
        const newNotification = new Notification({ message });
        await newNotification.save();

        res.status(201).json({ message: 'Notification added successfully.', notification: newNotification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding the notification.' });
    }
};


export const getAllNotifications = async (req, res) => {
    try {
        // Retrieve all notifications from the database, sorted by date in descending order
        const notifications = await Notification.find().sort({ date: -1 });

        res.status(200).json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving notifications.' });
    }
};