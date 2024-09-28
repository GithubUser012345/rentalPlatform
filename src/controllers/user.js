const User = require("../models/user.js");

module.exports.signUpForm = (req,res) => {
    res.render("./users/register.ejs");
};

module.exports.signUp = async(req,res) =>{
    try{
        let {email, username, password} = req.body;
        let newUser = new User({email, username}); // Creates a new instance of the User model 

        //method by passport-local-mongoose plugin and is used to register a new user.Saves both the user and the hashed password in the database.
        let registeredUser = await User.register(newUser, password);
        //as signed in should login. req.login() is a method provided by Passport.js. It is used to log in a user after they've registered or authenticated.
        req.login(registeredUser, (err) =>{
            if(err){
                return next(err);
            }
            req.flash("success", "You Registered Successfully");
            res.redirect("/listings");
        });
    }catch(err){
        req.flash("error", err.message);
        res.redirect('/register');
    }
};

module.exports.logInForm = (req,res) => {
    res.render("./users/login.ejs");
};

//after successful login
module.exports.logIn = async(req,res) => {
    req.flash("success", `Welcome Back ${req.user.username}`);
    const redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(`${redirectUrl}`);
}

//req.logout is a Passport.js method that logs out the user by ending their session and removing the user's authentication information from req.user
module.exports.logOut = (req,res) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "Logged Out Successfully");
        res.redirect("/listings");
    });
};