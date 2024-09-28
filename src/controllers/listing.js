const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken }); //initializes the geocoding client with access token with an obj

module.exports.index = async (req,res) =>{
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
};

module.exports.newListingForm = (req,res) =>{
    res.render("./listings/new.ejs");
};

module.exports.post = async (req, res) => {
    try {
        // Geocoding
        const response = await geocodingClient.forwardGeocode({
            query: req.body.Listing.location, // Ensure this matches your form data structure
            limit: 1
        }).send();
        const coordinates = response.body.features[0].geometry.coordinates;

        // Image handling
        let url = req.file.path;
        let filename = req.file.filename;

        // Create new listing
        let listing = req.body.Listing;
        let newListing = new Listing(listing);
        newListing.image = { url, filename };
        newListing.owner = req.user._id;
        newListing.geometry = {
            type: "Point",
            coordinates: coordinates,
        };
        newListing.category = req.body.Listing.category;
        await newListing.save();
        req.flash("success", "New Listing Added");
        res.redirect("/listings");
    } catch (err) {
        console.log(err);
        req.flash("error", "Failed to create new listing");
        res.redirect("/listings");
    }
};

//search by title
module.exports.searchByTitle = async(req,res) =>{
    let title = req.query.title;
    let reqTitle= title.toLowerCase().trim().split(' ').join('');
    let allListings = await Listing.find({});
    let matchedListings = [];

    for (let list of allListings) {
        let listTitle = list.title.toLowerCase().trim().split(' ').join('');
        if (listTitle === reqTitle) {
            matchedListings.push(list);
        }
    }
        
    if (matchedListings.length > 0) {
        res.render("./listings/show.ejs", { listing: matchedListings[0] });
    } else {
        req.flash("error", "No listings found for the search criteria");
        res.redirect("/listings");
    }
    
};

module.exports.showListing = async (req,res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
        .populate({path: "reviews", populate: {path: "author"}})
        .populate("owner"); //The **populate()** method in Mongoose is used to replace references in your documents with the actual documents from other collections.
    if(!listing){ 
        req.flash("error", "Listing your are searching for does not exsist");
        res.redirect("/listings");
    }else{
        res.render("./listings/show.ejs", {listing});
    }
};

module.exports.editForm = async (req,res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){ 
        req.flash("error", "Listing your are searching for does not exsist");
        res.redirect("/listings");
    }
    console.log(req.body);
    res.render("./listings/edit.ejs", { listing });
};

module.exports.update = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.Listing }); // saves all non-file data
    console.log(listing);
    
    if(typeof req.file != "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    
    req.flash("success", "Listing Updated Successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.destroy = async(req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
};