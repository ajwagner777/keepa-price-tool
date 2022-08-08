const httpStatus = require('http-status')
const axios = require('axios')
const ApiError = require('../utils/ApiError')

const { keepa } = require('../config/config')

const productService = require('../services/product.service')

const getProducts = async (req, res) => {
  try {
    let filters = {
      discountPercentage: req.query.discountPercentage,
      ratingCount: req.query.ratingCount,
      brands: req.query.brands,
      priceMax: req.query.priceMax,
      priceMin: req.query.priceMin
    }
    let products = await productService.searchForProducts(encodeURIComponent(req.query.search), req.query.page, filters)
  
    res.status(httpStatus.OK).json(products)
  } catch (error) {
    return res.json({error})
  }
}

module.exports = {
  getProducts,
}