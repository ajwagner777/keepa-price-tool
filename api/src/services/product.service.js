const axios = require('axios')
const { keepa } = require('../config/config')
const logger = require('../config/logger')

const searchForProducts = async (term = "", page = 1, filters = {}) => {
  try {
    let query = {
        title: term,
        page: page - 1,
        productType: 0,
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
    if (filters.brand) query.brand = filters.brand

    if (filters.priceMax || filters.priceMin) {
      query.current_NEW_lte = filters.priceMax * 100 || 9999999
      query.current_NEW_gte = filters.priceMin * 100 || 0
    }

    //console.log({query,filters})
    
    // Find all product ASIN's matching the query above
    let products = await axios.post(`${keepa.baseUrl}/query?key=${keepa.key}&domain=${keepa.domain}`, query)

    // Pagination
    payload.totalResults = products.data.totalResults
    payload.totalPages = Math.ceil(products.data.totalResults / query.perPage)

    let asinList = products.data.asinList || []

    // Get product data from the list of ASINs
    let queryParams = {
      key: keepa.key,
      domain: keepa.domain,
      history: 1,
      days: keepa.daysOfHistory,
      asin: asinList.join(',')
    }
    let fullResults = await axios.get(`${keepa.baseUrl}/product`, { params: queryParams })
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
  let current = null,
    avgPrice = 0,
    avgCount = 0

  hist.forEach((h, idx) => {
    // even indecies have date, odds have price
    if(idx % 2 === 0) {
      data.timestamp = normalizeKeepaDate(h)
      data.date = normalizeKeepaDate(h, true)
    } else {
      data.price = h == -1 ? null : h / 100
      csvData.push(data)
      if (h !== -1) {
        current = data
        avgCount++
        avgPrice += data.price
      }
      // Reset the object to default
      data = {timestamp: 0, date: null, price: null}
    }
  })

  // Calculate average and change
  let average = avgCount ? avgPrice / avgCount : null
  let change = current?.price && average ? (current?.price - average) / current?.price : null

  return {
    history: csvData, 
    current,
    average,
    change,
  }
}

const normalizeKeepaDate = (keepaDate, format = false) => {
  let actualDate = (keepaDate + 21564000) * 60000

  return format ? new Date(actualDate) : actualDate 
}

module.exports = {
  searchForProducts
}