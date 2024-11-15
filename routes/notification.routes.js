import express from "express";

import { addNotification,getAllNotifications } from '../controller/notification.controller.js';
import { verifyRole,authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to create a new Notification(Admin only)
// POST /api/job-postings
router.post('/push', verifyRole(['Admin']), addNotification);

// Route to get all job postings
// GET /api/job-postings
router.get('/pull', getAllNotifications);


export default router;