// Importing the express module
const express = require("express");
const app = express();

app.use((req, res, next) => {
  console.log("This is a middleware");
  next();
  // return next();
  console.log("This is first-half middleware");
});

app.use((req, res, next) => {
  console.log("This is second middleware");
  next();
});

app.use((req, res, next) => {
  console.log("This is third middleware");
  next();
});

// Execution the server
app.listen(5000, () => {
  console.log("Server is Running");
});
