const express = require("express");
const router = express.Router();
const db = require("../../db_connect");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
router.get("/", (req, res) => {
  res.json("auth api is working");
});
let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.email_address,
    pass: process.env.email_password,
  },
});
router.post("/login", (req, res) => {
  if (!req.body) {
    res
      .status(404)
      .json({ status: false, response: "Please provide Email and Password" });
  } else {
    const { email, password } = req.body;
    if (email == undefined || email == "" || email == null) {
      res.status(403).json({
        status: false,
        response: "Please provide a email address",
      });
    } else if (password == undefined || password == "" || password == null) {
      res.status(403).json({
        status: false,
        response: "Please provide a password",
      });
    } else {
      try {
        db.query(
          "select * from users where Email_address=?",
          [email, password],
          async (err, result) => {
            if (err) throw err;
            if (result.length == 0) {
              res.status(403).json({
                status: false,
                response: "User Not Found",
              });
            } else {
              const userenteredhashedpassword = await bcrypt.compare(
                password,
                result[0].Password
              );
              if (userenteredhashedpassword) {
                let token = jsonwebtoken.sign(
                  {
                    _id: result[0].user_id,
                    isAdmin: result[0].isAdmin,
                    isStaff: result[0].isStaff,
                  },
                  process.env.token_secret_key
                );
                res.status(200).json({
                  status: true,
                  name: result[0].Full_Name,
                  email: result[0].Email_address,
                  isAdmin: result[0].isAdmin,
                  isStaff: result[0].isStaff,
                  isVerified: result[0].isVerified,
                  token: token,
                });
              } else {
                res.status(403).json({
                  status: false,
                  response: "Password Mismatch",
                });
              }
            }
          }
        );
      } catch (error) {
        if (error) throw error;
      }
    }
  }
});

router.post("/register", async (req, res) => {
  try {
    let fullname = req.body.fullname;
    let emailaddress = req.body.emailaddress;
    let dob = req.body.dob;
    let phonenumber = req.body.phonenumber;
    let address = req.body.address ?? null;
    let password = req.body.password;
    let isStaff = req.body.isStaff ?? "False";
    console.log(phonenumber);
    if (emailaddress == undefined || emailaddress == "") {
      res.status(403).json({
        status: false,
        response: "Email Address is Required",
      });
    } else if (fullname == "" || fullname == undefined) {
      res.status(403).json({
        status: false,
        response: "Full Name is Required",
      });
    } else if (password == "" || password == undefined) {
      res.status(403).json({
        status: false,
        response: "Password is Required",
      });
    } else if (phonenumber == undefined || phonenumber == "") {
      res.status(403).json({
        status: false,
        response: "Phone Number is Required",
      });
    } else {
      db.query(
        "select * from users where Email_address=?",
        [emailaddress],
        async (err, result) => {
          if (result.length > 0) {
            res.status(400).json({
              status: false,
              response: "Email Address Already Exists",
            });
          } else {
            var val = Math.floor(1000 + Math.random() * 9000);
            var mailOptions = {
              from: process.env.email_address,
              to: emailaddress,
              subject: "Verification From CarExpertz",
              html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                    <div style="margin:50px auto;width:70%;padding:20px 0">
                    <div style="border-bottom:1px solid #eee">
                    <h1  style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Car Expertz</h1>
                </div>
                <p style="font-size:1.1em">Hi,</p>
                <p>Thank you for choosing Car Expertz. Use the following OTP to complete your Sign Up procedures.</p>
                <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${val}</h2>
                <p style="font-size:0.9em;">Regards,<br />Car Expertz</p>
                <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                  <p>Car Expertz Inc</p>
                  <p>ss kovil road,tvm</p>
                  <p>Kerala,India</p>
                </div>
              </div>
            </div>`,
            };
            const hashedpassword = await bcrypt.hash(password, 10);
            db.query(
              `INSERT INTO users(Full_Name,Email_address,Password, isAdmin, isStaff, Phone_number, isVerified,Dob,Address) VALUES (?, ?, ?, ?, ?, ?, ?,?,?)`,
              [
                fullname,
                emailaddress,
                hashedpassword,
                "False",
                isStaff,
                phonenumber,
                "False",
                dob ?? "",
                address ?? "",
              ],
              (err, inserteddata) => {
                console.log(inserteddata.insertId);
                if (err) {
                  res.status(400).json({
                    status: false,
                    response: err.message,
                  });
                } else if (inserteddata.affectedRows > 0) {
                  transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                      console.log(error);
                    } else {
                      db.query(
                        "Insert into verification(user_id,otp) values (?,?)",
                        [inserteddata.insertId, val]
                      );
                    }
                    res.status(200).json({
                      status: true,
                      user_id: inserteddata.insertId,
                      otp: val,
                      response:
                        "User Registered Successfully.Please Check your Email",
                    });
                  });
                }
              }
            );
          }
        }
      );
    }
  } catch (error) {
    res.status(404).json({
      status: false,
      response: error.message,
    });
  }
});

router.post("/verifyotp", (req, res) => {
  let user_id = req.body.userid;
  let otp = req.body.otp;
  if (otp == undefined || otp == "") {
    res.status(404).json({
      status: true,
      response: "Otp is Required",
    });
  } else {
    db.query(
      "select * from verification where user_id=?",
      [user_id],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(404).json({
            status: false,
            response: "Something went wrong",
          });
        } else if (!result) {
          res.status(200).json({
            status: false,
            response: "No otp found",
          });
        } else {
          if (result[0].otp == otp) {
            console.log("otp matching");
            try {
              db.query(
                "update users set isVerified=? where user_id=?",
                ["True", user_id],
                (updateerr, updateres) => {
                  if (updateerr) throw updateerr;
                  if (updateres.affectedRows > 0) {
                    db.query(
                      "delete from verification where user_id=?",
                      [user_id],
                      (deleteerr, deleteres) => {
                        if (deleteres.affectedRows > 0) {
                          res.status(200).json({
                            status: true,
                            response: "Verified Successfully",
                          });
                        }
                      }
                    );
                  }
                }
              );
            } catch (error) {
              res.status(500).json({
                status: false,
                response: "Something went wrong",
              });
            }
          } else {
            res.status(400).json({
              status: false,
              response: "Otp Not Matching",
            });
          }
        }
      }
    );
  }
});

module.exports = router;
