const express = require("express");
const citizenPool = require("../models/citizendb");
const pool = require("../models/localdb");
const methodOverride = require("method-override");
const { ensureAuthenticated, checkUserType, checkNotAuthenticated, checkRhuAccess, setUserData } = require('../middleware/middleware');
const router = express.Router();

router.use(methodOverride("_method"));
router.use(setUserData);

router.get("/nurse", ensureAuthenticated, checkUserType("nurse"), (req, res) => {
  res.render("nurse/nurse", { user: req.user, message: {} });
});

router.get('/api/search/:searchValue', async (req, res) => {
  const unq_id = req.params.searchValue;

  try {
    const result = await pool.query("SELECT * FROM patients WHERE unq_id = $1", [unq_id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send("Patient not found");
    }
  } catch (err) {
    console.error("Error querying database:", err.message);
    res.status(500).send("Server error");
  }
});

router.get("/api/citizen/:last_name/:first_name/:middle_name", async (req, res) => {
  const { last_name, first_name, middle_name } = req.params;

  try {
    const queryText = `
      SELECT * FROM citizen
      WHERE last_name = $1 AND first_name = $2 AND middle_name = $3
    `;

    const result = await citizenPool.query(queryText, [last_name, first_name, middle_name]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      console.log(`User not found for last_name=${last_name}, first_name=${first_name}, middle_name=${middle_name}`);
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.error("Error querying database:", err.message);
    res.status(500).send("Server error");
  }
});

router.get("/api/citizen/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await citizenPool.query(
      "SELECT * FROM citizen WHERE unq_id = $1",
      [id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/nurse/send-patient-info", ensureAuthenticated, checkUserType("nurse"), async (req, res) => {
  try {
    const {
      unq_id,
      check_date,
      last_name,
      first_name,
      middle_name,
      address,
      barangay,
      town,
      birthdate,
      gender,
      phone,
      email,
      philhealth_no,
      occupation,
      guardian,
      height,
      weight,
      systolic,
      diastolic,
      temperature,
      pulse_rate,
      respiratory_rate,
      bmi,
      comment,
    } = req.body;

    const rhu_id = req.user.rhu_id;

    const query = `
      INSERT INTO patients (unq_id, rhu_id, check_date, last_name, first_name, middle_name, address, barangay, town,
      birthdate, gender, phone, email, philhealth_no, occupation,
      guardian, height, weight, systolic, diastolic, temperature,
      pulse_rate, respiratory_rate, bmi, comment)
      VALUES ($1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12, $13,
      $14, $15, $16, $17, $18, $19,
      $20, $21, $22, $23, $24, $25)
      RETURNING *;
    `;

    const values = [
      unq_id,
      rhu_id,
      check_date,
      last_name,
      first_name,
      middle_name,
      address,
      barangay,
      town,
      birthdate,
      gender,
      phone,
      email,
      philhealth_no,
      occupation,
      guardian,
      height,
      weight,
      systolic,
      diastolic,
      temperature,
      pulse_rate,
      respiratory_rate,
      bmi,
      comment,
    ];

    const result = await pool.query(query, values);
    res.render('nurse/nurse', { user: req.user, message: { success: 'Patient added successfully!' } });
  } catch (err) {
    console.error(err);
    res.render('nurse/nurse', { user: req.user, message: { error: 'An error occurred while adding the patient.' } });
  }
});

//-------------------functions------//
router.delete("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

module.exports = router;
