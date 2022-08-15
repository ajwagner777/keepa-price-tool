import axios from "axios"

export const fetchProducts = async (term, filters = {}) => {
  let products = await axios.get('http://localhost:3000/v1/products/', { params: {search: term, ...filters} })

  return products.data
}
