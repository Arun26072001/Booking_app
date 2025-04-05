const dotenv = require('dotenv');
const app  = require("./app");
const { DBConncetion } = require('./config/DatabaseConnection');
dotenv.config({path: "./config/config.env"});
const port  = process.env.PORT;

// db conncetion
DBConncetion();

const server = app.listen(port, ()=>{
    console.log(`${process.env.NODE_ENV} is running on ${port}`);
})

process.on("unhandledRejection", (err)=>{
    console.log(`something went wrong: ${err.message}`);
    console.log("app going to shut down!");
    server.close(()=>{
        process.exit(1);
    })
})