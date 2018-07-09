var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Personality - MusicPreferences' });
});

router.get('/home', function(req, res, next) {
  res.render('product', { title: 'Personality - MusicPreferences' });
});

router.get('/relation', function(req, res, next) {
  res.render('relation');
});


router.get('/tryit', function(req, res, next) {
  res.render('tryit', { title: 'Personality - MusicPreferences' });
});

module.exports = router;
