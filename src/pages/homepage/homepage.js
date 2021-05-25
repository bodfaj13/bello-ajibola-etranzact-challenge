import React, { useState, useEffect, useRef } from 'react'
import Nav from '../../components/nav/nav'
import { Row, Col, Select, Pagination, notification, Spin } from 'antd'
import Productcard from '../../components/productcard/productcard'
import axios from 'axios';
import api from '../../config/api';

const openNotificationWithIcon = (type, msg, desc) => {
  notification[type]({
    message: msg,
    description: desc
  })
}

const { Option } = Select;

const Homepage = () => {
  const [products, setProducts] = useState([])
  const [currentlyViewing, setCurrentlyViewing] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const productHolder = useRef()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const getProducts = await axios.get(`${api}/product/all`)
      setProducts(getProducts.data.data)
      setCurrentlyViewing(getProducts.data.data)
      console.log(getProducts.data.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      if (error.response !== undefined) {
        openNotificationWithIcon('error', 'Get Products', error.response.data.error || error.response.data.message)
      } else {
        openNotificationWithIcon('error', 'Get Products', 'Something went wrong.')
      }
    }
  }

  const onPagiChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({
      behavior: 'smooth',
      top: productHolder.current.offsetTop
    })
  }

  const runFilter = (value) => {
    if (value === "name") {
      let sorted = [...currentlyViewing].sort((a, b) => a.productName.toLowerCase().localeCompare(b.productName.toLowerCase()))
      setCurrentlyViewing(sorted)
    } else {
      setCurrentlyViewing(products)
    }
  }

  const start = (currentPage - 1) * 8
  const end = (8 * currentPage)
  const realEnd = end > currentlyViewing.length ? currentlyViewing.length : end

  return (
    <div className="homepage">
      <Nav
        linkTo="/"
      />

      {
        loading ?
          <div className="loading-holder">
            <Spin size="large" />
          </div>
          :
          <>
            <div className="homepage-main">
              <div className="banner">
                <img src="/images/landingbanner.svg" alt="landingbanner" />
                <p className="shop-now-text">
                  SHOP NOW
          </p>
              </div>

              <div className="about">
                <Row gutter={64}>
                  <Col lg={10} xs={24}>
                    <div className="about-text">
                      <h1 className="title">
                        About the eCommerce Website
                </h1>
                      <p className="footnote">
                        Groceries
                </p>
                      <p className="about-desc">
                        eTranzact is your number one online shopping site in Nigeria. We are an online store where you can purchase all your electronics, as well as books, home appliances, kiddies items, fashion items for men, women, and children; cool gadgets, computers, groceries, automobile parts, and more on the go.
                </p>
                    </div>
                  </Col>
                  <Col lg={14} xs={24}>
                    <div className="hotsale-holder">
                      <h1 className="title">
                        HOT SALE!!!
                </h1>

                      <div className="hotsales">
                        <Row gutter={16}>
                          {
                            products.filter((item) => item.hotSale === 1).slice(0, 4).map((product) => (
                              <Col
                                lg={6}
                                key={`product-hotsales-${product._id}`}
                              >
                                <Productcard
                                  product={product}
                                />
                              </Col>
                            ))
                          }
                        </Row>
                      </div>

                    </div>
                  </Col>
                </Row>
              </div>

              <div className="product-catalogue" ref={productHolder}>
                <div className="top-holder">
                  <h1 className="title">
                    Product Catalog
                  </h1>
                  <div className="sort-holder">
                    <p className="sort-label">
                      <img src="/images/sort.svg" alt="" />
                      <span>
                        Sort
                      </span>
                    </p>
                    <Select
                      allowClear
                      placeholder="Filter"
                      className="sort-select"
                      bordered={false}
                      onChange={(value) => runFilter(value)}
                    >
                      <Option value="name">Name</Option>
                    </Select>
                  </div>
                </div>

                <div className="hotsales-catelog">
                  <Row gutter={16}>
                    {
                      currentlyViewing.slice(start, realEnd).map((product) => (
                        <Col lg={6} key={`product-show-${product._id}`}>
                          <Productcard
                            product={product}
                          />
                        </Col>
                      ))
                    }
                  </Row>
                  <div className="pagination-holder">
                    <Pagination
                      defaultCurrent={currentPage}
                      total={currentlyViewing.length}
                      onChange={onPagiChange}
                      defaultPageSize={8}
                    />
                  </div>
                </div>

              </div>

            </div>
          </>

      }
    </div>
  )
}


export default Homepage
