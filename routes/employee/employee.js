const express = require("express");
const { AdminverifyToken } = require("../../middlewares/middleware");
const db = require("../../db_connect");
const bcrypt = require("bcrypt");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    response: "Employee route working",
  });
});

router.post("/add-employee", AdminverifyToken, (req, res) => {
  if (req.body) {
    let fullname = req.body.Full_Name;
    let email = req.body.Email_address;
    let dob = req.body.Dob;
    let phone_number = req.body.Phone_number;
    let address = req.body.Address;
    let role = req.body.role;
    let branch = req.body.branch;
    let department = req.body.department;
    let empcode = req.body.empcode;
    try {
      db.query(
        "select * from employees where employee_code=?",
        [empcode],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({
              status: false,
              response: "Something Went Wrong",
              reason: err,
            });
          }
          if (result.length > 0) {
            res.status(400).json({
              status: false,
              response: "Employee Already exists",
            });
          } else {
            db.query(
              "select * from users where Email_address=?",
              [email],
              async (errmain, resultmain) => {
                if (resultmain.length > 0) {
                  res.status(400).json({
                    status: false,
                    response: "Email Already exists",
                  });
                } else {
                  try {
                    const password = await bcrypt.hash(
                      `${fullname}@carexpertz`,
                      10
                    );
                    db.query(
                      "Insert into users set?",
                      [
                        {
                          Full_Name: fullname,
                          Email_address: email,
                          Password: password,
                          Dob: dob,
                          isAdmin: "False",
                          isStaff: "True",
                          Phone_number: phone_number,
                          Address: address,
                          isVerified: "True",
                        },
                      ],
                      (err1, result1) => {
                        db.query(
                          "insert into employees set?",
                          [
                            {
                              role: role,
                              branch: branch,
                              department: department,
                              employee_code: empcode,
                              user_id: result1.insertId,
                            },
                          ],
                          (err2, result2) => {
                            if (err2) {
                              console.log(err2);
                              res.status(500).json({
                                status: false,
                                response: "Something Went Wrong",
                                reason: err2,
                              });
                            }
                            if (result2.affectedRows > 0) {
                              res.status(200).json({
                                status: true,
                                response: "Employee Added Successfully",
                              });
                            }
                          }
                        );
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
  }
});
router.post("/get-employees", AdminverifyToken, (req, res) => {
  try {
    db.query(
      "SELECT users.*,employees.role as role,employees.branch as branch,employees.department as department,employees.employee_code as empcode FROM users INNER JOIN employees ON users.user_id = employees.user_id;",
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            status: false,
            response: "Something Went Wrong",
            reason: err,
          });
        } else if (result) {
          res.status(200).json({
            status: true,
            response: result,
          });
        } else {
          res.status(400).json({
            status: true,
            response: "No Employees Found",
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

router.post("/update-employee/:id",AdminverifyToken, (req, res) => {
  let id = req.params.id;
  let Full_Name,
    Email_address,
    Dob,
    Phone_number,
    Address,
    role,
    branch,
    department,
    empcode;
  try {
    Full_Name = req.body.Full_Name;
    Email_address = req.body.Email_address;
    Dob = req.body.Dob;
    Phone_number = req.body.Phone_number;
    Address = req.body.Address;
    role = req.body.role;
    branch = req.body.branch;
    department = req.body.department;
    empcode = req.body.empcode;
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // add leading zero to month if needed
    const day = now.getDate().toString().padStart(2, "0"); // add leading zero to day if needed
    const hours = now.getHours().toString().padStart(2, "0"); // add leading zero to hours if needed
    const minutes = now.getMinutes().toString().padStart(2, "0"); // add leading zero to minutes if needed
    const seconds = now.getSeconds().toString().padStart(2, "0"); // add leading zero to seconds if needed
    const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    db.query(
      "update users set? where user_id=?",
      [
        {
          Full_Name: Full_Name,
          Email_address: Email_address,
          Dob: Dob,
          Phone_number: Phone_number,
          Address: Address,
          last_modified_date: timestamp,
        },
        id,
      ],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            status: false,
            response: "Something Went Wrong",
            reason: err,
          });
        }
        if (result.affectedRows > 0) {
          db.query(
            "update employees set? where user_id=?",
            [
              {
                role: role,
                branch: branch,
                department: department,
                employee_code: empcode,
              },
              id,
            ],
            (err1, result1) => {
              if (err1) {
                console.log(err1);
                res.status(500).json({
                  status: false,
                  response: "Something Went Wrong",
                  reason: err1,
                });
              } else if (result1.affectedRows > 0) {
                res.status(200).json({
                  status: true,
                  response: "Updated Successfully",
                });
              }
            }
          );
        } else {
          res.status(400).json({
            status: false,
            response: "Employee Not Found",
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
