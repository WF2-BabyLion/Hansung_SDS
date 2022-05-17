const express = require('express');
const router = express.Router();
router.get('/create', (req, res) => {
  res.render('generate.html');
});
module.exports = router;
