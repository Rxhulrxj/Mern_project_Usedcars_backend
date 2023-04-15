const express = require("express");
const { UserverifyToken } = require("../../middlewares/middleware");
const db = require("../../db_connect");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    response: "Enquiry Route is Working",
  });
});

router.post("/add-enquiry", UserverifyToken, (req, res) => {
  let vehicleid = req.body.vehicleid;
  let drivedate = req.body.testdrivedate;
  let timeslot = req.body.timeslot;
  try {
    db.query(
      "SELECT user_id,Full_Name FROM users WHERE isStaff='True';",
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            status: false,
            response: "Something Went Wrong",
            reason: err,
          });
        }
        if (result) {
          const employeeselected =
            result[Math.floor(Math.random() * result.length)];
          console.log("selected employee", employeeselected);
          try {
            db.query(
              "select * from enquiry where user_id=? and test_drive_date=? and Test_drive_timeslot=?",
              [req.user._id, drivedate, timeslot],
              (errchk, checkenq) => {
                if (checkenq.length > 0) {
                  res.status(400).json({
                    status: false,
                    response: "Enquiry Already Exists",
                  });
                } else {
                  try {
                    db.query(
                      "Insert into enquiry set ?",
                      [
                        {
                          user_id: req.user._id,
                          vehicle_id: vehicleid,
                          employee_id: employeeselected.user_id,
                          employee_name: employeeselected.Full_Name,
                          test_drive_date: drivedate,
                          slot_available: "Yes",
                          Test_drive_timeslot: timeslot,
                        },
                      ],
                      (err1, resultmain) => {
                        if (err1) {
                          console.log("insert ", err1);
                          res.status(500).json({
                            status: false,
                            response: "Something Went Wrong",
                            reason: err1,
                          });
                        }
                        console.log(resultmain);
                        if (resultmain.affectedRows > 0) {
                          res.status(200).json({
                            status: true,
                            response: "Enquiry Added Successfully",
                          });
                        }
                      }
                    );
                  } catch (error1) {
                    console.log(error1);
                    res.status(500).json({
                      status: false,
                      response: "Something Went Wrong",
                      reason: error1,
                    });
                  }
                }
              }
            );
          } catch (chkenqerror) {
            console.log(chkenqerror);
            res.status(500).json({
              status: false,
              response: "Something Went Wrong",
              reason: chkenqerror,
            });
          }
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
