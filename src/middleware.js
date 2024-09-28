const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ErrorClass.js");
const {ListingObjSchema, ReviewObjSchema} = require("./schemaValidation.js");

module.exports.isAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) { //req.isAuthenticated() is a Passport method that returns true if the user is logged in, and false if not.
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Login to get access");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        // console.log('Session Redirect URL:', req.session.redirectUrl); // Debugging
        res.locals.redirectUrl = req.session.redirectUrl; //res.locals can be easily accessed within the view. A convenient way to pass data to templates
        console.log('Locals Redirect URL:', res.locals.redirectUrl); // Debugging
        delete req.session.redirectUrl; // Clear the session value after using it
    }
    next();
};


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

//server-side validation middleware for listing(joi)
module.exports.validateListing = (req,res,next)=>{
    let {error} = ListingObjSchema.validate(req.body); //The validate() function returns an object with two properties: error (if validation fails) and value (the validated data). By using { error }, the code extracts only the error from the result.
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
};

//server-side validation middleware for review(joi)
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