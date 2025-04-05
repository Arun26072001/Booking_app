const fs = require('fs');
const https = require('https');
const dotenv = require('dotenv');
const { DBConncetion } = require('./config/DatabaseConnection');
const app = require('./app');

// Load environment variables
dotenv.config({ path: "./config/config.env" });

const port = process.env.PORT || 3030;

// Connect to DB
DBConncetion();

// ✅ Use Linux-style paths (for Ubuntu or any live Linux server)
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/rbcstories.in/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/rbcstories.in/fullchain.pem')
};

// Create HTTPS server
const server = https.createServer(options, app).listen(port, () => {
  console.log(`${process.env.NODE_ENV} is running securely on https://rbcstories.in:${port}`);
});

// Handle promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
