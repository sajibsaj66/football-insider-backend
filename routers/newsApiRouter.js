const router = require('express').Router();
const { newsList, newsRedirectLink } = require('../controllers/news/news');
const authorize = require('../middlewares/authorize')

router.get('/newsList', newsList);
router.get('/newsRedirect/:id', newsRedirectLink);

module.exports = router;