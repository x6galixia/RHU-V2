const express = require("express");
const router = express.Router();

router.get("/scanner", (req, res) => {
  res.render("qrcode/qrcode-scanner");
});

module.exports = router;
