const User = require("../models/user.js");

module.exports.signUpForm = (req,res) => {
    res.render("./users/register.ejs");
};

module.exports.signUp = async(req,res) =>{
    try{
        let {email, username, password} = req.body;
        let newUser = new User({email, username});
        let registeredUser = await User.register(newUser, password);
        //as signed in should login
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

module.exports.logIn = async(req,res) => {
    req.flash("success", `Welcome Back ${req.user.username}`);
    console.log(req.session.redirectUrl);
    const redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(`${redirectUrl}`);
}

module.exports.logOut = (req,res) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "Logged Out Successfully");
        res.redirect("/listings");
    });
};