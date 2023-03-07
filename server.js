require('dotenv/config');
const app = require('./app');
const mongoose = require('mongoose');
const cron = require('node-cron')
const {fetchLive, fetchToday} = require('./schedular/fixtureScheduledApi');

mongoose.connect(process.env.MONGODB_URL_LOCAL)
    .then(() => console.log("Connected to MongoDB!"))
    .catch(err => console.error("MongoDB Connection Failed!"));

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App running on port ${port}!`);
    cron.schedule('* * * * *', ()=> {
        fetchLive()
        console.log("Live data fetched")
    })
    cron.schedule('59 * * * *', ()=> {
        fetchToday()
        console.log("Today's data fetched")
    })
})