import React, { useState } from 'react'
import { Form, Input, Row, Col, Radio, Button, notification } from 'antd'
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'
import api from '../../config/api'

const openNotificationWithIcon = (type, msg, desc) => {
  notification[type]({
    message: msg,
    description: desc
  })
}

const ContactInfo = ({ contact, removeContactInfoCard, totalLength, updateContactInfo }) => {
  const { phoneNumber, address } = contact

  return (
    <div className="contactinfo-card">
      <Form
        initialValues={{
          phoneNumber,
          address
        }}
      >
        <Row gutter={32}>
          <Col lg={12} xs={24}>
            <Form.Item
              label="Phone Number"
              name="phoneNumber"
            >
              <Input type="tel" onChange={(e) => updateContactInfo(contact.id, e.target.value, 'phoneNumber')} />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item
              label="Address"
              name="address"
            >
              <Input onChange={(e) => updateContactInfo(contact.id, e.target.value, 'address')} />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {
        totalLength > 1 && <span className="close-btn" onClick={() => removeContactInfoCard(contact.id)}>
          x
      </span>
      }
    </div>
  )
}

const Register = ({ showLoginModal, handleCancelRegisterModal, navLoading }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [contactInfo, setContactInfo] = useState([{
    id: uuidv4(),
    phoneNumber: '',
    address: ''
  }])

  const addContactInfoCard = () => {
    setContactInfo([...contactInfo, {
      id: uuidv4(),
      phoneNumber: '',
      address: ''
    }])
  }

  const removeContactInfoCard = (key) => {
    setContactInfo(contactInfo.filter(info => info.id !== key))
  }

  const updateContactInfo = (key, value, attribute) => {
    console.log(key, value, attribute)
    let contactInfos = [...contactInfo]
    let findItem = contactInfos.findIndex((contact) => contact.id === key)
    contactInfos[findItem][attribute] = value
    setContactInfo(contactInfos)
  }

  const triggerShowLoginModal = () => {
    showLoginModal()
    handleCancelRegisterModal()
  }

  const onFinishFailed = (errorInfo) => {
    openNotificationWithIcon('warning', 'Validation Error')
  }

  const onFinish = async (values) => {
    setLoading(true)
    navLoading(true)
    const getAnyEmpty = contactInfo.some((contact) => contact.phoneNumber.trim().length === 0 || contact.address.trim().length === 0)
    if (getAnyEmpty) {
      setLoading(false)
      navLoading(false)
      openNotificationWithIcon('warning', 'Validation Error', 'No Contact Info field should be empty.')
    } else {
      try {
        await axios.post(`${api}/user/register`, {
          ...values,
          contactInfo
        })
        setLoading(false)
        navLoading(false)
        form.resetFields()
        setContactInfo([{
          id: uuidv4(),
          phoneNumber: '',
          address: ''
        }])
        handleCancelRegisterModal()
        openNotificationWithIcon('success', 'Registation Successful.')
      } catch (error) {
        setLoading(false)
        navLoading(false)
        if (error.response !== undefined) {
          openNotificationWithIcon('error', 'Registation', error.response.data.error)
        } else {
          openNotificationWithIcon('error', 'Registation', 'Something went wrong.')
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
    >
      <Form.Item
        label="Full Name"
        name="name"
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
        label="Email"
        name="email"
        rules={[
          {
            type: 'email',
            message: 'The input is not valid email',
          },
          {
            required: true,
            message: 'Input required',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Row gutter={32}>
        <Col lg={12}>
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: 'Input required',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col lg={12}>
          <Form.Item
            label="Gender"
            name="gender"
            rules={[
              {
                required: true,
                message: 'Input required',
              },
            ]}
          >
            <Radio.Group>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Input required',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <div className="contactinfo-holder">
        <span className="custom-label">
          Contact Info
        </span>
        <div className="info-box">
          {
            contactInfo.map((contact) => (
              <ContactInfo
                key={contact.id}
                contact={contact}
                removeContactInfoCard={removeContactInfoCard}
                totalLength={contactInfo.length}
                updateContactInfo={updateContactInfo}
              />
            ))
          }
          <span className="addcontact" onClick={() => addContactInfoCard()}>
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
          Create Account
        </Button>
      </Form.Item>
      <span className="switch-text">
        Already have an account? &nbsp; <span className="link-text" onClick={() => triggerShowLoginModal()}>
          Login
        </span>
      </span>
    </Form>
  )
}

export default Register
