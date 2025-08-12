# Rideshare App

This project comprises a React Native front‑end and an Express back‑end that together power a ridesharing application.  The front‑end uses Expo and communicates with the back‑end over REST and WebSocket (Socket.IO) APIs.

## Getting Started

### Environment Configuration

Copy the provided `.env.example` files to `.env` in the respective directories and fill in the appropriate values for your environment.

**Front‑end (`frontend/.env`) variables:**

| Key                     | Description | Example |
|------------------------|-------------|---------|
| `API_BASE_URL`         | Base URL for API requests including `/api` prefix | `http://localhost:3001/api` |
| `SOCKET_BASE_URL`      | Base URL for Socket.IO (omit `/api`) | `http://localhost:3001` |
| `WEATHER_API_KEY`      | OpenWeatherMap API key used by the weather widget | `0123456789abcdef0123456789abcdef` |
| `SUPPORT_URL`          | URL of your customer support chat widget | `https://my-support-widget.example.com` |
| `GOOGLE_EXPO_CLIENT_ID`, `GOOGLE_IOS_CLIENT_ID`, `GOOGLE_ANDROID_CLIENT_ID`, `GOOGLE_WEB_CLIENT_ID` | OAuth client IDs for Google sign‑in | *varies* |
| `APPLE_CLIENT_ID`      | Client ID for Apple sign‑in (optional) | *varies* |

**Back‑end (`backend/.env`) variables:**

| Key                       | Description | Example |
|--------------------------|-------------|---------|
| `MONGODB_URI`            | Connection string for MongoDB | `mongodb://localhost:27017/rideshare` |
| `JWT_SECRET`             | Secret used to sign JWT access and refresh tokens | `supersecret` |
| `CORS_ORIGIN`            | Comma‑separated list of allowed origins | `http://localhost:19006` |
| `PORT`                   | Port on which the server listens | `3001` |
| `NODE_ENV`               | `development` or `production` | `development` |
| `PROFILE_IMAGE_UPLOAD_PATH` | Directory to store uploaded profile images | `uploads/profile-images/` |

### Running the App

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up your environment variables by copying `.env.example` to `.env` in both `frontend` and `backend` directories and editing the values.

3. Start the back‑end server:

   ```bash
   cd backend
   npm install
   npm start
   ```

4. Start the front‑end (Expo):

   ```bash
   cd frontend
   npm install
   expo start
   ```

## API Endpoints

Below is a high‑level list of the key REST endpoints exposed by the back‑end.  All routes are prefaced with `/api` because the server mounts its router on that base path.

| Method | Path | Description |
|-------|------|-------------|
| `POST` | `/auth/signup`, `/auth/login`, `/auth/google-signin`, `/auth/apple-signin` | Register or sign in users |
| `POST` | `/auth/refresh-token` | Refresh access tokens |
| `POST` | `/auth/logout` | Invalidate client sessions |
| `GET`  | `/users/me` | Retrieve current user profile |
| `PUT`  | `/drivers/profile` | Update authenticated driver profile |
| `POST` | `/drivers/upload-profile-image` | Upload a driver profile image |
| `GET`  | `/drivers/score` | Fetch driver rating metrics |
| `GET`  | `/drivers/earnings` | Get driver earnings summary |
| `POST` | `/2fa/request-2fa` | Request a two‑factor authentication code |
| `POST` | `/2fa/verify-2fa` | Verify a two‑factor code |
| `POST` | `/promo/validate` | Apply a promo code |
| `GET`  | `/ridetypes` | Fetch available ride types |
| `GET`  | `/rides` | Fetch open rides for drivers |
| `POST` | `/rides` | Create a new ride |
| `GET`  | `/bookings/rider/:id` | Get bookings for a rider |
| `GET`  | `/feedback/:tripId` | Fetch feedback for a trip |
| `POST` | `/feedback/:tripId` | Submit feedback for a trip |
| `GET`  | `/rewards/:userId` | Retrieve rewards summary |
| `POST` | `/profile/image-review` | Submit profile image for admin review |

For a complete list of endpoints and their request/response formats, refer to the controller files under `backend/controllers`.

## Logging

The back‑end uses [winston](https://github.com/winstonjs/winston) (see `backend/utils/logger.js`) for structured logging.  Replace any lingering `console.log` statements with calls to the logger to ensure that logs are formatted consistently and can be redirected to files or external services in production.

## Security Considerations

- Restrict the `CORS_ORIGIN` to trusted front‑end domains in production.
- Use HTTPS in production.  Terminate TLS at a reverse proxy (e.g. Nginx) and proxy WebSocket connections accordingly.
- Ensure JWTs are transmitted and stored securely (e.g. HttpOnly cookies or SecureStore on mobile).
- Validate file uploads and limit file sizes to prevent abuse.
- Rate‑limit login routes to mitigate brute force attacks.

## Contributing

Please open issues or pull requests for bug fixes, new features or clarifications.  Contributions are welcome!