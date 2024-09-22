const Journal = require('../models/Journal');
const Entry = require('../models/Entry');     // Import the Entry model

// @desc    Create a new journal
// @route   POST /api/journals
// @access  Private
exports.createJournal = async (req, res) => {
  try {
    const newJournal = new Journal({
      ...req.body,
      user: req.user._id,  // Associate the journal with the logged-in user
    });
    const savedJournal = await newJournal.save();
    res.status(201).json(savedJournal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all journals for the logged-in user
// @route   GET /api/journals
// @access  Private
exports.getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user._id });
    res.json(journals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a specific journal by ID (only if it belongs to the logged-in user)
// @route   GET /api/journals/:id
// @access  Private
exports.getJournalById = async (req, res) => {
  try {
    const journal = await Journal.findOne({ _id: req.params.id, user: req.user._id });
    if (!journal) throw new Error('Journal not found or you do not have access');
    res.json(journal);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// @desc    Update a journal (only if it belongs to the logged-in user)
// @route   PUT /api/journals/:id
// @access  Private
exports.updateJournal = async (req, res) => {
  try {
    const updatedJournal = await Journal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!updatedJournal) throw new Error('Journal not found or you do not have access');
    res.json(updatedJournal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a journal (only if it belongs to the logged-in user)
// @route   DELETE /api/journals/:id
// @access  Private
exports.deleteJournal = async (req, res) => {
  try {
    // First, find and delete the journal
    const deletedJournal = await Journal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    // If the journal is not found or does not belong to the user, throw an error
    if (!deletedJournal) throw new Error('Journal not found or you do not have access');

    // After deleting the journal, delete all entries associated with it
    await Entry.deleteMany({ journal: deletedJournal._id });
  
    if (!deletedJournal) throw new Error('Journal not found or you do not have access');
    res.json({ message: 'Journal and its entries deleted successfully' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
