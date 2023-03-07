let today = new Date()
let todayInDate = today.toISOString()
let splitTodayDate = todayInDate.split("T")

let tomorrow = new Date(today)
let tomorrowInSec = tomorrow.setDate(tomorrow.getDate() + 1)
let tomorrowInDate = new Date(tomorrowInSec).toISOString()
let splitTomorrowDate = tomorrowInDate.split("T")

let yesterday = new Date(today)
let yesterdayInSec = yesterday.setDate(yesterday.getDate() - 1)
let yesterdayInDate = new Date(yesterdayInSec).toISOString()
let splitYesterdayDate = yesterdayInDate.split("T")


module.exports.todayYYMMDD = splitTodayDate[0]
module.exports.tomorrowYYMMDD = splitTomorrowDate[0]
module.exports.yesterdayYYMMDD = splitYesterdayDate[0]