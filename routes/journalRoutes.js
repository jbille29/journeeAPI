const express = require('express');
const {
  createJournal,
  getJournals,
  getJournalById,
  updateJournal,
  deleteJournal,
} = require('../controllers/journalController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .post(protect, createJournal)
  .get(protect, getJournals);

router.route('/:id')
  .get(protect, getJournalById)
  .put(protect, updateJournal)
  .delete(protect, deleteJournal);

module.exports = router;
