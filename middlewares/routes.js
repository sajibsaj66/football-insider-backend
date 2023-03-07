const authSocialRouters = require('../routers/authSocialRouters');
const authLocalRouter = require('../routers/authLocalRouters')
const footballApiRoutes = require('../routers/footballApiRoutes')
const newsApiRouter = require('../routers/newsApiRouter')
const userRouter = require('../routers/userRouter')

module.exports = (app) => {
    app.use('/auth', authLocalRouter)
    app.use('/auth', authSocialRouters)

    app.use('/api', footballApiRoutes )
    app.use('/newsApi', newsApiRouter )
    app.use('/user', userRouter )
}