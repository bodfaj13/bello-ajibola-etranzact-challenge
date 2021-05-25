import { useState } from 'react'
import axios from 'axios'
import api from '../../config/api'
import { notification } from 'antd'

const openNotificationWithIcon = (type, msg, desc) => {
  notification[type]({
    message: msg,
    description: desc
  })
}

const useCategory = () => {
  const [categories, setCategories] = useState([])

  const fetchCategories = async () => {
    try {
      const getCategories = await axios.get(`${api}/category`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      })
      setCategories(getCategories.data.data)
    } catch (error) {
      if (error.response !== undefined) {
        openNotificationWithIcon('error', 'Get Category', error.response.data.error ||  error.response.data.message)
      } else {
        openNotificationWithIcon('error', 'Get Category', 'Something went wrong.')
      }
    }
  }

  return { categories, fetchCategories }

}

export default useCategory


