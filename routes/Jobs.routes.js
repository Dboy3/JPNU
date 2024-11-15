import express from "express";
import { createJobPosting, getJobPostings, deleteJobPosting, updateJobPosting,addPlacedStudent,
    getPlacedStudents,
    deletePlacedStudent,
    updatePlacedStudent,
    getAllJobPostings, 
    getUpcomingJobPostings, 
    getPastJobPostings,getApplications,addApplication} from '../controller/Jobs.controller.js';
    import {
        addExpenditure,
        updateExpenditure,
        getAllExpenditures,
        getFilteredExpenditures
    } from '../controller/expenditureBook.controller.js';
import { verifyAdminRole } from '../controller/Jobs.controller.js';
import { verifyRole,authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to create a new job posting (Admin only)
// POST /api/job-postings
router.post('/post', verifyAdminRole, createJobPosting);

// Route to get all job postings
// GET /api/job-postings
router.get('/get', getJobPostings);

// Route to delete a job posting (Admin only)
// DELETE /api/job-postings/:postId
router.delete('/:postId', verifyAdminRole, deleteJobPosting);

// Route to update a job posting (Admin only)
// PUT /api/job-postings/:postId
router.put('/:postId', verifyAdminRole, updateJobPosting);
// Route to fetch all job postings
router.get('/all', getAllJobPostings);

// Route to fetch upcoming job postings (where endDate is in the future)
router.get('/upcoming', getUpcomingJobPostings);

// Route to fetch past job postings (where endDate has passed)
router.get('/past', getPastJobPostings);

router.post('/placed-students/add', addPlacedStudent);
router.get('/placed-students', getPlacedStudents);
router.delete('/placed-students/:id', deletePlacedStudent);
router.put('/placed-students/:id', updatePlacedStudent);
// Routes for SPC and Admin
router.post('/expenditure/add', verifyRole(['SPC', 'Admin']), addExpenditure);
router.put('/expenditure/:id', verifyRole(['SPC', 'Admin']), updateExpenditure);

// Routes for Admin only
router.get('/expenditure', verifyRole(['admin']), getAllExpenditures);
router.get('/expenditure/filter', verifyRole(['admin']), getFilteredExpenditures);
router.post('/addApplication', authenticateUser, addApplication);
router.get('/getApplications', authenticateUser, getApplications);
export default router;