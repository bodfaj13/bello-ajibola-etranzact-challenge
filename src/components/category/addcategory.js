import React, { useState } from 'react'
import { Form, Input, Button, notification } from 'antd'
import axios from 'axios';
import api from '../../config/api';

const openNotificationWithIcon = (type, msg, desc) => {
  notification[type]({
    message: msg,
    description: desc
  })
}

const AddCategory = ({ handleCancelAddModal, categoryLoading, getMyCategories }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)


  const onFinishFailed = (errorInfo) => {
    openNotificationWithIcon('warning', 'Validation Error')
  }

  const onFinish = async (values) => {
    setLoading(true)
    categoryLoading(true)
    try {
      
      await axios.post(`${api}/category`, {
        ...values
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      })

      setLoading(false)
      categoryLoading(false)
      getMyCategories()
      form.resetFields()
      handleCancelAddModal()
      openNotificationWithIcon('success', 'Category', 'Category created successfully.')

    } catch (error) {
      setLoading(false)
      categoryLoading(false)
      if (error.response !== undefined) {
        openNotificationWithIcon('error', 'Get Category', error.response.data.error || error.response.data.message)
      } else {
        openNotificationWithIcon('error', 'Lpgin Faild', 'Something went wrong.')
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
        label="Name"
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
        label="Description"
        name="description"
        rules={[
          {
            required: true,
            message: 'Input required',
          },
        ]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item>
        <Button
          block
          className="submit-btn"
          htmlType="submit"
          loading={loading}
          disabled={loading}
        >
          Create Category
        </Button>
      </Form.Item>
    </Form>
  )
}

export default AddCategory
