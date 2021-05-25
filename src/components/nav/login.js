import React, { useState } from 'react'
import { Form, Input, Button, notification } from 'antd'
import axios from 'axios'
import api from '../../config/api'

const openNotificationWithIcon = (type, msg, desc) => {
  notification[type]({
    message: msg,
    description: desc
  })
}

const Login = ({ showRegisterModal, handleCancelLoginModal, navLoading, loginUser }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const triggerShowRegisterModal = () => {
    showRegisterModal()
    handleCancelLoginModal()
  }

  const onFinish = async (values) => {
    setLoading(true)
    navLoading(true)
    try {
      const sendLogin = await axios.post(`${api}/user/login`, {
        ...values
      })
      loginUser({
        success: true,
        token: sendLogin.data.token
      })
      setLoading(false)
      navLoading(false)
      form.resetFields()
      handleCancelLoginModal()
      openNotificationWithIcon('success', 'Login Successful.')
    } catch (error) {
      setLoading(false)
      navLoading(false)
      if (error.response !== undefined) {
        openNotificationWithIcon('error', 'Login', error.response.data.error)
      } else {
        openNotificationWithIcon('error', 'Login', 'Something went wrong.')
      }
    }
  }

  const onFinishFailed = (errorInfo) => {
    openNotificationWithIcon('warning', 'Validation Error')
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
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
        Don’t have an account? &nbsp; <span className="link-text" onClick={() => triggerShowRegisterModal()}>
          Sign Up
        </span>
      </span>
    </Form>
  )
}

export default Login
