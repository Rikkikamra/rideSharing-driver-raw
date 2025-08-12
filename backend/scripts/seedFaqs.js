// backend/scripts/seedFaqs.js
const mongoose = require('mongoose');
const Faq = require('../models/Faq');
mongoose.connect(process.env.MONGO_URI);

Faq.insertMany([
  { question: "How to update vehicle documents?", answer: "Go to Profile > Vehicles and upload new documents." },
  { question: "What to do if a rider cancels?", answer: "You’ll get notified. Check your trip summary for compensation policies." },
  { question: "How to request a payout?", answer: "Visit Earnings > Request Payout and follow the instructions." },
])
.then(() => {
  console.log('FAQs seeded!');
  process.exit();
});
