const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.post = async(req,res) => {
    let listing = await Listing.findById(req.params.id); //listing to which we want to add a review
    let review = new Review(req.body.review); //get the review obj from form and add to instance of Review model
    review.author = res.locals.currUser._id;
    listing.reviews.push(review); //add reviews to the listing
    listing.save();
    review.save();
    req.flash("success", "New Review Added");
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroy = async(req,res) => {
    let {id, reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId); //delete's review from Review collection
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
};