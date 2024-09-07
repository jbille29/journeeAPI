const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Journal = require('./models/Journal');
const Entry = require('./models/Entry');

// Connect to the database
mongoose.connect('mongodb+srv://jbille29:192917aW$@cluster0.xbxegqm.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Journal.deleteMany({});
    await Entry.deleteMany({});

    // Create users
    const user1 = new User({
      username: 'user1',
      email: 'user1@example.com',
      password: '123456',
    });

    const user2 = new User({
      username: 'user2',
      email: 'user2@example.com',
      password: '123456',
    });

    await user1.save();
    await user2.save();

    // Create journals
    const journal1 = new Journal({
      title: 'My First Journal',
      description: 'This is my first journal',
      user: user1._id,
    });

    const journal2 = new Journal({
      title: 'My Second Journal',
      description: 'This is my second journal',
      user: user1._id,
    });

    const journal3 = new Journal({
      title: 'User2 Journal',
      description: 'Journal for user2',
      user: user2._id,
    });

    await journal1.save();
    await journal2.save();
    await journal3.save();

    // Create entries
    const entry1 = new Entry({
      title: 'Entry 1',
      content: 'Content of entry 1',
      journal: journal1._id,
    });

    const entry2 = new Entry({
      title: 'Entry 2',
      content: 'Content of entry 2',
      journal: journal1._id,
    });

    const entry3 = new Entry({
      title: 'Entry 3',
      content: 'Content of entry 3',
      journal: journal2._id,
    });

    const entry4 = new Entry({
      title: 'Entry 4',
      content: 'Content of entry 4',
      journal: journal3._id,
    });

    await entry1.save();
    await entry2.save();
    await entry3.save();
    await entry4.save();

    console.log('Database seeded successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding the database:', error);
    mongoose.connection.close();
  }
};

// Run the seed function
seedData();
