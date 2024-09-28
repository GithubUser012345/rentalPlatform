if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();

// In production, the server will run on the port specified by the hosting environment.
const PORT = process.env.PORT || 3000;
const path = require("path");
const mongoose = require('mongoose');

//method-override lets you use HTTP methods like PUT or DELETE in places like HTML forms that only supports GET & POST 
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ErrorClass.js");

//to manage user sessions in an Express application. It helps store data about a user's session, such as login status, across multiple requests.
const session = require("express-session");
//session store for express session
const MongoStore = require('connect-mongo'); //database storage

// connect-flash: It is used to pass temporary messages (like success or error notifications) between requests.
const flash = require("connect-flash");
const passport = require("passport");

// passport library along with passport-local strategy
const LocalStrategy = require("passport-local");

//user schema
const User = require("./models/user.js");

//all api endpoints
const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const filtersRouter = require("./routes/filter.js");

// const mongooseUrl = 'mongodb://127.0.0.1:27017/rental';
const dbUrl = process.env.ATLAS_URL;
async function main() {
  await mongoose.connect(dbUrl);
}
main().then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
});

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));

//to parse incoming form data and make it available as a JavaScript object, true: Allows the use of nested objects from the incoming request body 
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

//creating a mongo session store
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
      secret: process.env.SECRET,
    },
    //sessions remain active, but avoids constant updating the session’s timestamp, which improves performance & reduces unnecessary resource usage.
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

    //when a user first visits your application, a new session is created, irrespective of data modification
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
});
app.use(selectOps);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); //to maintain user authentication state across multiple requests.
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware for flash messages
app.use((req, res, next) => {
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

app.use((err,req,res,next)=> { //err will be from ExpressError class which extends build-in Error class
    let {statusCode = 500 , message = "Something went wrong"} = err;
    res.status(statusCode).render("./listings/error.ejs", {msg: message});
    // res.status(statusCode).send(msg);
});


app.listen(PORT, ()=>{
    console.log(`Listening to the port ${PORT}`);
});