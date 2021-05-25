import React, { useState, useEffect } from 'react'
import { Form, Input, Row, Col, Button, notification, Select, Checkbox } from 'antd'
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import api from '../../config/api';

const { Option } = Select;

const openNotificationWithIcon = (type, msg, desc) => {
  notification[type]({
    message: msg,
    description: desc
  })
}

const SocialMedia = ({ social, removeSocialMediaCard, totalLength, updateSocialInfo }) => {
  const { name, url } = social

  return (
    <div className="contactinfo-card">
      <Form
        initialValues={{
          name,
          url,
        }}
      >
        <Row gutter={32}>
          <Col lg={12} xs={24}>
            <Form.Item
              label="Name"
              name="name"
            >
              <Input onChange={(e) => updateSocialInfo(social._id, e.target.value, 'name')} />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              label="URL"
              name="url"
            >
              <Input onChange={(e) => updateSocialInfo(social._id, e.target.value, 'url')} />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {
        totalLength > 1 && <span className="close-btn" onClick={() => removeSocialMediaCard(social.id)}>
          x
      </span>
      }
    </div>
  )
}

const Editproduct = ({ handleCancelEditModal, productLoading, categories, fetchProducts, currentEdit }) => {
  const [form] = Form.useForm()
  const [socialMedia, setSocialMedia] = useState([{
    id: uuidv4(),
    name: '',
    url: ''
  }])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const populateCategory = () => {
      const category = []
      currentEdit.category.map((cat) => (
        category.push(cat._id)
      ))
      form.setFieldsValue({
        category
      })
    }

    const populateTags = () => {
      const tags = []
      if (currentEdit.bestSeller === true) {
        tags.push("Best Seller")
      }
      if (currentEdit.hotSale === 1) {
        tags.push("Hot Sale")
      }
      form.setFieldsValue({
        tags
      })
    }

    setSocialMedia(currentEdit.socialMedia)
    populateTags()
    populateCategory()
    // eslint-disable-next-line
  }, [currentEdit])


  const addSocialMediaCard = () => {
    setSocialMedia([...socialMedia, {
      _id: uuidv4(),
      name: '',
      url: ''
    }])
  }

  const removeSocialMediaCard = (key) => {
    setSocialMedia(socialMedia.filter(social => social.id !== key))
  }

  const updateSocialInfo = (key, value, attribute) => {
    let socialMedias = [...socialMedia]
    let findItem = socialMedias.findIndex((social) => social._id === key)
    socialMedias[findItem][attribute] = value
    setSocialMedia(socialMedias)
  }

  const onFinishFailed = (errorInfo) => {
    openNotificationWithIcon('warning', 'Validation Error')
  }

  const onFinish = async (values) => {
    setLoading(true)
    productLoading(true)
    const getAnyEmpty = socialMedia.some((social) => social.name.trim().length === 0 || social.url.trim().length === 0)
    if (getAnyEmpty) {
      setLoading(false)
      productLoading(false)
      openNotificationWithIcon('warning', 'Validation Error', 'No Social Media field should be empty.')
    } else {
      const { productName, productImageUrl, productDescription, category, productPrice, productQuantity, tags } = values
      const details = {
        productName,
        productImageUrl,
        productDescription,
        productPrice: parseInt(productPrice),
        productQuantity: parseInt(productQuantity),
        bestSeller: tags === undefined ? false : tags.some((tag) => tag === "Best Seller") ? true : false,
        hotSale: tags === undefined ? 0 : tags.some((tag) => tag === "Hot Sale") ? 1 : 0,
        socialMedia,
        category
      }

      console.log(details)

      try {
        await axios.put(`${api}/product/${currentEdit._id}`, {
          ...details
        },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
          })

        setLoading(false)
        productLoading(false)
        fetchProducts()
        handleCancelEditModal()
        openNotificationWithIcon('success', 'Product', 'Product edited successfully.')

      } catch (error) {
        console.log(error.response)
        setLoading(false)
        productLoading(false)
        if (error.response !== undefined) {
          openNotificationWithIcon('error', 'Product', error.response.data.error || error.response.data.message)
        } else {
          openNotificationWithIcon('error', 'Product', 'Something went wrong.')
        }
      }

    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={{
        productName: currentEdit.productName,
        productImageUrl: currentEdit.productImageUrl,
        productDescription: currentEdit.productDescription,
        productPrice: currentEdit.productPrice,
        productQuantity: currentEdit.productQuantity
      }}
    >
      <Form.Item
        label="Name"
        name="productName"
        rules={[
          {
            required: true,
            message: 'Input required',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Image URL"
        name="productImageUrl"
        rules={[
          {
            required: true,
            message: 'Input required',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Description"
        name="productDescription"
        rules={[
          {
            required: true,
            message: 'Input required',
          },
        ]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <div className="select-holder" id="area" >

        <Form.Item
          label="Categories"
          name="category"
          rules={[
            {
              required: true,
              message: 'Input required',
            },
          ]}
        >
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            getPopupContainer={() => document.getElementById('area')}
          >
            {
              categories.map((category) => (
                <Option value={category._id} key={category._id}>
                  {category.name}
                </Option>
              ))
            }
          </Select>
        </Form.Item>
      </div>
      <Row gutter={32}>
        <Col lg={12}>
          <Row gutter={16}>
            <Col lg={12}>
              <Form.Item
                label="Price"
                name="productPrice"
                rules={[
                  {
                    required: true,
                    message: 'Input required',
                  },
                ]}
              >
                <Input type="number" min={1} />
              </Form.Item>
            </Col>
            <Col lg={12}>
              <Form.Item
                label="Quantity"
                name="productQuantity"
                rules={[
                  {
                    required: true,
                    message: 'Input required',
                  },
                ]}
              >
                <Input type="number" min={1} />
              </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col lg={12}>
          <Form.Item
            label="Tags"
            name="tags"
          >
            <Checkbox.Group onChange={(values) => {
              let newAssign = values[1] === undefined ? values[0] : values[1]
              form.setFieldsValue({
                tags: [newAssign]
              })
            }}>
              <Row>
                <Col lg={12}>
                  <Checkbox value="Best Seller">
                    Best Seller
                  </Checkbox>
                </Col>
                <Col lg={12}>
                  <Checkbox value="Hot Sale">
                    Hot Sale
                  </Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Col>
      </Row>
      <div className="contactinfo-holder">
        <span className="custom-label">
          Social Media
        </span>
        <div className="info-box">
          {
            socialMedia.map((social) => (
              <SocialMedia
                key={social._id}
                social={social}
                removeSocialMediaCard={removeSocialMediaCard}
                totalLength={socialMedia.length}
                updateSocialInfo={updateSocialInfo}
              />
            ))
          }
          <span className="addcontact" onClick={() => addSocialMediaCard()}>
            Add +
          </span>
        </div>
      </div>
      <Form.Item>
        <Button
          block
          className="submit-btn"
          htmlType="submit"
          loading={loading}
          disabled={loading}
        >
          Edit Product
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Editproduct
