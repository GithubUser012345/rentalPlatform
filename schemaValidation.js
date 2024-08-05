const Joi = require('joi');

module.exports.ListingObjSchema = Joi.object({
    Listing: Joi.object({ //Listing obj from form body
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.string().allow("", null),
        geometry: Joi.string(),
        category: Joi.string().required()
    }).required(),
});



module.exports.ReviewObjSchema = Joi.object({
    review: Joi.object({ //review obj from form body
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required(),
    }).required(),
});


module.exports.UserObjSchema = Joi.object({
    email: Joi.string().required(),
    username: Joi.string().required()
});