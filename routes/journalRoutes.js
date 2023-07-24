const express = require('express');
const journalController = require('../controllers/journalController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Authenticate all requests
router.use(authenticateToken);

router.post('/create-journal', journalController.upload.single('attachment'),journalController.createJournal);
router.put('/update-journal/:id', journalController.upload.single('attachment'), journalController.updateJournal);
router.delete('/delete-journal/:id', journalController.deleteJournal);
router.post('/publish/:id', journalController.publishJournal);

//student-list
router.get('/students-list', journalController.getStudentsList);


module.exports = router;
