const { getRestoCardDetails } = require('./restaurantController.js');

const Review = require('../models/Review.js');


async function handleRestoPageRequest(req, resp) {
    const id = req.params._id
    let restaurant = await getRestoCardDetails(id)
    console.log(restaurant)
    resp.render("resto-reviewpage", restaurant)
}

module.exports = { handleRestoPageRequest }