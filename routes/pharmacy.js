const express = require("express");
const pool = require("../models/localdb");
const pharmacyPool = require("../models/pharmacydb");
const methodOverride = require("method-override");
const {
  ensureAuthenticated,
  checkUserType,
} = require("../middleware/middleware");
const router = express.Router();

router.use(methodOverride("_method"));
router.use(setUserData);

router.get("/pharmacy/inventory", ensureAuthenticated, checkUserType("pharmacist"), async (req, res) => {
  try {
    const lowStockResult = await pharmacyPool.query('SELECT product_name, product_quantity FROM inventory WHERE product_quantity < 50');

    const lowStockItems = lowStockResult.rows;
    const medList = await inventoryLists();
    res.render("pharmacy/pharmacy", {
      medList,
      lowStockItems,
      user: req.user
    });
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(500);
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

router.get("/pharmacy/beneficiary-records", ensureAuthenticated, checkUserType("pharmacist"), async (req, res) => {
  try {
    const getListBeneficiary = await beneficiaryList();
    const getListBeneficiaryIndex = await beneficiaryIndexList();
    res.render("pharmacy/beneficiary", { getListBeneficiary, getListBeneficiaryIndex });
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(500);
  }
});

router.get("/pharmacy/dispense", ensureAuthenticated, checkUserType("pharmacist"), async (req, res) => {
  try {
    const dispenseMed = await forDispense();
    res.render("pharmacy/dispense", { dispenseMed });
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(500);
  }
});

router.get("/pharmacy/add-medicine", ensureAuthenticated, checkUserType("pharmacist"), (req, res) => {
  res.render("pharmacy/addmedicine");
});

router.get("/pharmacy/trends", ensureAuthenticated, checkUserType("pharmacist"), (req, res) => {
  res.render("pharmacy/trends");
});

router.post("/pharmacy/add-medicine", ensureAuthenticated, checkUserType("pharmacist"), async (req, res) => {
  try {
    const { product_id, product_code, product_name, brand_name, supplier, dosage_form, dosage, reorder_level, batch_number, date_added, expiration, product_quantity } = req.body;

    await pharmacyPool.query("INSERT INTO inventory (product_id, product_code, product_name, brand_name, supplier, dosage_form, dosage, reorder_level, batch_number, date_added, expiration, product_quantity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)", [product_id, product_code, product_name, brand_name, supplier, dosage_form, dosage, reorder_level, batch_number, date_added, expiration, product_quantity]);

    res.render("pharmacy/addmedicine");
  } catch (error) {
    console.log("ERrror: Error adding medicine");
  }
});

router.get('/get', ensureAuthenticated, checkUserType("pharmacist"), async (req, res) => {
  const { query } = req.query;
  console.log("Received query:", query);

  if (!query) {
    return res.status(400).send('Query parameter is required');
  }

  try {
    const result = await pharmacyPool.query(
      'SELECT batch_number, expiration FROM inventory WHERE product_name ILIKE $1',
      [`${query}%`]
    );

    if (result.rows.length > 0) {
      console.log("Database query result:", result.rows[0]);
      res.json(result.rows[0]);
    } else {
      console.log("No matching data found");
      res.json({});
    }
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).send('Server error');
  }
});

router.post("/search-beneficiary", ensureAuthenticated, checkUserType("pharmacist"), async (req, res) => {
  try {
    const { search } = req.body;

    if (!search) {
      req.flash("error", "Search query is required.");
      return res.redirect('/pharmacy/beneficiary-records');
    }

    const searchResult = await pharmacyPool.query(
      "SELECT * FROM beneficiary WHERE beneficiary_name ILIKE $1 OR beneficiary_contact ILIKE $2",
      [`%${search}%`, `%${search}%`]
    );

    const getListBeneficiaryIndex = await beneficiaryIndexList();
    const getListBeneficiary = searchResult.rows;

    res.render("pharmacy/beneficiary", { getListBeneficiary, getListBeneficiaryIndex });
  } catch (err) {
    console.error("Error searching beneficiary:", err);
    req.flash("error", "An error occurred while searching for beneficiary: " + err.message);
    res.redirect('/pharmacy/beneficiary-records');
  }
});


router.post('/search-medicine', ensureAuthenticated, checkUserType("pharmacist"), async (req, res) => {
  try {
    const { search } = req.body;
    console.log("Search term:", search);

    const lowStockResult = await pharmacyPool.query('SELECT product_name, product_quantity FROM inventory WHERE product_quantity < 50');

    const lowStockItems = lowStockResult.rows;

    const searchResult = await pharmacyPool.query(
      "SELECT * FROM inventory WHERE product_id ILIKE $1 OR product_name ILIKE $2",
      [`%${search}%`, `%${search}%`]
    );

    console.log("Search result:", searchResult.rows);

    const result = searchResult.rows.map(row => ({
      ...row
    }));

    const medList = await inventoryLists();
    console.log("Inventory List:", medList);

    res.render('pharmacy/pharmacy', {
      medList: result,
      lowStockItems,
      user: req.user
    });
  } catch (err) {
    console.error("Error searching product:", err);
    req.flash("error", "An error occurred while searching for product: " + err.message);
    res.redirect('/pharmacy/inventory');
  }
});

router.post('/dispense-medicine', ensureAuthenticated, checkUserType("pharmacist"), async (req, res) => {
  const client = await pharmacyPool.connect();
  try {
    const {
      dosage, beneficiary_name, beneficiary_gender, beneficiary_address, beneficiary_contact, beneficiary_age,
      transaction_number, batch_number, expiration_date, date_issued, product_details, quantity, prescribing_doctor,
      requesting_person, relationship_beneficiary, unq_id
    } = req.body;

    const medinfo = product_details + " " + dosage;

    const formattedData = {
      transaction_number: formatArray(transaction_number, 'text'),
      batch_number: formatArray(batch_number, 'text'),
      expiration_date: formatArray(expiration_date, 'date'),
      date_issued: formatArray(date_issued, 'date'),
      product_details: formatArray(medinfo, 'text'),
      quantity: formatArray(quantity, 'int'),
      prescribing_doctor: formatArray(prescribing_doctor, 'text'),
      requesting_person: formatArray(requesting_person, 'text'),
      relationship_beneficiary: formatArray(relationship_beneficiary, 'text'),
      beneficiary_name,
      beneficiary_gender,
      beneficiary_contact,
      beneficiary_age
    };

    console.log('Data being updated:', formattedData);

    await client.query('BEGIN');

    const beneficiaryCheckQuery = `
      SELECT id FROM beneficiary
      WHERE beneficiary_name = $1
        AND beneficiary_gender = $2
        AND beneficiary_contact = $3
        AND beneficiary_age = $4
    `;
    const beneficiaryCheckParams = [
      formattedData.beneficiary_name,
      formattedData.beneficiary_gender,
      formattedData.beneficiary_contact,
      formattedData.beneficiary_age
    ];

    const checkResult = await client.query(beneficiaryCheckQuery, beneficiaryCheckParams);
    console.log('Beneficiary check result:', checkResult.rows);

    if (checkResult.rows.length === 0) {
      throw new Error('Beneficiary not found');
    }

    const updateResult = await client.query(
      `UPDATE beneficiary 
       SET transaction_number = transaction_number || $1::text[], 
           batch_number = batch_number || $2::text[], 
           expiration_date = expiration_date || $3::date[], 
           date_issued = date_issued || $4::date[], 
           product_details = product_details || $5::text[], 
           quantity = quantity || $6::int[], 
           prescribing_doctor = prescribing_doctor || $7::text[], 
           requesting_person = requesting_person || $8::text[], 
           relationship_beneficiary = relationship_beneficiary || $9::text[] 
       WHERE beneficiary_name = $10 
         AND beneficiary_gender = $11 
         AND beneficiary_contact = $12 
         AND beneficiary_age = $13`,
      [
        formattedData.transaction_number,
        formattedData.batch_number,
        formattedData.expiration_date,
        formattedData.date_issued,
        formattedData.product_details,
        formattedData.quantity,
        formattedData.prescribing_doctor,
        formattedData.requesting_person,
        formattedData.relationship_beneficiary,
        formattedData.beneficiary_name,
        formattedData.beneficiary_gender,
        formattedData.beneficiary_contact,
        formattedData.beneficiary_age
      ]
    );

    console.log('Update result:', updateResult.rows);

    const inventoryResult = await pharmacyPool.query(
      'SELECT product_quantity FROM inventory WHERE product_name = $1 AND batch_number = $2 AND expiration = $3',
      [product_details, batch_number, expiration_date]
    );

    if (inventoryResult.rows.length > 0) {
      const currentQuantity = inventoryResult.rows[0].product_quantity;

      if (currentQuantity >= quantity) {
        const newQuantity = currentQuantity - quantity;

        await pharmacyPool.query(
          'UPDATE inventory SET product_quantity = $1 WHERE product_name = $2 AND batch_number = $3 AND expiration = $4',
          [newQuantity, product_details, batch_number, expiration_date]
        );

        await pool.query("DELETE FROM prescription WHERE unq_id = $1", [unq_id]);

        await client.query('COMMIT');
        res.redirect('/pharmacy/dispense');
      } else {
        throw new Error('Insufficient quantity in inventory');
      }
    } else {
      throw new Error('Medicine not found in inventory');
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error Adding dispense:", error);
    res.redirect('/pharmacy/dispense');
  } finally {
    client.release();
  }
});

router.get('/pharmacy/add-beneficiary', ensureAuthenticated, checkUserType("pharmacist"), async (req, res) => {
  res.render('pharmacy/addbeneficiary', { message: {} });
});


router.post('/pharmacy/add-beneficiary', ensureAuthenticated, checkUserType("pharmacist"), async (req, res) => {
  try {
    const {
      beneficiary_name,
      beneficiary_gender,
      beneficiary_address,
      beneficiary_contact,
      beneficiary_birthdate,
      beneficiary_age,
      senior_citizen,
      pwd,
      transaction_number = '{}',
      product_details = '{}',
      quantity = '{}',
      batch_number = '{}',
      expiration_date = '{}',
      date_issued = '{}',
      prescribing_doctor = '{}',
      requesting_person = '{}',
      relationship_beneficiary = '{}'
    } = req.body;

    await pharmacyPool.query(
      "INSERT INTO beneficiary (beneficiary_name, beneficiary_gender, beneficiary_address, beneficiary_contact, beneficiary_birthdate, beneficiary_age, senior_citizen, pwd, transaction_number, product_details, quantity, batch_number, expiration_date, date_issued, prescribing_doctor, requesting_person, relationship_beneficiary) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)",
      [
        beneficiary_name,
        beneficiary_gender,
        beneficiary_address,
        beneficiary_contact,
        beneficiary_birthdate,
        beneficiary_age,
        senior_citizen,
        pwd,
        transaction_number,
        product_details,
        quantity,
        batch_number,
        expiration_date,
        date_issued,
        prescribing_doctor,
        requesting_person,
        relationship_beneficiary
      ]
    );

    res.render('pharmacy/addbeneficiary', { message: { success: 'Beneficiary added successfully!' } });
  } catch (err) {
    console.error(`Error: cannot add beneficiary ${err}`);
    res.render('pharmacy/addbeneficiary', { message: { error: 'An error occurred while adding the beneficiary.' } });
  }
});



//-------------------functions---------///

async function inventoryLists() {
  try {
    const medicineInventory = await pharmacyPool.query("SELECT * FROM inventory");
    let medicineList = [];

    if (medicineInventory.rows.length > 0) {
      medicineList = medicineInventory.rows.map(med => ({
        ...med,
        expiration: formatDate(med.expiration)
      }));

      medicineList.sort((a, b) => a.product_name.localeCompare(b.product_name));
    }

    return medicineList;
  } catch (err) {
    console.log("Error: no data");
    return [];
  }
}

async function beneficiaryList() {
  try {
    const beneficiary = await pharmacyPool.query("SELECT * FROM beneficiary");
    let peopleList = [];

    if (beneficiary.rows.length > 0) {
      peopleList = beneficiary.rows.map(list => ({
        ...list
      }));
    }

    peopleList.sort((a, b) => {
      const getLatestDate = (dateArray) => {
        if (!dateArray || dateArray.length === 0) return null;
        const validDates = dateArray
          .filter(dateStr => dateStr)
          .map(dateStr => new Date(dateStr))
          .filter(date => !isNaN(date));
        return validDates.length > 0 ? new Date(Math.max(...validDates.map(date => date.getTime()))) : null;
      };

      const dateA = getLatestDate(a.date_issued);
      const dateB = getLatestDate(b.date_issued);

      if (dateA === null && dateB === null) {
        return 0;
      }
      if (dateA === null) {
        return 1;
      }
      if (dateB === null) {
        return -1;
      }

      return dateB - dateA;
    });

    return peopleList;
  } catch (err) {
    console.log("Error: no data");
    return [];
  }
}

async function beneficiaryIndexList() {
  try {
    const result = await pharmacyPool.query("SELECT * FROM beneficiary");
    const peopleList = result.rows.map(row => {
      const transactionNumber = Array.isArray(row.transaction_number) ? row.transaction_number : [];
      const productDetails = Array.isArray(row.product_details) ? row.product_details : [];
      const productQuantity = Array.isArray(row.quantity) ? row.quantity : [];
      const batchNumber = Array.isArray(row.batch_number) ? row.batch_number : [];
      const expirationDate = Array.isArray(row.expiration_date) ? row.expiration_date : [];
      const dateIssued = Array.isArray(row.date_issued) ? row.date_issued : [];
      const prescribingDoctor = Array.isArray(row.prescribing_doctor) ? row.prescribing_doctor : [];
      const requestingPerson = Array.isArray(row.requesting_person) ? row.requesting_person : [];
      const relationshipToBeneficiary = Array.isArray(row.relationship_beneficiary) ? row.relationship_beneficiary : [];

      return {
        ...row,
        transaction_number: transactionNumber,
        product_details: productDetails,
        quantity: productQuantity,
        batch_number: batchNumber,
        expiration_date: formatDate(expirationDate),
        date_issued: formatDate(dateIssued),
        prescribing_doctor: prescribingDoctor,
        requesting_person: requestingPerson,
        relationship_beneficiary: relationshipToBeneficiary
      };
    });
    return peopleList;
  } catch (err) {
    console.error("Error: no data", err);
    return [];
  }
}

async function forDispense() {
  try {
    const dispense = await pool.query("SELECT * FROM prescription");
    let dispenseList = [];

    if (dispense.rows.length > 0) {
      dispenseList = dispense.rows.map(list => ({
        ...list,
        check_date: formatDate(list.check_date)
      }));
    }
    return dispenseList;
  } catch (err) {
    console.log("Error: no data");
    return [];
  }
}

function setUserData(req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.firstname = req.user.firstname;
    res.locals.surname = req.user.surname;
    res.locals.middle_initial = req.user.middle_initial;
    res.locals.profession = req.user.profession;
  } else {
    res.locals.firstname = null;
    res.locals.surname = null;
    res.locals.middle_initial = null;
    res.locals.profession = null;
  }
  next();
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

function formatDatefr(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const formatArray = (data, type) => {
  if (Array.isArray(data)) {
    return data;
  }
  if (type === 'int') {
    return [parseInt(data, 10)];
  }
  if (type === 'date') {
    return [formatDatefr(data)];
  }
  return [data];
};

module.exports = router;