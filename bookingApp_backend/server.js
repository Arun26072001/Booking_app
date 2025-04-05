const fs = require('fs');
const https = require('https');
const dotenv = require('dotenv');
const { DBConncetion } = require('./config/DatabaseConnection');
const app = require('./app');

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Connect to database
DBConncetion();

// Port from env or fallback
const port = process.env.PORT || 3030;

// 🛡️ HTTPS in production, HTTP in development
let options = {};

if (process.env.NODE_ENV === 'production') {
  options = {
    key: fs.readFileSync('/etc/letsencrypt/live/rbcstories.in/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/rbcstories.in/fullchain.pem')
  };

  https.createServer(options, app).listen(port, () => {
    console.log(`✅ Production server running on HTTPS at port ${port}`);
  });
} else {
  app.listen(port, () => {
    console.log(`🚀 Dev server running on HTTP at port ${port}`);
  });
}

// 🔥 Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`❌ Unhandled Rejection: ${err.message}`);
  process.exit(1);
});
