import React, { useState, useEffect } from 'react'
import Nav from '../../components/nav/nav'
import { Modal, Select, Button, Table, notification, Tooltip } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Addproduct from '../../components/product/addproduct';
import axios from 'axios';
import api from '../../config/api';
import useCategory from '../../components/cusomhooks/usecategory'
import Editproduct from '../../components/product/editproduct';
import numeral from 'numeral'

const { confirm } = Modal;

const openNotificationWithIcon = (type, msg, desc) => {
  notification[type]({
    message: msg,
    description: desc
  })
}

const { Option } = Select;

const Product = () => {
  const [currentlyViewing, setCurrentlyViewing] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [currentEdit, setCurrentEdit] = useState(null)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const { categories, fetchCategories } = useCategory()

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    // eslint-disable-next-line
  }, [])


  const fetchProducts = async () => {
    setLoading(true)
    try {
      const getProducts = await axios.get(`${api}/product`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      })
      setProducts(getProducts.data.data)
      setCurrentlyViewing(getProducts.data.data)
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

  const deleteProduct = async (id) => {
    setLoading(true)
    try {
      await axios.delete(`${api}/product/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      })

      setLoading(false)
      fetchProducts()
      openNotificationWithIcon('success', 'Product', 'Product deleted successfully.')

    } catch (error) {
      setLoading(false)
      if (error.response !== undefined) {
        openNotificationWithIcon('error', 'Product', error.response.data.error || error.response.data.message)
      } else {
        openNotificationWithIcon('error', 'Product', 'Something went wrong.')
      }
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Description',
      dataIndex: 'productDescription',
      key: 'productDescription',
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <Tooltip placement="bottomLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'productPrice',
      key: 'productPrice',
      render: (text) => (
        <span>
          ₦ {numeral(text).format('0,0')}
        </span>
      )
    },
    {
      title: 'Quantity',
      dataIndex: 'productQuantity',
      key: 'productQuantity',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <div className="action-holder">
          <Button className="action-btn edit"
            loading={loading}
            disabled={loading}
            onClick={() => showEditModal(record)}
          >
            Edit
            </Button>
          <Button className="action-btn delete"
            loading={loading}
            disabled={loading}
            onClick={() => showConfirmDelete(record._id)}
          >
            Delete
          </Button>
        </div>
      )
    },
  ]

  const showAddModal = () => {
    setShowModal(true)
    setShowAdd(true)
  };


  const showEditModal = (currentEdit) => {
    setShowModal(true)
    setShowEdit(true)
    setCurrentEdit(currentEdit)
  };


  const closeModal = () => {
    setShowModal(false)
    if (!loading) {
      if (showAdd) {
        setShowAdd(false)
      }
      if (showEdit) {
        setShowEdit(false)
        setCurrentEdit(null)
      }
    }
  }

  const runFilter = (value) => {
    if (value === "name") {
      let sorted = [...currentlyViewing].sort((a, b) => a.productName.toLowerCase().localeCompare(b.productName.toLowerCase()))
      setCurrentlyViewing(sorted)
    } else if (value === "date") {
      let sorted = [...currentlyViewing].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      setCurrentlyViewing(sorted)
    } else {
      setCurrentlyViewing(products)
    }
  }

  const showConfirmDelete = (id) => {
    confirm({
      title: 'Are you sure delete this product?',
      icon: <ExclamationCircleOutlined />,
      content: 'Click on No or Yes to proceed.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteProduct(id)
      }
    })
  }


  return (
    <div className="product">
      <Nav
        linkTo="/product"
      />
      <div className="product-main">
        <div className="top-holder">
          <h1 className="title">
            Manage Products
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
              <Option value="date">Date</Option>
              <Option value="name">Name</Option>
            </Select>
            <Button className="add-btn" onClick={() => showAddModal()}>
              Add New Product
            </Button>
          </div>
        </div>

        <div className="table-holder">
          <Table
            size="small"
            loading={loading}
            rowKey={record => record._id}
            columns={columns}
            dataSource={currentlyViewing}
            scroll={{ x: 1300 }}
            pagination={{
              showTotal: (total, range) => <span className="custom-total-text">
                {`Showing results ${range[0]} - ${range[1]} of ${total}`}
              </span>
            }}
          />
        </div>

        <Modal
          title={null}
          visible={showModal}
          onOk={closeModal}
          onCancel={closeModal}
          footer={null}
          className="custom-modal"
        >
          <h1 className="title">
            {showAdd && 'Create New Product'}
            {showEdit && 'Edit Product'}
          </h1>

          <div className="addproduct-modal-main">
            {
              showAdd && <Addproduct
                handleCancelAddModal={closeModal}
                productLoading={setLoading}
                categories={categories}
                fetchProducts={fetchProducts}
              />
            }
            {
              currentEdit && showEdit &&
              <Editproduct
                handleCancelEditModal={closeModal}
                productLoading={setLoading}
                categories={categories}
                fetchProducts={fetchProducts}
                currentEdit={currentEdit}
              />
            }
          </div>

        </Modal>

      </div>
    </div>
  )
}

export default Product
