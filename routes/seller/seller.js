const express = require("express");
const {
  StaffverifyToken,
  AdminverifyToken,
  UserverifyToken,
  seller_upload,
  transporter,
} = require("../../middlewares/middleware");
const db = require("../../db_connect");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    response: "seller api",
  });
});

router.post(
  "/seller-upload",
  seller_upload.fields([
    {
      name: "front_view",
      maxCount: 1,
    },
    {
      name: "rear_left_view",
      maxCount: 1,
    },
    {
      name: "rear_view",
      maxCount: 1,
    },
    {
      name: "pucc_image",
      maxCount: 1,
    },
    {
      name: "rc_book",
      maxCount: 1,
    },
    {
      name: "left_view",
      maxCount: 1,
    },
  ]),
  UserverifyToken,
  (req, res) => {
    let user_id = req.user._id;
    let full_Name = req.body.full_Name;
    let email = req.body.email;
    let phoneNumber = req.body.phoneNumber;
    let address = req.body.address;
    let Aadhar = req.body.Aadhar;
    let manufacture_name = req.body.Manufacturename;
    let model_name = req.body.ModelName;
    let model_year = req.body.Manufacturename;
    let Vehicle_color = req.body.vehicleColor;
    let Engine_number = req.body.engineNumber;
    let chasis_number = req.body.ChasisNumber;
    let fuel_type = req.body.fuelType;
    let transmission = req.body.transmission;
    let extra_fittings = req.body.Extrafitting;
    let tax_valid = req.body.taxvalid;
    let total_km_driven = req.body.kmdriven;
    let vehicle_registration_number = req.body.vehicle_registration_number;
    let vlocation = req.body.vlocation;
    let Comments = req.body.Comments;
    let frontview;
    let rearleftview;
    let rearview;
    let leftsideview;
    let rcbook;
    let pucc;
    let price = req.body.price;
    try {
      if (Engine_number == undefined || Engine_number == "") {
        res.status(400).json({
          status: false,
          response: "Please Provide Engine Number",
        });
      } else if (chasis_number == undefined || chasis_number == "") {
        res.status(400).json({
          status: false,
          response: "Please Provide Chasis Number",
        });
      } else if (manufacture_name == undefined || manufacture_name == "") {
        res.status(400).json({
          status: false,
          response: "Please Provide Manufacture Name",
        });
      } else if (model_name == undefined || model_name == "") {
        res.status(400).json({
          status: false,
          response: "Please Provide Model Name",
        });
      } else if (model_year == undefined || model_year == "") {
        res.status(400).json({
          status: false,
          response: "Please Provide Model Year",
        });
      } else if (Vehicle_color == undefined || Vehicle_color == "") {
        res.status(400).json({
          status: false,
          response: "Please Provide Vehicle Color",
        });
      } else if (fuel_type == undefined || fuel_type == "") {
        res.status(400).json({
          status: false,
          response: "Please Provide Fuel Type",
        });
      } else if (transmission == undefined || transmission == "") {
        res.status(400).json({
          status: false,
          response: "Please Provide Transmission Type",
        });
      } else if (extra_fittings == undefined || extra_fittings == "") {
        res.status(400).json({
          status: false,
          response: "Please Provide Extra fittings(Yes/no)",
        });
      } else if (tax_valid == undefined || tax_valid == "") {
        res.status(400).json({
          status: false,
          response: "Please Provide Tax Valid Upto Date",
        });
      } else if (total_km_driven == undefined || total_km_driven == "") {
        res.status(400).json({
          status: false,
          response: "Please Provide Total Km Driven",
        });
      } else if (
        vehicle_registration_number == undefined ||
        vehicle_registration_number == ""
      ) {
        res.status(400).json({
          status: false,
          response: "Please Provide Vehicle Registration Number",
        });
      } else if (
        req.files.front_view == undefined ||
        req.files.front_view == null
      ) {
        res.status(400).json({
          status: false,
          response: "Please Provide Front View Image",
        });
      } else if (
        req.files.rear_left_view == undefined ||
        req.files.rear_left_view == null
      ) {
        res.status(400).json({
          status: false,
          response: "Please Provide Rear Left Side View Image",
        });
      } else if (
        req.files.rear_view == undefined ||
        req.files.rear_view == null
      ) {
        res.status(400).json({
          status: false,
          response: "Please Provide Rear View Image",
        });
      } else if (
        req.files.left_view == undefined ||
        req.files.left_view == null
      ) {
        res.status(400).json({
          status: false,
          response: "Please Provide Left Side View Image",
        });
      } else if (req.files.rc_book == undefined || req.files.rc_book == null) {
        res.status(400).json({
          status: false,
          response: "Please Provide RcBook Image",
        });
      } else if (
        req.files.pucc_image == undefined ||
        req.files.pucc_image == null
      ) {
        res.status(400).json({
          status: false,
          response: "Please Provide PUCC Image",
        });
      } else {
        frontview = "uploads/vehicles/" + req.files.front_view[0].filename;
        rearleftview =
          "uploads/vehicles/" + req.files.rear_left_view[0].filename;
        rearview = "uploads/vehicles/" + req.files.rear_view[0].filename;
        leftsideview = "uploads/vehicles/" + req.files.left_view[0].filename;
        rcbook = "uploads/vehicles/" + req.files.rc_book[0].filename;
        pucc = "uploads/vehicles/" + req.files.pucc_image[0].filename;
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
                    "select * from sellers_vehicle where engineNumber=? or ChasisNumber=? or vehicle_registration_number=?",
                    [Engine_number, chasis_number, vehicle_registration_number],
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
                        console.log(result);
                        res.status(400).json({
                          status: false,
                          response: "Vehicle Already Exists",
                        });
                      } else {
                        console.log(req.user._id);
                        db.query(
                          "Insert into sellers_vehicle set ?",
                          [
                            {
                              employee_id: employeeselected.user_id,
                              employee_name: employeeselected.Full_Name,
                              user_id: user_id,
                              full_Name: full_Name,
                              email: email,
                              phoneNumber: phoneNumber,
                              address: address,
                              Aadhar: Aadhar,
                              Manufacturename: manufacture_name,
                              ModelName: model_name,
                              modelyear: model_year,
                              vehicleColor: Vehicle_color,
                              engineNumber: Engine_number,
                              ChasisNumber: chasis_number,
                              fuelType: fuel_type,
                              transmission: transmission,
                              taxvalid: tax_valid,
                              Extrafitting: extra_fittings,
                              kmdriven: total_km_driven,
                              vehicle_registration_number:
                                vehicle_registration_number,
                              front_view: frontview,
                              rear_left_view: rearleftview,
                              rear_view: rearview,
                              left_view: leftsideview,
                              rc_book: rcbook,
                              pucc_image: pucc,
                              price: price,
                              vlocation: vlocation,
                              Comments: Comments,
                            },
                          ],
                          (err, response) => {
                            if (err) {
                              console.log(err);
                              res.status(500).json({
                                status: false,
                                response: "Something Went Wrong",
                                reason: err,
                              });
                            }
                            console.log(response);
                            if (response.affectedRows > 0) {
                              res.status(200).json({
                                status: true,
                                response: "Vehicle Added Successfully",
                              });
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
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        response: "Something Went Wrong",
        reason: error,
      });
    }
  }
);

router.post("/usersellerlist", UserverifyToken, (req, res) => {
  let user_id = req.user._id;
  try {
    db.query(
      "SELECT * FROM sellers_vehicle WHERE user_id=?",
      [user_id],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          res.status(200).json({
            status: true,
            response: result,
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
router.post("/listsellleadstaff", StaffverifyToken, (req, res) => {
  let user_id = req.user._id;
  try {
    db.query(
      "SELECT * FROM sellers_vehicle WHERE employee_id=?",
      [user_id],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          res.status(200).json({
            status: true,
            response: result,
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

router.post("/recentsellleadstaff", StaffverifyToken, (req, res) => {
  let user_id = req.user._id;
  try {
    db.query(
      "SELECT * FROM sellers_vehicle WHERE employee_id=? LIMIT 5",
      [user_id],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          res.status(200).json({
            status: true,
            response: result,
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

router.post("/recentsellleadadmin", AdminverifyToken, (req, res) => {
  let user_id = req.user._id;
  try {
    db.query(
      "SELECT * FROM sellers_vehicle  LIMIT 5",
      [user_id],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          res.status(200).json({
            status: true,
            response: result,
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
router.post("/listsellleadadmin", AdminverifyToken, (req, res) => {
  let user_id = req.user._id;
  try {
    db.query(
      "SELECT * FROM sellers_vehicle",
      [user_id],
      (err, result) => {
        if (err) {
          console.log(err);
        }
        if (result) {
          res.status(200).json({
            status: true,
            response: result,
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

router.post("/updateselllead", StaffverifyToken, (req, res) => {
  let user_id = req.user._id;
  let selllead_id = req.body.id;
  let vehicle_ok = req.body.vehicle_ok;
  let inspected_vehicle = req.body.inspected_vehicle ?? "no";
  let inspected_vehicle_with_techinican =
    req.body.inspected_vehicle_with_techinican ?? "no";
  let comments_employee = req.body.comments_employee ?? "";
  let email = req.body.email;
  try {
    if (vehicle_ok.toLowerCase() == "no") {
      db.query(
        "Update sellers_vehicle set ? where id=?",
        [
          {
            vehicle_ok: "no",
            inspected_vehicle: "no",
            inspected_vehicle_with_techinican: "no",
            comments_employee: comments_employee,
            current_status: "Cancelled",
          },
          [selllead_id],
        ],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.affectedRows > 0) {
            var mailOptions = {
              from: process.env.email_address,
              to: email,
              subject: "E-Mail regarding the Seller Request",
              html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                    <div style="margin:50px auto;width:70%;padding:20px 0">
                    <div style="border-bottom:1px solid #eee">
                    <h1  style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Car Expertz</h1>
                </div>
                <p style="font-size:1.1em">Hi,</p>
                <p>We regret to inform you that your sell request for your car has been rejected. The reason for the rejection is that ${comments_employee}. We apologize for any inconvenience this may cause you.</p>
                <p>If you have any questions or concerns, please contact us at 555-1234 or email us at support@carexpertz.com. We appreciate your interest in selling your car with us and hope to serve you better in the future.</p>
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
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                res.status(200).json({
                  status: true,
                  response: "Status Updated Successfully",
                });
              }
            });
          }
        }
      );
    } else {
      db.query(
        "Update sellers_vehicle set? where id=?",
        [
          {
            vehicle_ok: vehicle_ok,
            inspected_vehicle: inspected_vehicle,
            inspected_vehicle_with_techinican:
              inspected_vehicle_with_techinican,
            comments_employee: comments_employee,
            current_status: "Purchased",
          },
          [selllead_id],
        ],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          if (result.affectedRows > 0) {
            db.query(
              "select * from sellers_vehicle where id=?",
              [selllead_id],
              (err1, result1) => {
                if (err1) {
                  console.log(err1);
                }
                if (result1.length > 0) {
                  try {
                    db.query('insert into vehicles set ?',[
                      {
                        manufacture_name:result1[0].Manufacturename,
                        model_name:result1[0].ModelName,
                        model_year:result1[0].modelyear,
                        vehicle_color:result1[0].vehicleColor,
                        Engine_number:result1[0].engineNumber,
                        chasis_number:result1[0].ChasisNumber,
                        fuel_type:result1[0].fuelType,
                        transmission:result1[0].transmission,
                        vehicle_registration_number:result1[0].vehicle_registration_number,
                        front_view_image:result1[0].front_view,
                        rear_left_view_image:result1[0].rear_left_view,
                        rear_view_image:result1[0].rear_view,
                        left_side_image:result1[0].left_view,
                        extra_fittings:result1[0].Extrafitting,
                        total_km_driven:result1[0].kmdriven,
                        published:"no",
                        sold:"no",
                        rc_book_image:result1[0].rc_book,
                        pucc_image:result1[0].pucc_image,
                        price:result1[0].price,
                        created_by:result1[0].employee_id
                      }
                    ],(err2,result2)=>{
                      if (err2) {
                        console.log(err2);
                      }
                      if (result2.affectedRows > 0) {
                        
                            res.status(200).json({
                              status: true,
                              response: "Status Updated Successfully",
                            });
                          }
                        });
                    
                    
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
            res.status(200).json({
              status: true,
              response: "Status Updated Successfully",
            });
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      response: "Something Went Wrong",
      reason: error,
    });
  }
});

// router.post("/g")
module.exports = router;
