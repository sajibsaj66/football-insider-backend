module.exports.ContentTypeMiddleware = {
    formData: (req, res, next) => {
        if (req.is('multipart/form-data')) {
            next();
        } else {
            res.status(404).json({
                status: false,
                message: 'Invalid content type'
            })
        }
    }
};