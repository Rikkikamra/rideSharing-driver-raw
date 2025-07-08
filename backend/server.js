const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/auth', authroutes);
app.use(cors());
app.use(helmet());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Routes
const rideRoutes = require('./routes/rides');
const bookingRoutes = require('./routes/bookings');
const driverRoutes = require('./routes/drivers');
const rewardRoutes = require('./routes/rewards');
const promoRoutes = require('./routes/promo');
const authRoutes = require('./routes/auth');
const notifyRoutes = require('./routes/notify');
const spoofReportRoutes = require('./routes/spoofing');
const feedbackRoutes = require('./routes/feedback');

const vehicleRoutes = require('./routes/vehicles');
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);

app.use('/api/notify', notifyRoutes);
app.use('/api/report', spoofReportRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/promo', promoRoutes);

// HTTPS/HTTP fallback
const useHttps = process.env.USE_HTTPS === 'true';
if (useHttps) {
  const sslOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH),
  };
  https.createServer(sslOptions, app).listen(process.env.PORT, () =>
    console.log(`HTTPS server running on port ${process.env.PORT}`)
  );
} else {
  http.createServer(app).listen(process.env.PORT, () =>
    console.log(`HTTP server running on port ${process.env.PORT}`)
  );
}
