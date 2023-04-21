const express = require("express");
const { UserverifyToken, StaffverifyToken, transporter, AdminverifyToken } = require("../../middlewares/middleware");
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
              "select * from enquiry where user_id=? and vehicle_id=? and test_drive_date=? and Test_drive_timeslot=?",
              [req.user._id,vehicleid, drivedate, timeslot],
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

router.post("/get-enq",UserverifyToken,(req,res)=>{
  let user_id = req.user._id;
  try {
    db.query("SELECT enquiry.*,vehicles.manufacture_name as manufacture_name,vehicles.model_name as model_name,vehicles.fuel_type as fuel_type,vehicles.transmission as transmission,vehicles.thumbnail as thumbnail FROM `enquiry` JOIN vehicles ON vehicles.id = enquiry.vehicle_id WHERE enquiry.user_id=?",[user_id],(err,result)=>{
      if(err){
        console.log(err);
      }
      if(result){
        res.status(200).json({
          status:true,
          response:result
        })
      }
    })
  } catch (error) {
    
  }
})
router.post("/recent-enq",StaffverifyToken,(req,res)=>{
  let user_id = req.user._id;
  console.log(user_id)
  try {
    db.query(`SELECT users.Full_Name as Full_Name,users.Email_address as Email_address,users.Phone_number as Phone_number,userprofile.license_no as license_no,users.Address as Address, vehicles.manufacture_name as manufacture_name,vehicles.model_name as model_name,vehicles.model_year as model_year,vehicles.Vehicle_color as Vehicle_color,vehicles.Engine_number as Engine_number,vehicles.chasis_number as chasis_number,vehicles.fuel_type as fuel_type,vehicles.transmission as transmission,enquiry.employee_name as employee_name,enquiry.test_drive_date as test_drive_date,enquiry.slot_available as slot_available,enquiry.Test_drive_timeslot as Test_drive_timeslot,enquiry.Available_date as Available_date,enquiry.Available_time as Available_time,enquiry.Comments as Comments,enquiry.Current_Status as Current_Status,enquiry.Enquiry_created
    FROM enquiry
    JOIN users ON users.user_id = enquiry.user_id
    JOIN vehicles ON vehicles.id = enquiry.vehicle_id
    JOIN userprofile ON users.user_id = userprofile.user_id
    WHERE enquiry.employee_id = ? LIMIT 5`,[user_id],(err,result)=>{
      if(err){
        console.log(err);
      }
      if(result){
        console.log(result)
        res.status(200).json({
          status:true,
          response:result
        })
      }
    })
  } catch (error) {
    
  }
})
router.post("/recent-enq-admin",AdminverifyToken,(req,res)=>{
  try {
    db.query(`SELECT users.Full_Name as Full_Name,users.Email_address as Email_address,users.Phone_number as Phone_number,userprofile.license_no as license_no,users.Address as Address, vehicles.manufacture_name as manufacture_name,vehicles.model_name as model_name,vehicles.model_year as model_year,vehicles.Vehicle_color as Vehicle_color,vehicles.Engine_number as Engine_number,vehicles.chasis_number as chasis_number,vehicles.fuel_type as fuel_type,vehicles.transmission as transmission,enquiry.employee_name as employee_name,enquiry.test_drive_date as test_drive_date,enquiry.slot_available as slot_available,enquiry.Test_drive_timeslot as Test_drive_timeslot,enquiry.Available_date as Available_date,enquiry.Available_time as Available_time,enquiry.Comments as Comments,enquiry.Current_Status as Current_Status,enquiry.Enquiry_created
    FROM enquiry
    JOIN users ON users.user_id = enquiry.user_id
    JOIN vehicles ON vehicles.id = enquiry.vehicle_id
    JOIN userprofile ON users.user_id = userprofile.user_id
     LIMIT 5`,(err,result)=>{
      if(err){
        console.log(err);
      }
      if(result){
        res.status(200).json({
          status:true,
          response:result
        })
      }
    })
  } catch (error) {
    console.log(error)
  }
})
router.post("/list-enq",StaffverifyToken,(req,res)=>{
  let user_id = req.user._id;
  console.log(user_id)
  try {
    db.query(`SELECT users.Full_Name as Full_Name,users.Email_address as Email_address,users.Phone_number as Phone_number,userprofile.license_no as license_no,users.Address as Address, vehicles.manufacture_name as manufacture_name,vehicles.model_name as model_name,vehicles.model_year as model_year,vehicles.Vehicle_color as Vehicle_color,vehicles.Engine_number as Engine_number,vehicles.chasis_number as chasis_number,vehicles.fuel_type as fuel_type,vehicles.transmission as transmission,enquiry.id,enquiry.employee_name as employee_name,enquiry.test_drive_date as test_drive_date,enquiry.slot_available as slot_available,enquiry.Test_drive_timeslot as Test_drive_timeslot,enquiry.Available_date as Available_date,enquiry.Available_time as Available_time,enquiry.Comments as Comments,enquiry.Current_Status as Current_Status,enquiry.Enquiry_created,vehicles.vehicle_registration_number
    FROM enquiry
    JOIN users ON users.user_id = enquiry.user_id
    JOIN vehicles ON vehicles.id = enquiry.vehicle_id
    JOIN userprofile ON users.user_id = userprofile.user_id
    WHERE enquiry.employee_id = ?`,[user_id],(err,result)=>{
      if(err){
        console.log(err);
      }
      if(result){
        console.log(result)
        res.status(200).json({
          status:true,
          response:result
        })
      }
    })
  } catch (error) {
    console.log(error);
  }
})

router.post("/list-enq-admin",AdminverifyToken,(req,res)=>{
  try {
    db.query(`SELECT users.Full_Name as Full_Name,users.Email_address as Email_address,users.Phone_number as Phone_number,userprofile.license_no as license_no,users.Address as Address, vehicles.manufacture_name as manufacture_name,vehicles.model_name as model_name,vehicles.model_year as model_year,vehicles.Vehicle_color as Vehicle_color,vehicles.Engine_number as Engine_number,vehicles.chasis_number as chasis_number,vehicles.fuel_type as fuel_type,vehicles.transmission as transmission,enquiry.id,enquiry.employee_name as employee_name,enquiry.test_drive_date as test_drive_date,enquiry.slot_available as slot_available,enquiry.Test_drive_timeslot as Test_drive_timeslot,enquiry.Available_date as Available_date,enquiry.Available_time as Available_time,enquiry.Comments as Comments,enquiry.Current_Status as Current_Status,enquiry.Enquiry_created,vehicles.vehicle_registration_number
    FROM enquiry
    JOIN users ON users.user_id = enquiry.user_id
    JOIN vehicles ON vehicles.id = enquiry.vehicle_id
    JOIN userprofile ON users.user_id = userprofile.user_id
    `,(err,result)=>{
      if(err){
        console.log(err);
      }
      if(result){
        res.status(200).json({
          status:true,
          response:result
        })
      }
    })
  } catch (error) {
    console.log(error);
  }
})

router.post("/update-schedule",StaffverifyToken,(req,res)=>{
  let user_id = req.user._id;
  let slot_available = req.body.slot_available;
  let Available_date = req.body.Available_date;
  let Available_time = req.body.Available_time;
  let enquiry_id = req.body.enquiry_id;
  let email = req.body.email;

  try {
    db.query('update enquiry set ? where id=?' ,[{
      slot_available:slot_available,
      Available_date:Available_date,
      Available_time:Available_time,
      
    },enquiry_id],(err,result)=>{
      if(err){
        console.log(err);
      }
      if(result.affectedRows>0){
        var mailOptions = {
          from: process.env.email_address,
          to: email,
          subject: "Re-Schedule For the test Drive Booking",
          html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                <h1  style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Car Expertz</h1>
            </div>
            <p style="font-size:1.1em">Hi,</p>
            <p>Your test drive schedule has been changed due to unforeseen circumstances. We apologize for any inconvenience this may cause. Your new schedule is on ${Available_date} from ${Available_time}. Thank you for choosing CarExpertz.</p>
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
              status:true,
              response:"Updated Successfully"
            })
          }})
       
      }
    })
  } catch (error) {
    
  }
  
})

router.post("/update-status",StaffverifyToken,(req,res)=>{
  let enquiry_id = req.body.enquiry_id  
  let current_status = req.body.current_status
  try {
    db.query("update enquiry set ? where id=?",[{
      Current_Status:current_status
    },enquiry_id],(err,result)=>{
      if(err){
        console.log(err);
      }
      if(result.affectedRows>0){
        res.status(200).json({
          status:true,
          response:"Updated Successfully"
        })
      }
    })
  } catch (error) {
    
  }
})
module.exports = router;
