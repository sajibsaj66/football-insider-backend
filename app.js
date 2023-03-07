require('express-async-error')
const error = require('./middlewares/error');
const app = require('express')();
const bodyParser = require('body-parser')

require('./middlewares')(app);
require('./middlewares/routes')(app);

app.use(error);
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());


module.exports = app;