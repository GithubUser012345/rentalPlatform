class ExpressError extends Error{
    constructor(statusCode,message){
        super();
        this.statusCode = statusCode;
        this.message = message; //Overrides the message property from Error class
    }
}

module.exports = ExpressError;