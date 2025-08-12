// backend/server.js
//
// Express + Socket.IO server with production-grade configuration.
// - Env-driven CORS for both REST and Socket.IO
// - Optional Redis adapter for horizontal scaling (auto-enabled via REDIS_URL)
// - HTTPS enforcement in production with trust proxy + HSTS
// - Centralized API routes under /api
// - Security headers + compression

require('dotenv').config();

const express    = require('express');
const http       = require('http');
const socketIo   = require('socket.io');
const cors       = require('cors');
const morgan     = require('morgan');
const helmet     = require('helmet');
const compression= require('compression');
const mongoose   = require('mongoose');
const { logger } = require('./utils/logger');

// Routes
const authRoutes               = require('./routes/auth');
const twoFaRoutes              = require('./routes/2fa');
const profileRoutes            = require('./routes/profile');
const profileImageReviewRoutes = require('./routes/profileImageReview');
const notifyRoutes             = require('./routes/notify');
const spoofReportRoutes        = require('./routes/spoofing');
const feedbackRoutes           = require('./routes/feedback');
const ridesRoutes              = require('./routes/rides');
const bookingRoutes            = require('./routes/bookings');
const driverRoutes             = require('./routes/drivers');
const driverBookingsRoutes     = require('./routes/driverBookings');
const vehicleRoutes            = require('./routes/vehicles');
const rewardRoutes             = require('./routes/rewards');
const promoRoutes              = require('./routes/promo');
const mapsRoutes               = require('./routes/maps');
const driverOnboardingRoutes   = require('./routes/driverOnboarding');
const driverProfileRoutes      = require('./routes/driverProfile');
const driverConfirmRoutes      = require('./routes/driverConfirm');
const matchGroupRoutes         = require('./routes/matchGroup');
const pricingRoutes            = require('./routes/pricing');
const rideTypeRoutes           = require('./routes/ridetypes');
const faqRoutes                = require('./routes/faqs');
const usersRoutes              = require('./routes/users');
const chatRoutes               = require('./routes/chat');

const locationRoutes           = require('./routes/location');
const fareRoutes               = require('./routes/fare');
const supportRoutes            = require('./routes/support');

// Socket auth + handlers
const { verifySocketToken } = require('./middleware/authMiddleware');
const initChatSocket        = require('./sockets/chatSocket');

const app    = express();
const server = http.createServer(app);

// ---- CORS whitelist (shared by REST and Socket.IO) ----
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

// For Socket.IO: if no whitelist provided, reflect request origin (true)
const socketCorsOrigin = allowedOrigins.length > 0 ? allowedOrigins : true;

// Optional Socket.IO path (supports SOCKET_PATH or legacy SOCKET_NAMESPACE_PREFIX)
const socketPath = process.env.SOCKET_PATH || process.env.SOCKET_NAMESPACE_PREFIX || '/socket.io';

// ---- Socket.IO server (env-driven CORS) ----
const io = new socketIo.Server(server, {
  cors: {
    origin: socketCorsOrigin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  path: socketPath,
});

// ---- Optional Redis adapter for horizontal scaling (auto-enable with REDIS_URL) ----
if (process.env.REDIS_URL) {
  (async () => {
    try {
      const { createAdapter } = require('@socket.io/redis-adapter');
      const { createClient }  = require('redis');

      const pubClient = createClient({ url: process.env.REDIS_URL });
      const subClient = pubClient.duplicate();

      await Promise.all([pubClient.connect(), subClient.connect()]);
      io.adapter(createAdapter(pubClient, subClient));
      logger.info('Socket.IO Redis adapter initialized');
    } catch (e) {
      logger.error('Socket.IO Redis adapter failed to initialize:', e);
    }
  })();
}

// ---- Core middleware ----
app.set('trust proxy', 1); // respect X-Forwarded-* (needed for req.secure, cookies, etc.)

// Security headers (enable HSTS below only in prod)
app.use(helmet());

// Gzip compression
app.use(compression());

// REST CORS (env-driven; mirrors Socket.IO CORS)
const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS not allowed from this origin'));
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// JSON parsing
app.use(express.json());

// Enforce HTTPS in production
if (process.env.NODE_ENV === 'production') {
  // Redirect http -> https when behind a proxy
  app.use((req, res, next) => {
    if (req.secure) return next();
    const proto = req.headers['x-forwarded-proto'];
    if (proto && proto !== 'https') {
      return res.redirect('https://' + req.headers.host + req.url);
    }
    return next();
  });

  // HSTS (180 days)
  app.use(
    helmet.hsts({
      maxAge: 15552000,
      includeSubDomains: true,
      preload: true,
    })
  );
}

// ---- REST API routes (/api/...) ----
app.use('/api/auth', authRoutes);
app.use('/api/2fa', twoFaRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/profile/image-review', profileImageReviewRoutes);
app.use('/api/notify', notifyRoutes);
app.use('/api/spoofing', spoofReportRoutes);
app.use('/api/feedback', feedbackRoutes);

// Keep both /trips and /rides for legacy clients
app.use('/api/trips', ridesRoutes);
app.use('/api/rides', ridesRoutes);

app.use('/api/pricing', pricingRoutes);
app.use('/api/driver/onboarding', driverOnboardingRoutes);
app.use('/api/driver/profile', driverProfileRoutes);
app.use('/api/bookings/driver-confirm', driverConfirmRoutes);
app.use('/api/match/group', matchGroupRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/driver-bookings', driverBookingsRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/promo', promoRoutes);
app.use('/api/maps', mapsRoutes);
app.use('/api/ridetypes', rideTypeRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/chats', chatRoutes);

// Additional feature routes
app.use('/api/fare', fareRoutes);
app.use('/api/support', supportRoutes);

// locationRoutes defines POST /location-check; mount under /api → /api/location-check
app.use('/api', locationRoutes);

// Static files (uploads)
app.use('/uploads', express.static('uploads'));

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

// ---- Socket.IO auth middleware ----
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    socket.user = await verifySocketToken(token);
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Initialize chat namespace/handlers
initChatSocket(io);

// ---- MongoDB & server start ----
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      logger.info(`HTTP + Socket.IO server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
