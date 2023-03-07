const router = require('express').Router();
const socialAuth = require('../controllers/auth/socialAuth')

router.route('/social')
    .post(socialAuth);


module.exports = router;