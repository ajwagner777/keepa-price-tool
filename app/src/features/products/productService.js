import axios from "axios"

const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://137.184.3.29:3000'

export const fetchProducts = async (term, filters = {}) => {
  let products = await axios.get(`${baseUrl}/v1/products/`, { params: {search: term, ...filters} })

  return products.data
}
