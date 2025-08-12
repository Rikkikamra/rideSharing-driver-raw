const mongoose = require('mongoose');
const dotenv = require('dotenv');
const RideType = require('../models/RideType');

dotenv.config();

const rideTypes = [
  { id: 'standard', name: 'Standard', description: 'Affordable daily rides', icon: '🚗' },
  { id: 'premium', name: 'Premium', description: 'Luxury experience', icon: '🚘' },
  { id: 'pool', name: 'Pool', description: 'Shared rides', icon: '🚕' },
  { id: 'student', name: 'Student Saver', description: 'Discounted rides for students', icon: '🎓' }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await RideType.deleteMany();
    await RideType.insertMany(rideTypes);
    console.log('✅ Ride types seeded');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
