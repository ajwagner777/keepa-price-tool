const httpStatus = require('http-status')

const productService = require('../services/product.service')

const getProducts = async (req, res) => {
  try {
    let filters = {
      discountPercentage: req.query.discountPercentage,
      ratingCount: req.query.ratingCount,
      brand: req.query.brand,
      priceMax: req.query.priceMax,
      priceMin: req.query.priceMin
    }
    let products = await productService.searchForProducts((req.query.search), req.query.page, filters)
  
    res.status(httpStatus.OK).json(products)
  } catch (error) {
    return res.json({error})
  }
}

module.exports = {
  getProducts,
}