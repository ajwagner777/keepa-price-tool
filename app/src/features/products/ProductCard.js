import React, { useState, useMemo } from 'react'
import numeral from 'numeral'
import classnames from 'classnames'
import { ResponsiveLineCanvas } from '@nivo/line'
import styles from './ProductList.module.css'

export default ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(0)

  const handleImageSelect = (direction) => {
    let images = product.images.length
    if (direction == -1 && selectedImage == 0) setSelectedImage(product.images.length - 1)
    else if (direction == 1 && (images - 1) == selectedImage) setSelectedImage(0)
    else setSelectedImage(selectedImage + direction)
  }

  const data = [
    {
      id: 'Price History',
      data: product.price.history.filter(x => x.price).map(price => {
        return {
          x: new Date(price.date), 
          y: price.price
        }
      })
    },
  ]

  const chartProperties = {
    data,
    margin: { top: 10, right: 10, bottom: 20, left: 40 },
    xScale: {
      type: 'time',
      format: '%Y-%m-%d',
      precision: 'day',
    },
    xFormat:"time:%Y-%m-%d",
    yScale: { type: 'linear' },
    yFormat:" >-$,.2f",
    axisLeft:{
      legend: 'Price',
      legendOffset: -30,
    },
    axisBottom:{
      format: '%b %d',
    },
    enablePoints: true,
    enablePointLabel: false,
    colors: { scheme: 'accent' },
    pointColor: { from: 'color', modifiers: [] },
    pointSize: 6,
    lineWidth: 2,
    enableArea: true,
    areaOpacity: 0.25,
    pointBorderWidth: 1,
    pointBorderColor: {
      from: 'color',
      modifiers: [['darker', 1]],
    },
    useMesh: true,
    enableSlices: false,
    enableCrosshair: true,
  }

  return (
    <div className="card mb-3">
      <div className="row g-0">
        <div className={classnames("col-md-4", styles.imageSliderContainer)}>
          {product.images.length > 1 && <div className={classnames(styles.imageSliderControl, styles.imageSliderControlLeft)} onClick={() => handleImageSelect(-1)}><i className="bi bi-chevron-double-left" /></div>}
          <img src={product.images[selectedImage]} className="img-fluid rounded-start" alt="" />
          {product.images.length > 1 && <div className={classnames(styles.imageSliderControl, styles.imageSliderControlRight)} onClick={() => handleImageSelect(1)}><i className="bi bi-chevron-double-right" /></div>}
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h4 className="card-title"><a href={product.url} target="_blank">{product.title}</a></h4>
            <div className='row'>
              <div className='col'>{product.brand}</div>
              <div className='col'><p className="card-text"><small className="text-muted">Last updated: {product.price.current ? new Date(product.price.current?.date).toLocaleDateString() : "Unknown"}</small></p></div>
            </div>
            <hr />
            <div className='row'>
              <div className="col">
                <h5>Current Price:<br /> {numeral(product.price.current?.price).format('$0,0.00') || "Unknown"}</h5>
              </div>
              <div className="col">
                <h5>Historical Average:<br /> {numeral(product.price.average).format('$0,0.00') || "Unknown"}</h5>
              </div>
              <div className="col">
                <h5>
                  <span className={classnames({
                    "text-success": product.price.change < 0,
                    "text-danger": product.price.change > 0,
                  })}>Change:<br /> {numeral(product.price.change).format('0.0%') || "Unknown"}</span>
                </h5>
              </div>
            </div>
            <div className="row">
              <div className="col" style={{ height: 250 }}>
                <ResponsiveLineCanvas {...chartProperties} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}