const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

//schema
let listingSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
        reqiure: true,
        default:1000,
    },
    location:{
        type: String,
        require: true,
    },
    country: {
        type: String,
        require: true,
    },
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },
    category: {
        type: String,
        enum: [
            "Trending",
            "Rooms",
            "Historic",
            "Mountain",
            "Camping",
            "Beachfront",
            "Boating",
            "Farms"
        ],
        required: true
    }
});

//mongoose middleware
listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await Review.deleteMany({_id : {$in:listing.reviews}});
    }
});

//model
let Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;