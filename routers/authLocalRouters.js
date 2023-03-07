const router = require('express').Router();
const {register, login} = require('../controllers/auth/userAuth');
const { verifyOTP } = require('../controllers/auth/verifyOTP');

router.route('/register')
    .post(register);

router.route('/login')
    .post(login);

router.route('/verifyOTP')
    .post(verifyOTP);

module.exports = router;