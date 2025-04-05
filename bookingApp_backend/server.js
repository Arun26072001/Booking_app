const dotenv = require('dotenv');
const app = require("./app");
const { DBConncetion } = require('./config/DatabaseConnection');
dotenv.config({ path: "./config/config.env" });
const port = process.env.PORT;
const fs = require('fs');
const https = require('https');

// db conncetion
DBConncetion();

// const server = app.listen(port, () => {
//     console.log(`${process.env.NODE_ENV} is running on ${port}`);
// })

const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/rbcstories.in/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/rbcstories.in/fullchain.pem')
};

https.createServer(options, app).listen(port, () => {
    console.log(`✅ Server running on HTTPS at https://rbcstories.in:${port}`);
  });

process.on("unhandledRejection", (err) => {
    console.log(`something went wrong: ${err.message}`);
    console.log("app going to shut down!");
    server.close(() => {
        process.exit(1);
    })
})