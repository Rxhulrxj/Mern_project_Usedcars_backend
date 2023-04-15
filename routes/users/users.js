const express = require("express");
const router = express.Router();
const db = require("../../db_connect");
const {
  UserverifyToken,
  AdminverifyToken,
} = require("../../middlewares/middleware");
router.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    response: "User Route Working",
  });
});

router.post("/getprofile", UserverifyToken, (req, res) => {
  let user_id = req.user._id;
  let finaldata = {};
  try {
    db.query(
      "SELECT user_id,Full_Name,Email_address,Dob,Phone_number,Address,isVerified FROM `users` WHERE user_id=?",
      [user_id],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            status: false,
            response: "Something Went Wrong",
            reason: err,
          });
        } else if (result.length > 0) {
          db.query(
            "SELECT license_no,license_expiry,aadhar_no FROM userprofile where user_id=?",
            [user_id],
            (err1, result1) => {
              if (err1) {
                console.log(err1);
                res.status(500).json({
                  status: false,
                  response: "Something Went Wrong",
                  reason: err1,
                });
              } else if (result1.length > 0) {
                for (let key of Object.keys(result)) {
                  finaldata[key] = { ...result[key], ...result1[key] };
                }
              } else {
                finaldata = result;
              }
              res.status(200).json({
                status: true,
                response: finaldata[0],
              });
            }
          );
        } else {
          res.status(400).json({
            status: false,
            response: "No Data Found",
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      response: "Something Went Wrong",
      reason: error,
    });
  }
});

router.post("/getAllusers", AdminverifyToken, (req, res) => {
  try {
    db.query(
      "SELECT t1.*, IF(t2.user_id IS NOT NULL, t2.license_no, NULL) AS license_no,IF(t2.user_id IS NOT NULL, t2.license_expiry, NULL) AS license_expiry,IF(t2.user_id IS NOT NULL, t2.aadhar_no, NULL) AS aadhar_no FROM users t1 LEFT JOIN userprofile t2 ON t1.user_id = t2.user_id WHERE t1.isAdmin='False' and t1.isStaff='False';",
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            status: false,
            response: "Something Went Wrong",
            reason: err,
          });
        } else if (result.length > 0) {
          res.status(200).json({
            status: true,
            response: result,
          });
        } else {
          res.status(400).json({
            status: false,
            response: "No Data Found",
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      response: "Something Went Wrong",
      reason: error,
    });
  }
});
module.exports = router;
