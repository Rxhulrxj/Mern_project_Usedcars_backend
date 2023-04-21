const express = require("express");
const {
  StaffverifyToken,
  AdminverifyToken,
} = require("../../middlewares/middleware");
const db = require("../../db_connect");
const con = require("../../db_connect");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    response: "Dashboard api",
  });
});

router.post("/staff", StaffverifyToken, (req, res) => {
  let user_id = req.user._id;
  try {
    db.query(
      `SELECT
        COUNT(CASE WHEN Current_Status = 'Completed' THEN 1 END) AS completed_count,
        COUNT(CASE WHEN Current_Status = 'Completed(Purchased)' THEN 1 END) AS completed_processing_count,
        COUNT(CASE WHEN Current_Status = 'Processing' THEN 1 END) AS processing_count
      FROM
        enquiry
      WHERE
        employee_id = ?`,
      [user_id],
      (err, result) => {
        if (err) console.log(err);
        if (result) {
          try {
            db.query(
              `SELECT
                    COUNT(CASE WHEN Current_Status = 'Purchased' THEN 1 END) AS completed_count
                  FROM
                    sellers_vehicle
                  WHERE
                    employee_id = ?`,
              [user_id],
              (err1, result1) => {
                if (err1) console.log(err1);
                console.log(result1);
                res.status(200).json({
                  status: true,
                  response: [
                    {
                      success_booking:
                        result[0].completed_count +
                        result[0].completed_processing_count,
                      pending_bookings: result[0].processing_count,
                      total_sales: result1[0].completed_count,
                    },
                  ],
                });
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
router.post("/admin", AdminverifyToken, (req, res) => {
  try {
    db.query(
      `SELECT
        COUNT(CASE WHEN Current_Status = 'Completed' THEN 1 END) AS completed_count,
        COUNT(CASE WHEN Current_Status = 'Completed(Purchased)' THEN 1 END) AS completed_processing_count,
        COUNT(CASE WHEN Current_Status = 'Processing' THEN 1 END) AS processing_count
      FROM
        enquiry
      `,
      (err, result) => {
        if (err) console.log(err);
        if (result) {
          try {
            db.query(
              `SELECT
                        COUNT(CASE WHEN Current_Status = 'Purchased' THEN 1 END) AS completed_count
                      FROM
                        sellers_vehicle
                      `,

              (err1, result1) => {
                if (err1) console.log(err1);
                console.log(result1);
                res.status(200).json({
                  status: true,
                  response: [
                    {
                      success_booking:
                        result[0].completed_count +
                        result[0].completed_processing_count,
                      pending_bookings: result[0].processing_count,
                      total_sales: result1[0].completed_count,
                    },
                  ],
                });
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
