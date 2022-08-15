import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchProducts } from './productService';

const initialState = {
  results: [],
  page: 1,
  limit: 0,
  totalPages: 0,
  totalResults: 0,
  loading: false,
  pristine: true,
}

export const searchProducts = createAsyncThunk(
  'product/searchProducts',
  async ({term, filters}) => {
    return await fetchProducts(term, filters)
  }
)

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers:{},
  extraReducers: (builder) => {
    builder
      .addCase(searchProducts.pending, (state) => {
        state.pristine = false
        state.loading = true
        state.results = initialState.results
        state.page = initialState.page
        state.limit = initialState.limit
        state.totalPages = initialState.totalPages
        state.totalResults = initialState.totalResults
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.results = action.payload.results
        state.page = action.payload.page
        state.limit = action.payload.limit
        state.totalPages = action.payload.totalPages
        state.totalResults = action.payload.totalResults
      })
  },
})

export const selectProducts = (state) => state.product

export default productSlice.reducer
