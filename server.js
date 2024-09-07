require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const journalRoutes = require('./routes/journalRoutes');
const entryRoutes = require('./routes/entryRoutes');
const authRoutes = require('./routes/authRoutes');


// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://jbille29:192917aW$@cluster0.xbxegqm.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


// Routes
app.use('/api/auth', authRoutes)
app.use('/api/journals', journalRoutes);
app.use('/api/entries', entryRoutes);

app.get('/', (req, res) => {
  res.send('Journaling App API');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
