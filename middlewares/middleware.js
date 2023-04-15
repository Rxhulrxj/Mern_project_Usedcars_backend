const jwt = require("jsonwebtoken");
require("dotenv").config();
var multer = require("multer");
var path = require("path");
// middleware function to verify the JWT whether the user is Admin or not
const AdminverifyToken = (req, res, next) => {
  let token = req.body.token;

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    // verify the token
    const decoded = jwt.verify(token, process.env.token_secret_key);
    if (decoded.isAdmin == "True") {
      req.user = decoded;
      next();
    } else {
      res.status(400).json({ message: "Please login as Admin" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid token" });
  }
};

const UserverifyToken = (req, res, next) => {
  let token = req.body.token;

  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    // verify the token
    const decoded = jwt.verify(token, process.env.token_secret_key);
    if (decoded.isAdmin == "False" && decoded.isStaff == "False") {
      req.user = decoded;
      next();
    } else {
      res.status(400).json({ message: "Please login as User" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid token" });
  }
};

var storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/vehicles");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.fieldname}_${Date.now()}.${ext}`);
  },
});

var product_upload = multer({
  storage: storage2,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
});
module.exports = { AdminverifyToken, product_upload, UserverifyToken };
