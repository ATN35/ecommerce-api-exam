const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');

function security(app) {
  app.use(helmet());
  app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
  }));
  app.use(cookieParser());
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  });
}

module.exports = { security };
