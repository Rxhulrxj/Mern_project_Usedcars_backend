const express = require("express");
const db = require("../../db_connect");
const {
  AdminverifyToken,
  product_upload,
} = require("../../middlewares/middleware");
const router = express.Router();

router.post(
  "/add-vehicle",
  product_upload.fields([
    {
      name: "frontview",
      maxCount: 1,
    },
    {
      name: "rearleftview",
      maxCount: 1,
    },
    {
      name: "rearview",
      maxCount: 1,
    },
    {
      name: "leftsideview",
      maxCount: 1,
    },
    {
      name: "rcbook",
      maxCount: 1,
    },
    {
      name: "pucc",
      maxCount: 1,
    },
  ]),
  AdminverifyToken,
  (req, res) => {
    let manufacture_name = req.body.manufacture_name;
    let model_name = req.body.model_name;
    let model_year = req.body.model_year;
    let Vehicle_color = req.body.Vehicle_color;
    let Engine_number = req.body.Engine_number;
    let chasis_number = req.body.chasis_number;
    let fuel_type = req.body.fuel_type;
    let transmission = req.body.transmission;
    let extra_fittings = req.body.extra_fittings;
    let tax_valid = req.body.tax_valid;
    let total_km_driven = req.body.total_km_driven;
    let vehicle_registration_number = req.body.vehicle_registration_number;
    let published = req.body.published ?? "yes";
    let sold = "no";
    let description = req.body.description;
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
      } else if (description == undefined || description == "") {
        res.status(400).json({
          status: false,
          response: "Please Provide Vehicle Description",
        });
      } else if (
        req.files.frontview == undefined ||
        req.files.frontview == null
      ) {
        res.status(400).json({
          status: false,
          response: "Please Provide Front View Image",
        });
      } else if (
        req.files.rearleftview == undefined ||
        req.files.rearleftview == null
      ) {
        res.status(400).json({
          status: false,
          response: "Please Provide Rear Left Side View Image",
        });
      } else if (
        req.files.rearview == undefined ||
        req.files.rearview == null
      ) {
        res.status(400).json({
          status: false,
          response: "Please Provide Rear View Image",
        });
      } else if (
        req.files.leftsideview == undefined ||
        req.files.leftsideview == null
      ) {
        res.status(400).json({
          status: false,
          response: "Please Provide Left Side View Image",
        });
      } else if (req.files.rcbook == undefined || req.files.rcbook == null) {
        res.status(400).json({
          status: false,
          response: "Please Provide RcBook Image",
        });
      } else if (req.files.pucc == undefined || req.files.pucc == null) {
        res.status(400).json({
          status: false,
          response: "Please Provide PUCC Image",
        });
      } else {
        frontview = "uploads/vehicles/" + req.files.frontview[0].filename;
        rearleftview = "uploads/vehicles/" + req.files.rearleftview[0].filename;
        rearview = "uploads/vehicles/" + req.files.rearview[0].filename;
        leftsideview = "uploads/vehicles/" + req.files.leftsideview[0].filename;
        rcbook = "uploads/vehicles/" + req.files.rcbook[0].filename;
        pucc = "uploads/vehicles/" + req.files.pucc[0].filename;
        db.query(
          "select * from vehicles where Engine_number=? or chasis_number=? or vehicle_registration_number=?",
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
                "Insert into vehicles set ?",
                [
                  {
                    manufacture_name: manufacture_name,
                    model_name: model_name,
                    model_year: model_year,
                    Vehicle_color: Vehicle_color,
                    Engine_number: Engine_number,
                    chasis_number: chasis_number,
                    fuel_type: fuel_type,
                    transmission: transmission,
                    tax_valid: tax_valid,
                    extra_fittings: extra_fittings,
                    total_km_driven: total_km_driven,
                    vehicle_registration_number: vehicle_registration_number,
                    published: published,
                    sold: sold,
                    description: description,
                    front_view_image: frontview,
                    rear_left_view_image: rearleftview,
                    rear_view_image: rearview,
                    left_side_image: leftsideview,
                    rc_book_image: rcbook,
                    pucc_image: pucc,
                    created_by: req.user._id,
                    price: price,
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

router.get("/getVehicle", (req, res) => {
  try {
    db.query("select * from vehicles", (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          status: false,
          response: "Something Went Wrong",
          reason: err,
        });
      } else {
        res.status(200).json({
          status: true,
          response: result,
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
});
router.get("/getVehicle/:id", (req, res) => {
  try {
    let id = req.params.id;
    console.log(id);
    db.query("select * from vehicles where id=?", [id], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          status: false,
          response: "Something Went Wrong",
          reason: err,
        });
      } else {
        res.status(200).json({
          status: true,
          response: result,
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
});

router.post(
  "/updatevehicle/:id",
  product_upload.fields([
    {
      name: "front_view_image",
      maxCount: 1,
    },
    {
      name: "rear_left_view_image",
      maxCount: 1,
    },
    {
      name: "rear_view_image",
      maxCount: 1,
    },
    {
      name: "left_side_image",
      maxCount: 1,
    },
    {
      name: "rc_book_image",
      maxCount: 1,
    },
    {
      name: "pucc_image",
      maxCount: 1,
    },
  ]),
  AdminverifyToken,
  (req, res) => {
    let front_view_image;
    let rear_left_view_image;
    let rear_view_image;
    let left_side_image;
    let rc_book_image;
    let pucc_image;
    var vehid = req.params.id;
    var result = [];
    result = req.body;
    delete result.token;

    if (
      req.files.front_view_image != undefined ||
      req.files.front_view_image != null
    ) {
      front_view_image =
        "uploads/vehicles/" + req.files.front_view_image[0].filename;
      result.front_view_image = front_view_image;
    }
    if (
      req.files.rear_left_view_image != undefined ||
      req.files.rear_left_view_image != null
    ) {
      rear_left_view_image =
        "uploads/vehicles/" + req.files.rear_left_view_image[0].filename;
      result.rear_left_view_image = rear_left_view_image;
    }
    if (
      req.files.rear_view_image != undefined ||
      req.files.rear_view_image != null
    ) {
      rear_view_image =
        "uploads/vehicles/" + req.files.rear_view_image[0].filename;
      result.rear_view_image = rear_view_image;
    }
    if (
      req.files.left_side_image != undefined ||
      req.files.left_side_image != null
    ) {
      left_side_image =
        "uploads/vehicles/" + req.files.left_side_image[0].filename;
      result.left_side_image = left_side_image;
    }
    if (
      req.files.rc_book_image != undefined ||
      req.files.rc_book_image != null
    ) {
      rc_book_image = "uploads/vehicles/" + req.files.rc_book_image[0].filename;
      result.rc_book_image = rc_book_image;
    }
    if (req.files.pucc_image != undefined || req.files.pucc_image != null) {
      pucc_image = "uploads/vehicles/" + req.files.pucc_image[0].filename;
      result.pucc_image = pucc_image;
    }
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // add leading zero to month if needed
    const day = now.getDate().toString().padStart(2, "0"); // add leading zero to day if needed
    const hours = now.getHours().toString().padStart(2, "0"); // add leading zero to hours if needed
    const minutes = now.getMinutes().toString().padStart(2, "0"); // add leading zero to minutes if needed
    const seconds = now.getSeconds().toString().padStart(2, "0"); // add leading zero to seconds if needed
    const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    result.modified_date = timestamp;
    console.log(result);
    try {
      db.query(
        "update vehicles set ? where id = ?",
        [result, vehid],
        (err, resp) => {
          if (err) {
            console.log(err);
          }
          if (resp.affectedRows > 0) {
            res.status(200).json({
              status: true,
              response: "Updated Successfully",
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
  }
);

router.post("/search-vehicle", (req, res) => {
  let searchkeyword = req.body.searchkeyword;
  try {
    db.query(
      `select * from vehicles where manufacture_name like '%${searchkeyword}%' or model_name like '%${searchkeyword}%'`,
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(404).json({
            status: false,
            response: "Something Went Wrong",
            reason: err,
          });
        }
        if (result.length > 0) {
          res.status(200).json({
            status: true,
            response: result,
          });
        } else {
          res.status(200).json({
            status: false,
            response: "No Result Found",
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

router.post("/advance-search", (req, res) => {
  let brand = req.body.brand;
  let model = req.body.model;
  let year = req.body.year;
  let price = req.body.price;
  try {
    db.query(
      `select * from vehicles where manufacture_name=? and model_name=? and model_year=? and price${price} order by price`,
      [brand, model, year],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(404).json({
            status: false,
            response: "Something Went Wrong",
            reason: err,
          });
        }
        if (result.length == 0) {
          res.status(200).json({
            status: false,
            response: "No Result Found",
          });
        } else {
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

router.get("/get-model", (req, res) => {
  try {
    db.query(
      "select manufacture_name,model_name from vehicles",
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(404).json({
            status: false,
            response: "Something Went Wrong",
            reason: err,
          });
        } else {
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

router.get("/get-brand", (req, res) => {
  try {
    db.query("select manufacture_name from vehicles", (err, result) => {
      if (err) {
        console.log(err);
        res.status(404).json({
          status: false,
          response: "Something Went Wrong",
          reason: err,
        });
      } else {
        res.status(200).json({
          status: true,
          response: result,
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
});
router.get("/getTopVehicle", (req, res) => {
  try {
    db.query(
      "select * from vehicles order by modified_date DESC;",
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            status: false,
            response: "Something Went Wrong",
            reason: err,
          });
        } else {
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

module.exports = router;
