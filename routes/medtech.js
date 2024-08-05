const express = require("express");
const pool = require("../models/localdb");
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const methodOverride = require("method-override");
const { ensureAuthenticated, checkUserType, checkNotAuthenticated, checkRhuAccess, setUserData } = require('../middleware/middleware');
const router = express.Router();

router.use(methodOverride("_method"));
router.use(setUserData);

//------------------------------------MULTER CONFIGURATION--------------------------//
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.use("/uploads", express.static("uploads"));

//----------------------------------------------------------------------------------//

router.get("/medtech", ensureAuthenticated, checkUserType("medtech"), async (req, res) => {
  try {
    const getPatientsLab = await getPatientsForLab(req.user.rhu_id);
    res.render('medtech/medtech', {
      getPatientsLab,
      user: req.user
    });
  } catch (err) {
    console.error("Error fetching patients:", err);
    req.flash("error", "An error occurred while loading the dashboard.");
    res.redirect('/login');
  }
});

router.post('/add-LabResult', ensureAuthenticated, checkUserType('medtech'), upload.fields([{ name: 'lab_result', maxCount: 6 }]), async (req, res) => {
  const unq_id = req.body.unq_id;
  let lab_results = [];

  console.log("Received request for /add-LabResult");

  try {
    if (req.files && req.files['lab_result']) {
      for (let file of req.files['lab_result']) {
        lab_results.push(file.filename);
        console.log(`Processed file: ${file.filename}`);
      }
    } else {
      console.log("No files received");
    }

    const labResultsArray = `{${lab_results.map(filename => `"${filename}"`).join(",")}}`;

    const query = 'UPDATE patients SET lab_result = $1 WHERE unq_id = $2 AND rhu_id = $3';
    await pool.query(query, [labResultsArray, unq_id, req.user.rhu_id]);

    const getPatientsLab = await getPatientsForLab(req.user.rhu_id);
    res.redirect('/medtech');
  } catch (err) {
    console.error('Error adding lab result:', err);
    req.flash('error', 'An error occurred while adding a lab result.');
    res.redirect('/medtech');
  }
});

router.delete("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

//------------------------function-----------//

async function getPatientsForLab(rhuId) {
  try {
    const viewPatients = await pool.query("SELECT * FROM patients WHERE rhu_id = $1", [rhuId]);

    return viewPatients.rows
      .filter(row => row.category !== null && row.lab_result === null)
      .map(row => ({
        unq_id: row.unq_id,
        fullname: `${row.last_name} ${row.first_name} ${row.middle_name}`,
        age: calculateAge(formatDate(row.birthdate)),
        gender: row.gender,
        birthdate: formatDate(row.birthdate),
        guardian: row.guardian,
        occupation: row.occupation,
        check_date: formatDate(row.check_date),
        category: row.category,
        service: row.service
      }));
  } catch (err) {
    console.error("Error fetching patients:", err);
    return [];
  }
}

function calculateAge(birthdateString) {
  const birthdate = new Date(birthdateString);
  const today = new Date();

  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDifference = today.getMonth() - birthdate.getMonth();
  const dayDifference = today.getDate() - birthdate.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }
  return age;
}

function formatDate(dateString) {
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
}

module.exports = router;