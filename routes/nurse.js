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

router.get('/api/generate-id', async (req, res) => {
  try {
    const result = await pool.query("SELECT unq_id FROM patients ORDER BY unq_id DESC LIMIT 1");
    const lastId = result.rows.length > 0 ? result.rows[0].unq_id : 'A0000';

    const newId = generateNextId(lastId);

    res.json({ id: newId });
  } catch (err) {
    console.error('Error generating ID:', err.message);
    res.status(500).send('Server error');
  }
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

router.get("/api/citizen/:unq_id", async (req, res) => {
  const { unq_id } = req.params;

  try {
    const queryText = `
      SELECT * FROM citizen
      WHERE unq_id = $1
    `;

    const result = await citizenPool.query(queryText, [unq_id]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      console.log(`User not found for unq_id=${unq_id}`);
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.error("Error querying database:", err.message);
    res.status(500).send("Server error");
  }
});

router.post("/nurse/send-patient-info", ensureAuthenticated, checkUserType("nurse"), async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      unq_id, check_date, last_name, first_name, middle_name, address,
      barangay, town, birthdate, gender, phone, email, philhealth_no,
      occupation, guardian, height, weight, systolic, diastolic, temperature,
      pulse_rate, respiratory_rate, bmi, comment
    } = req.body;

    const rhu_id = req.user.rhu_id;

    await client.query('BEGIN');

    const existingPatientQuery = 'SELECT * FROM patients WHERE unq_id = $1';
    const { rows: existingPatient } = await client.query(existingPatientQuery, [unq_id]);

    if (existingPatient.length > 0) {
      const patient = existingPatient[0];

      const existingHistoryQuery = 'SELECT * FROM patient_history WHERE unq_id = $1';
      const { rows: existingHistory } = await client.query(existingHistoryQuery, [unq_id]);

      if (existingHistory.length === 0) {
        const {
          follow_date, diagnoses, findings, category, service, medicine,
          instruction, quantity, lab_result
        } = patient;

        const insertHistoryQuery = `
          INSERT INTO patient_history (
            unq_id, rhu_id, last_name, first_name, middle_name, address, barangay, town,
            birthdate, gender, phone, email, philhealth_no, occupation, guardian,
            check_date, height, weight, systolic, diastolic, temperature, pulse_rate,
            respiratory_rate, bmi, comment, follow_date, diagnoses, findings,
            category, service, medicine, instruction, quantity, lab_result
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
            $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28,
            $29, $30, $31, $32, $33, $34
          )
        `;

        const historyValues = [
          unq_id, rhu_id, last_name, first_name, middle_name, address, barangay, town,
          birthdate, gender, phone, email, philhealth_no, occupation, guardian,
          [patient.check_date], [patient.height], [patient.weight], [patient.systolic],
          [patient.diastolic], [patient.temperature], [patient.pulse_rate],
          [patient.respiratory_rate], [patient.bmi], [patient.comment],
          [patient.follow_date], [patient.diagnoses], [patient.findings],
          [patient.category], [patient.service], [patient.medicine],
          [patient.instruction], [patient.quantity], [patient.lab_result]
        ];

        await client.query(insertHistoryQuery, historyValues);

        const deletePatientQuery = 'DELETE FROM patients WHERE unq_id = $1';
        await client.query(deletePatientQuery, [unq_id]);
      } else {

        const appendHistoryQuery = `
          UPDATE patient_history
          SET 
            check_date = array_append(check_date, $2),
            height = array_append(height, $3),
            weight = array_append(weight, $4),
            systolic = array_append(systolic, $5),
            diastolic = array_append(diastolic, $6),
            temperature = array_append(temperature, $7),
            pulse_rate = array_append(pulse_rate, $8),
            respiratory_rate = array_append(respiratory_rate, $9),
            bmi = array_append(bmi, $10),
            comment = array_append(comment, $11),
            follow_date = array_append(follow_date, $12),
            diagnoses = array_append(diagnoses, $13),
            findings = array_append(findings, $14),
            category = array_append(category, $15),
            service = array_append(service, $16),
            medicine = array_append(medicine, $17),
            instruction = array_append(instruction, $18),
            quantity = array_append(quantity, $19),
            lab_result = array_append(lab_result, $20)
          WHERE unq_id = $1
        `;

        const appendValues = [
          unq_id, check_date, height, weight, systolic, diastolic, temperature,
          pulse_rate, respiratory_rate, bmi, comment,
          null, null, null, null, null, null, null, null, null
        ];

        await client.query(appendHistoryQuery, appendValues);
      }
    }

    const insertPatientQuery = `
      INSERT INTO patients (
        unq_id, rhu_id, check_date, last_name, first_name, middle_name, address,
        barangay, town, birthdate, gender, phone, email, philhealth_no, occupation,
        guardian, height, weight, systolic, diastolic, temperature, pulse_rate,
        respiratory_rate, bmi, comment
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
      ) RETURNING *
    `;

    const values = [
      unq_id, rhu_id, check_date, last_name, first_name, middle_name,
      address, barangay, town, birthdate, gender, phone, email, philhealth_no,
      occupation, guardian, height, weight, systolic, diastolic, temperature,
      pulse_rate, respiratory_rate, bmi, comment
    ];

    await client.query(insertPatientQuery, values);

    await client.query('COMMIT');
    res.render('nurse/nurse', { user: req.user, message: { success: 'Patient added successfully!' } });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Error adding patient:", err.message);
    res.render('nurse/nurse', { user: req.user, message: { error: 'An error occurred while adding the patient.' } });
  } finally {
    client.release();
  }
});

//-------------------functions------//
function generateNextId(currentId) {
  let prefix = currentId[0];
  let number = parseInt(currentId.slice(1), 10);

  if (number < 9999) {
    number += 1;
  } else {
    number = 1;
    if (prefix < 'Z') {
      prefix = String.fromCharCode(prefix.charCodeAt(0) + 1);
    } else {
      throw new Error("Maximum ID limit reached");
    }
  }

  const numberStr = number.toString().padStart(4, '0');
  return `${prefix}${numberStr}`;
}

router.delete("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

module.exports = router;
