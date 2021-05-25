import React, { useState, useEffect } from 'react'
import { Modal, Row, Col, Tag, Spin, notification, Skeleton } from 'antd'
import numeral from 'numeral'
import axios from 'axios';
import api from '../../config/api';

const openNotificationWithIcon = (type, msg, desc) => {
  notification[type]({
    message: msg,
    description: desc
  })
}

const Productcard = ({ product }) => {
  const [loadImage, setLoadImage] = useState(true)
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [productObject, setProductObject] = useState(null)


  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const getProduct = await axios.get(`${api}/product/${product._id}`)
        setProductObject(getProduct.data.data)
        console.log(getProduct.data.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        setVisible(false)
        if (error.response !== undefined) {
          openNotificationWithIcon('error', 'Get Products', error.response.data.error || error.response.data.message)
        } else {
          openNotificationWithIcon('error', 'Get Products', 'Something went wrong.')
        }
      }
    }

    if (visible) {
      fetchProduct()
    }
  }, [visible, product])

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <>
      <div className="productcard" onClick={() => showModal()}>
        <div className="img-holder">

          {
            loadImage && <Skeleton.Button
              active={true}
              size="large"
              shape="square"
            />

          }

          <div className={`${loadImage ? 'hide' : ''}`}>
            <img
              src={product.productImageUrl}
              alt="productimage"
              onLoad={() => setLoadImage(false)}
            />
          </div>

        </div>
        <div className="product-text">
          <p className="product-title">
            {product.productName}
          </p>
          <p className="pricing">
            ₦ {numeral(product.productPrice).format('0,0')}
          </p>
        </div>
        {
          product.bestSeller &&
          <p className="best-seller">
            BEST SELLER
        </p>
        }

      </div>
      <Modal
        title={null}
        visible={visible}
        onOk={handleCancel}
        onCancel={handleCancel}
        footer={null}
        className="custom-modal"
      >
        <h1 className="title">
          Product Details
       </h1>

        {
          loading && <div className="spin-holder">
            <Spin size="large" />
          </div>
        }

        {
          !loading && productObject !== null && <div className="product-modal-main">
            <div className="product-img-text">
              <Row gutter={32}>
                <Col lg={8} xs={24}>
                  <div className="img-holder">
                    <img
                      src={productObject.productImageUrl} alt="productimage"
                    />
                  </div>
                </Col>
                <Col lg={16} xs={24}>
                  <p className="product-title">
                    {productObject.productName}
                  </p>
                  <div className="tags-holder">
                    {
                      productObject.category.map((cat) => (
                        <Tag key={cat._id} color="#C4C4C4" className="cat-tag" >{cat.name}</Tag>
                      ))
                    }
                  </div>
                  <p className="pricing">
                    ₦ {numeral(productObject.productPrice).format('0,0')}
                  </p>
                </Col>
              </Row>
            </div>

            <div className="product-desc">
              <p className="info-label">
                Product Description
              </p>
              <p className="desc-text">
                {productObject.productDescription}
              </p>
            </div>


            <div className="product-desc">
              <p className="info-label">
                Seller Information
              </p>

              {
                productObject.user !== null ?
                  <>
                    <h1 className="seller">
                      {productObject.user.name}
                    </h1>

                    <ul className="address-list">
                      {
                        productObject.user.contactInfo.map((info) => (
                          <li key={info._id}>
                            <span className="phone">
                              {info.phoneNumber}
                            </span>
                            <span className="address">
                              {info.address}
                            </span>
                          </li>
                        ))
                      }
                    </ul>
                  </>
                  :
                  <p>
                    Seller information not available.
                  </p>
              }

            </div>
          </div>
        }


      </Modal>
    </>
  )
}


export default Productcard
