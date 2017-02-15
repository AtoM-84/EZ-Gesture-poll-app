var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('poll', { title: 'Answer the poll' });
});

module.exports = router;