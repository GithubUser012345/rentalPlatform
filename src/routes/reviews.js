const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isAuthenticated, authorAccess} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

//post route for reviews
router.post("/",isAuthenticated, validateReview, wrapAsync(reviewController.post));

//delete route for reviews
router.delete("/:reviewId", isAuthenticated, authorAccess, wrapAsync(reviewController.destroy));

module.exports = router;