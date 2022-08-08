const axios = require('axios')
const { keepa } = require('../config/config')
const logger = require('../config/logger')

const searchForProducts = async (term = "", page = 1, filters = {}) => {
  try {
    let query = {
        title: term,
        page,
        perPage: keepa.pageSize,
      },
      payload = {
        results: [],
        page,
        limit: query.perPage,
        totalPages: 0,
        totalResults: 0
      }
      

    // Add filters to the query
    if (filters.discountPercentage) query.deltaPercent90_NEW_gte = filters.discountPercentage
    if (filters.ratingCount) query.current_COUNT_REVIEWS_gte = filters.ratingCount
    if (filters.brands) query.brand = [filters.brands]

    if (filters.priceMax || filters.priceMin) {
      query.current_NEW_lte = filters.priceMax || 9999999
      query.current_NEW_gte = filters.priceMin || 0
    }

    console.log(query)
    
    // Find all product ASIN's matching the query above
    let products = await axios.post(`${keepa.baseUrl}/query?key=${keepa.key}&domain=${keepa.domain}`, query)

    // Pagination
    payload.totalResults = products.data.totalResults
    payload.totalPages = Math.ceil(products.data.totalResults / query.perPage)

    let asinList = products.data.asinList || []

    // Get product data from the list of ASINs
    let fullResults = await axios.get(`${keepa.baseUrl}/product?key=${keepa.key}&history=1&days=${keepa.daysOfHistory}&domain=${keepa.domain}&asin=${asinList.join(',')}`)
    payload.results = (fullResults?.data?.products || []).map(product => {
      return {
        ASIN: product.asin,
        url: `https://www.amazon.com/dp/${product.asin}`,
        title: product.title,
        images: (product.imagesCSV || "").split(',').map(image => `https://images-na.ssl-images-amazon.com/images/I/${image}`),
        manufacturer: product.manufacturer,
        brand: product.brand,
        description: product.description,
        price: extractCsvData(product.csv[1])
      }
    })

    return payload
  } catch (error) {
    logger.error(error)
    throw error
  }
}

const extractCsvData = (hist) => {
  let csvData = []
  let data = {timestamp: 0, date: null, price: null}
  let currentPrice = 0

  hist.forEach((h, idx) => {
    // even indecies have date, odds have price
    if(idx % 2 === 0) {
      data.timestamp = normalizeKeepaDate(h)
      data.date = normalizeKeepaDate(h, true)
    } else {
      data.price = h == -1 ? null : h / 100
      csvData.push(data)
      if (h !== -1) currentPrice = h / 100
      // Reset the object to defaul
      data = {timestamp: 0, date: null, price: null}
    }
  })

  return {history: csvData, currentPrice}
}

const normalizeKeepaDate = (keepaDate, format = false) => {
  let actualDate = (keepaDate + 21564000) * 60000

  return format ? new Date(actualDate) : actualDate 
}

module.exports = {
  searchForProducts
}