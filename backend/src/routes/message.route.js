const express = require('express');
const router = express.Router();

router.get('/send', (req, res) => {
    res.send('send Messages route');
});
module.exports = router;
