const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");

router.get("/trending", wrapAsync(async (req, res) => {
    let trendingListings = await Listing.find({ category: "Trending" });
    res.render("filters/trending", { trendingListings });
}));

router.get("/rooms", wrapAsync(async (req, res) => {
    let roomsListings = await Listing.find({ category: "Rooms" });
    res.render("filters/rooms", { roomsListings });
}));

router.get("/mountain", wrapAsync(async (req, res) => {
    let mountainListings = await Listing.find({ category: "Mountain" });
    res.render("filters/mountain", { mountainListings });
}));

router.get("/historic", wrapAsync(async (req, res) => {
    let historicListings = await Listing.find({ category: "Historic" });
    res.render("filters/historic", { historicListings });
}));

router.get("/farms", wrapAsync(async (req, res) => {
    let farmsListings = await Listing.find({ category: "Farms" });
    res.render("filters/farms", { farmsListings });
}));

router.get("/camping", wrapAsync(async (req, res) => {
    let campingListings = await Listing.find({ category: "Camping" });
    res.render("filters/camping", { campingListings });
}));

router.get("/boating", wrapAsync(async (req, res) => {
    let boatingListings = await Listing.find({ category: "Boating" });
    res.render("filters/boating", { boatingListings });
}));

router.get("/beachfront", wrapAsync(async (req, res) => {
    let beachfrontListings = await Listing.find({ category: "Beachfront" });
    res.render("filters/beachfront", { beachfrontListings });
}));

module.exports = router;


