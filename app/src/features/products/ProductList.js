import React, { useState } from 'react'
import numeral from 'numeral'
import { useSelector, useDispatch } from 'react-redux'
import classnames from 'classnames'

import { searchProducts, selectProducts } from './productSlice'
import ProductCard from './ProductCard'

import styles from './ProductList.module.css'

const ProductList = () => {
  const dispatch = useDispatch()
  const products = useSelector(selectProducts)
  
  const handleSearchEnter = (event) => {
    if(event.code === 'Enter') {
      doSearch(1)
    }
  }

  const doSearch = (page = 1) => {
    dispatch(searchProducts({term: searchValue, filters: {
      page,
      discountPercentage: discountPercentage || null,
      brand: brand || null,
      ratingCount: ratingCount || null, 
      priceMin: priceMin || null,
      priceMax: priceMax || null,
    }}))
  }

  const changePage = direction => {
    doSearch(products.page + direction)
  }

  const [searchValue, setSearchValue] = useState()
  const [discountPercentage, setDiscountPercentage] = useState()
  const [brand, setBrand] = useState()
  const [ratingCount, setRatingCount] = useState()
  const [priceMin, setPriceMin] = useState()
  const [priceMax, setPriceMax] = useState()

  return <>
    <div className='container'>
      <div className="mb-3 row">
        <label htmlFor="productSearch" className={classnames("col-sm-12 col-form-label", styles.label)}>Search for a Product</label>
        <div className="col-sm-12">
          <input 
            readOnly={products.loading}
            type="text" 
            className={classnames("form-control-plaintext", styles.search, {[styles.searchLoading]: products.loading})} 
            id="productSearch" 
            placeholder='Adidas running shoes'
            onChange={(e) => setSearchValue(e.target.value)}
            defaultValue={searchValue}
            onKeyUp={handleSearchEnter} />
          <small>Press enter to search...</small>
          {!products.loading && !products.pristine && <div className="card text-bg-light my-3">
            <div className="card-header">Filters</div>
            <div className="card-body">
              <div className="row">
                <div className='col-md-3'>
                  <label htmlFor="discount-percentage" className="form-label">Discount Percentage</label>
                  <input 
                    className="form-control" 
                    id="discount-percentage" 
                    type="number" 
                    max={100} 
                    min={0} 
                    onChange={(e) => setDiscountPercentage(e.target.value)} 
                    onKeyUp={handleSearchEnter}
                    defaultValue={discountPercentage} />
                    <small>-10 means a 10% drop, 30 means a 30% increase.</small>
                </div>
                <div className='col-md-3'>
                  <label htmlFor="brand" className="form-label">Brand</label>
                  <input 
                    className="form-control" 
                    id="brand" 
                    type="text" 
                    defaultValue={brand} 
                    onKeyUp={handleSearchEnter}
                    onChange={(e) => setBrand(e.target.value)} />
                </div>
                <div className='col-md-3'>
                  <label htmlFor="rating-count" className="form-label">Rating Count</label>
                  <input 
                    className="form-control" 
                    id="rating-count" 
                    type="number"
                    min={0} 
                    defaultValue={ratingCount} 
                    onKeyUp={handleSearchEnter}
                    onChange={(e) => setRatingCount(e.target.value)} />
                </div>
                <div className='col-md-3'>
                  <div className="row">
                    <div className="col">
                      <label htmlFor="price-min" className="form-label">Price Min</label>
                      <input 
                        className="form-control" 
                        id="price-min" 
                        type="number" 
                        min={0} 
                        defaultValue={priceMin} 
                        onKeyUp={handleSearchEnter}
                        onChange={(e) => setPriceMin(e.target.value)} />
                    </div>
                    <div className="col">
                      <label htmlFor="price-max" className="form-label">Price Max</label>
                      <input 
                        className="form-control" 
                        id="price-max" 
                        type="number" 
                        min={0} 
                        defaultValue={priceMax} 
                        onKeyUp={handleSearchEnter}
                        onChange={(e) => setPriceMax(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>}
        </div>
        {!products.pristine && <div className='col-sm-12'>
          {products.loading && <div className="lds-dual-ring"></div>}
          {!products.loading && products.results?.length === 0 && <div className="alert alert-info mt-4 text-center" role="alert">
            <h4>No products found</h4>
          </div>}
          {!products.loading && products.results.length > 0 && <div className="btn-groupd mb-3 text-center" role="group">
            <button type="button" className="btn btn-primary" onClick={_ => changePage(-1)} disabled={products.page === 1}>Previous</button>
            <span className="p-3">{numeral(products.totalResults).format("0,0")} results | Page {numeral(products.page).format("0,0")} of {numeral(products.totalPages).format("0,0")}</span>
            <button type="button" className="btn btn-primary" onClick={_ => changePage(1)} disabled={products.page === products.totalPages}>Next</button>
          </div>}
          {!products.loading && products.results.length > 0 && <>
            {products.results.map((product) => <ProductCard key={product.ASIN} product={product} />)}
          </>}
        </div>}
      </div>
    </div>
  </>
}

export default ProductList
