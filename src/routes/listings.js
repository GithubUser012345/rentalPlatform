const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isAuthenticated, ownerAccess, validateListing, saveRedirectUrl} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {cloudinary,storage} = require("../cloudConfig.js");
const upload = multer({storage});

//index route & post request(new)
router.route("/")
.get(wrapAsync(listingController.index))
.post(isAuthenticated, upload.single("Listing[image]"), wrapAsync(listingController.post));

//searchByTitle
router.get("/search", saveRedirectUrl, listingController.searchByTitle);

//new route
router.get("/new", saveRedirectUrl, isAuthenticated, listingController.newListingForm);

//show route(index) & update router & delete route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isAuthenticated, ownerAccess, upload.single("Listing[image]"), validateListing, wrapAsync(listingController.update))
.delete(isAuthenticated, ownerAccess, wrapAsync(listingController.destroy));

//edit route
router.get("/:id/edit", isAuthenticated, ownerAccess, wrapAsync(listingController.editForm));

module.exports = router;