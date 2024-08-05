const express = require("express");
const router = express.Router();
const pool = require("../models/localdb");

router.get("/hidden/admin/create-user", (req, res) => {
    res.render("admin/admin", { message: {} });
});

router.post("/hidden/admin/create-user", async (req, res) => {
    try {
        const { user_id, rhu_id, surname, firstname, middle_initial, profession, username, password, user_type } = req.body;

        await pool.query("INSERT INTO users (user_id, rhu_id, surname, firstname, middle_initial, profession, username, password, user_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [user_id, rhu_id, surname, firstname, middle_initial, profession, username, password, user_type]);

        res.render("admin/admin", { message: { success: 'Successfully Registered' } });
    } catch (err) {
        console.error(`Error: ${err}`);
        res.render("admin/admin", { message: { error: 'An error occur while adding a user' } });
    }
});

module.exports = router;