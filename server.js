const bodyParser = require("body-parser");
const express = require("express");
const db = require("./db_connect");
const route = require("./routes/auth/auth");
const adminroute = require("./routes/vehicles/vehicle");
const emproute = require("./routes/employee/employee");
const userroute = require("./routes/users/users");
const enquiryroute = require("./routes/enquiry/enquiry");
const app = express();
const path = require("path");
const cors = require("cors");
require("dotenv").config();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
//load images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// parse application/json
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/auth", route);
app.use("/vehicle", adminroute);
app.use("/employee", emproute);
app.use("/users", userroute);
app.use("/enquiry", enquiryroute);
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(400).json({
    status: false,
    response: err.message,
  });
});

app.listen(process.env.PORT, (err) => {
  if (err) throw err;
  console.log("Connected to port " + process.env.PORT);
});
