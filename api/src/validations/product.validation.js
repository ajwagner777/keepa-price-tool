const Joi = require('joi');

const getProducts = {
  query: Joi.object().keys({
    search: Joi.string().required(),
    page: Joi.number().default(1),
    discountPercentage: Joi.number(),
    ratingCount: Joi.number(),
    brand: Joi.string(),
    priceMax: Joi.number().min(0).max(9999999),
    priceMin: Joi.number().min(0).max(9999999) 
  }),
}

module.exports = {
  getProducts,
}