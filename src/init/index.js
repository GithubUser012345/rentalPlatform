const mongoose = require("mongoose");

const Listing = require("../models/listing.js");
const initData = require("./data.js");

const mongooseUrl = 'mongodb://127.0.0.1:27017/rental';
main().then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
});
async function main() {
  await mongoose.connect(mongooseUrl);
}


const initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner:"66a3cee19b42fbf75ee01f4e"}));
    await Listing.insertMany(initData.data);
    console.log("data initialized");
}

initDB();