const Entry = require('../models/Entry');
const Journal = require('../models/Journal');

// @desc    Create a new entry in a specific journal
// @route   POST /api/entries
// @access  Private
exports.createEntry = async (req, res) => {
  try {
    const journal = await Journal.findOne({ _id: req.body.journal, user: req.user._id });
    if (!journal) throw new Error('Journal not found or you do not have access');

    const newEntry = new Entry(req.body);
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all entries for a specific journal (only if the journal belongs to the logged-in user)
// @route   GET /api/entries/journal/:journalId
// @access  Private
exports.getEntriesByJournalId = async (req, res) => {
  try {
    const journal = await Journal.findOne({ _id: req.params.journalId, user: req.user._id });
    if (!journal) throw new Error('Journal not found or you do not have access');

    const entries = await Entry.find({ journal: req.params.journalId });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a specific entry by ID (only if it belongs to a journal owned by the logged-in user)
// @route   GET /api/entries/:id
// @access  Private
exports.getEntryById = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id).populate('journal');
    if (!entry || entry.journal.user.toString() !== req.user._id.toString()) {
      throw new Error('Entry not found or you do not have access');
    }
    res.json(entry);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Update an entry (only if it belongs to a journal owned by the logged-in user)
// @route   PUT /api/entries/:id
// @access  Private
exports.updateEntry = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id).populate('journal');
    if (!entry || entry.journal.user.toString() !== req.user._id.toString()) {
      throw new Error('Entry not found or you do not have access');
    }

    const updatedEntry = await Entry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an entry (only if it belongs to a journal owned by the logged-in user)
// @route   DELETE /api/entries/:id
// @access  Private
exports.deleteEntry = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id).populate('journal');
    if (!entry || entry.journal.user.toString() !== req.user._id.toString()) {
      throw new Error('Entry not found or you do not have access');
    }

    await entry.remove();
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
