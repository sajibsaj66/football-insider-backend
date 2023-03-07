const _ = require('lodash');
const axios = require('axios');

module.exports.newsList = async (req, res) => {
    try {
        const page = req.query.page

        const response = await axios.get(`https://livescore6.p.rapidapi.com/news/v2/list-by-sport?category=2021082315501532387&page=${page}`, {
            headers: {
                'X-RapidAPI-Key': process.env.NEWS_API_KEY,
                'X-RapidAPI-Host': process.env.NEWS_API_HOST
            }
        })
        const result = response.data.data
        let data = []
        for (d of result) {
            let item = _.pick(d, ["id", "title", "published_at"])
            item.image_url = d.image.data.urls.uploaded.thumbnail
            data.push(item)
        }
        return res.status(200).send({
            status: true,
            message: "News fetched successfully",
            data
        })
    } catch(error) {
        return res.status(200).send({
            status: true,
            message: error.message
        })
    }
}

module.exports.newsRedirectLink = async (req, res) => {
    const id = req.params.id

    const response = await axios.get(`https://livescore6.p.rapidapi.com/news/v2/detail?id=${id}`, {
            headers: {
                'X-RapidAPI-Key': process.env.NEWS_API_KEY,
                'X-RapidAPI-Host': process.env.NEWS_API_HOST
            }
        })
    const data = response.data
    return res.status(200).send({
        status: true,
        message: "Redirect link sent",
        newsLink: data.segmentTracking.newsParams.newsArticleUrl
    })  
}