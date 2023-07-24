const express = require('express');
const journalController = require('../controllers/journalController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Authenticate all requests
router.use(authenticateToken);

router.get('/teacher-feed', (req, res, next) => {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Forbidden. Only teachers can access teacher feed.' });
    }
    next();
  }, journalController.getTeacherFeed);
  
  // Student feed accessible only to students
  router.get('/student-feed', (req, res, next) => {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Forbidden. Only students can access student feed.' });
    }
    next();
  }, journalController.getStudentFeed);
  
  module.exports = router;