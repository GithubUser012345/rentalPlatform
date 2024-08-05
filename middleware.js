const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ErrorClass.js");
const {ListingObjSchema, ReviewObjSchema} = require("./schemaValidation.js");

module.exports.isAuthenticated = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Login to get access");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        console.log(req.session.redirectUrl);
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log('Redirect URL:', res.locals.redirectUrl); // Debugging statement
    }
    next();
}

module.exports.ownerAccess = async(req,res,next) => {
    const {id} = req.params;
    let listing = await Listing.findById(id);
    if(listing.owner && !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "Only owner have the access to make changes");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.authorAccess = async(req,res,next) => {
    let {id, reviewId} = req.params;
    let review = Review.findById(reviewId);
    if(review.author && !review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "Only owner can delete the review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//server-side validation middleware for listing
module.exports.validateListing = (req,res,next)=>{
    let {error} = ListingObjSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
};

//server-side validation middleware for review
module.exports.validateReview = (req,res,next) => {
    let {error} = ReviewObjSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
};