if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ErrorClass.js");
const session = require("express-session");
const MongoStore = require('connect-mongo'); //database storage
// const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const filtersRouter = require("./routes/filter.js");

// const mongooseUrl = 'mongodb://127.0.0.1:27017/rental';
const dbUrl = process.env.ATLAS_URL;

main().then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
});
async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/views'));
// console.log(__dirname);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
      secret: process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60,
});

//Error handling for the session store
store.on("error", (err)=>{
    console.log("ERROR ON MONGO SESSION STORE", err);
});

const selectOps = session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
});
app.use(selectOps);
app.use(flash());
// app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    // console.log('Middleware execution: Setting locals');
    // console.log('User:', req.user); // Log user information
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);
app.use("/filters", filtersRouter);

//error-handling
app.all("*", (req,res,next) =>{
    next(new ExpressError(404, "Page not found"));
});

app.use((err,req,res,next)=> {
    let {statusCode = 500 , message = "Something went wrong"} = err;
    res.status(statusCode).render("./listings/error.ejs", {msg: message});
    // res.status(statusCode).send(msg);
});


app.listen(port, ()=>{
    console.log(`Listening to the port ${port}`);
});