const dotenv = require('dotenv');
const fs = require('fs');
const https = require('https');
const { DBConncetion } = require('./config/DatabaseConnection');

// Load environment variables
dotenv.config({ path: "./config/config.env" });

const port = process.env.PORT || 3030;
const app = require('./app'); // your actual Express app with all routes and middleware

// Connect to database
DBConncetion();

// SSL Cert paths
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/rbcstories.in/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/rbcstories.in/fullchain.pem')
};

// Start HTTPS server
const server = https.createServer(options, app).listen(port, () => {
  console.log(`${process.env.NODE_ENV} is running securely on https://rbcstories.in:${port}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Something went wrong: ${err.message}`);
  console.log("App is shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
