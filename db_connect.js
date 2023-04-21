var mysql = require("mysql2");
const bcrypt = require("bcrypt");
var con = mysql.createConnection({
  host: "localhost", //host name
  user: "root", // your mysql username default is root
  password: "", // your mysql user password default for root is empty
  dateStrings: true, // used to display date in proper formats
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to Database");
  con.query(
    "CREATE DATABASE IF NOT EXISTS CAREXPERTZ ",
    async function (err, result) {
      if (err) throw err;
      con.query("use CAREXPERTZ");
      con.query(
        "Create TABLE if not exists users(user_id INT NOT NULL AUTO_INCREMENT , Full_Name VARCHAR(250) NOT NULL , Email_address VARCHAR(250) NOT NULL , Password VARCHAR(250) NOT NULL , Dob DATE NOT NULL , isAdmin ENUM('True','False') NOT NULL , isStaff ENUM('True','False') NOT NULL , Phone_number INT(20) NOT NULL , Address TEXT NOT NULL , isVerified ENUM('True','False') NOT NULL ,created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,last_modified_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (user_id), UNIQUE (Email_address));"
      );
      const AdminhashedPassword = await bcrypt.hash("admin@123", 10);
      const StaffhashedPassword = await bcrypt.hash("staff@123", 10);
      const UserhashedPassword = await bcrypt.hash("user@123", 10);
      con.query(
        `INSERT INTO users(Full_Name,Email_address,Password, isAdmin, isStaff, Phone_number, isVerified) VALUES ('CarExpertzAdmin', 'admin@carexpertz.com', '${AdminhashedPassword}', 'True', 'False', '1234567890', 'True'),('CarExpertzStaff', 'staff@carexpertz.com', '${StaffhashedPassword}', 'False', 'True', '1234567890', 'True'),('CarExpertzUser', 'user@carexpertz.com', '${UserhashedPassword}', 'False', 'False', '1234567890', 'True');`,
        (err, res) => {
          if (err) return;
        }
      );
      con.query(
        "CREATE TABLE if not exists verification (id INT NOT NULL AUTO_INCREMENT , user_id INT NOT NULL , otp INT NOT NULL , PRIMARY KEY (`id`),FOREIGN KEY (user_id) REFERENCES users(user_id))"
      );
      con.query(
        "CREATE TABLE if not exists vehicles (id int(11) NOT NULL AUTO_INCREMENT,manufacture_name varchar(250) NOT NULL,model_name varchar(250) NOT NULL,model_year year(4) NOT NULL,Vehicle_color varchar(250) NOT NULL,Engine_number varchar(250) NOT NULL,chasis_number varchar(250) NOT NULL,fuel_type enum('petrol','diesel','other') NOT NULL,transmission enum('Automatic','Manual') NOT NULL,extra_fittings enum('yes','no') NOT NULL,tax_valid date NOT NULL,total_km_driven int(11) NOT NULL,vehicle_registration_number varchar(250) NOT NULL,published enum('yes','no') NOT NULL,sold enum('yes','no') NOT NULL,description text NOT NULL,front_view_image text NOT NULL,rear_left_view_image text NOT NULL,thumbnail text NOT NULL,rear_view_image text NOT NULL,left_side_image text NOT NULL,rc_book_image text NOT NULL,pucc_image text NOT NULL,created_date timestamp NOT NULL DEFAULT current_timestamp(),modified_date timestamp NOT NULL DEFAULT current_timestamp(),created_by int(11) NOT NULL,price BIGINT NOT NULL,PRIMARY KEY (id),FOREIGN KEY (created_by) REFERENCES users(user_id))"
      );
      con.query(
        "CREATE TABLE if not exists employees(id INT NOT NULL AUTO_INCREMENT ,role VARCHAR(250) NOT NULL , branch VARCHAR(250) NOT NULL , department VARCHAR(250) NOT NULL , employee_code VARCHAR(250) NOT NULL UNIQUE , user_id INT NOT NULL ,FOREIGN KEY (user_id) REFERENCES users(user_id), PRIMARY KEY (id))"
      );
      con.query(
        `Insert into employees(ROLE,branch,department,employee_code,user_id) values('Marketing Executive','kochi','Sales','CEZ1',2)`,(err,res)=>{
          if(err) return
        }
      );
      con.query(
        "CREATE TABLE if not exists userprofile (id INT NOT NULL AUTO_INCREMENT , user_id INT NOT NULL , license_no VARCHAR(250) NOT NULL , license_expiry DATE NOT NULL , aadhar_no VARCHAR(250) NOT NULL ,FOREIGN KEY (user_id) REFERENCES users(user_id), PRIMARY KEY (id));"
      );
      con.query(
        "CREATE TABLE if not exists enquiry (id INT NOT NULL AUTO_INCREMENT , user_id INT NOT NULL, FOREIGN KEY(user_id) REFERENCES users(user_id), vehicle_id INT NOT NULL, FOREIGN KEY(vehicle_id) REFERENCES vehicles(id), employee_id INT NOT NULL, FOREIGN KEY(employee_id) REFERENCES users(user_id), employee_name VARCHAR(250) NOT NULL , test_drive_date DATE NOT NULL , slot_available ENUM('Yes','No') NOT NULL , Test_drive_timeslot VARCHAR(250) NOT NULL , Available_date DATE  , Available_time VARCHAR(250)  , Comments TEXT  , Current_Status VARCHAR(250) DEFAULT 'Processing' , Enquiry_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (id));"
      );
      con.query(
        'CREATE TABLE if not exists `sellers_vehicle` (`id` int(11) NOT NULL AUTO_INCREMENT,`user_id` int(11) NOT NULL,`employee_id` int(11) NOT NULL,employee_name varchar(250) NOT NULL,`full_Name` varchar(250) NOT NULL,`email` varchar(250) NOT NULL,`phoneNumber` varchar(250) NOT NULL,`address` text NOT NULL,`Aadhar` varchar(250) NOT NULL,`Manufacturename` varchar(250) NOT NULL,`modelyear` year(4) NOT NULL,`engineNumber` varchar(250) NOT NULL,`ChasisNumber` varchar(250) NOT NULL,`transmission` varchar(250) NOT NULL,`taxvalid` date NOT NULL,`Extrafitting` enum("Yes","No") NOT NULL,`left_view` text NOT NULL,`rear_view` text NOT NULL,`pucc_image` text NOT NULL,`ModelName` varchar(250) NOT NULL,`vehicleColor` varchar(250) NOT NULL,`kmdriven` varchar(250) NOT NULL,`fuelType` varchar(250) NOT NULL,`vlocation` varchar(250) NOT NULL,`vehicle_registration_number` varchar(250) NOT NULL,`front_view` text NOT NULL,`rear_left_view` text NOT NULL,`rc_book` text NOT NULL,`price` varchar(250) NOT NULL,`Comments` text NOT NULL,`vehicle_ok` ENUM("yes","no") NOT NULL DEFAULT "no" ,  `inspected_vehicle` ENUM("yes","no") NOT NULL DEFAULT "no" , `inspected_vehicle_with_techinican` ENUM("yes","no") NOT NULL DEFAULT "no" ,  `comments_employee` TEXT NOT NULL,`current_status` VARCHAR(250) NOT NULL DEFAULT "Processing",`created_date` timestamp NOT NULL DEFAULT current_timestamp(),PRIMARY KEY (`id`), KEY `Foregin key` (`user_id`),CONSTRAINT `Foregin key` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE)'
      )
    }
  );
});

module.exports = con;
