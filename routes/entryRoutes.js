const express = require('express');
const {
  createEntry,
  getEntriesByJournalId,
  getEntryById,
  updateEntry,
  deleteEntry,
} = require('../controllers/entryController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .post(protect, createEntry);

router.route('/journal/:journalId')
  .get(protect, getEntriesByJournalId);

router.route('/:id')
  .get(protect, getEntryById)
  .put(protect, updateEntry)
  .delete(protect, deleteEntry);

module.exports = router;
