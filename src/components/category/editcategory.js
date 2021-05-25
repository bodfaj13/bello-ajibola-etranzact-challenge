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

const EditCategory = ({ handleCancelEditModal, categoryLoading, getMyCategories, currentEdit }) => {
  const [loading, setLoading] = useState(false)


  const onFinishFailed = (errorInfo) => {
    openNotificationWithIcon('warning', 'Validation Error')
  }

  const onFinish = async (values) => {
    setLoading(true)
    categoryLoading(true)
    try {
      await axios.put(`${api}/category/${currentEdit._id}`, {
        ...values
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      })

      setLoading(false)
      categoryLoading(false)
      getMyCategories()
      handleCancelEditModal()
      openNotificationWithIcon('success', 'Category', 'Category edited successfully.')

    } catch (error) {
      setLoading(false)
      categoryLoading(false)
      if (error.response !== undefined) {
        openNotificationWithIcon('error', 'Get Category', error.response.data.error || error.response.data.message)
      } else {
        openNotificationWithIcon('error', 'Category', 'Something went wrong.')
      }
    }
  }


  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      initialValues={{
        name: currentEdit.name,
        description: currentEdit.description
      }}
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
          Update Category
        </Button>
      </Form.Item>
    </Form>
  )
}

export default EditCategory
