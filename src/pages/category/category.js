import React, { useState, useEffect } from 'react'
import Nav from '../../components/nav/nav'
import { Modal, Select, Button, Table, notification, Tooltip } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import AddCategory from '../../components/category/addcategory';
import EditCategory from '../../components/category/editcategory';
import useCategory from '../../components/cusomhooks/usecategory'
import axios from 'axios';
import api from '../../config/api';

const { confirm } = Modal;

const openNotificationWithIcon = (type, msg, desc) => {
  notification[type]({
    message: msg,
    description: desc
  })
}

const { Option } = Select;

const Category = () => {
  const [currentlyViewing, setCurrentlyViewing] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [currentEdit, setCurrentEdit] = useState(null)
  const [loading, setLoading] = useState(false)
  const { categories, fetchCategories } = useCategory()

  useEffect(() => {
    getMyCategories()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    setCurrentlyViewing(categories)
  }, [categories])

  const getMyCategories = () => {
    setLoading(true)
    fetchCategories()
    setTimeout(() => {
      setLoading(false)
    }, 500);
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
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
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <div className="action-holder">
          <Button className="action-btn edit"
            disabled={loading}
            onClick={() => showEditModal(record)}
          >
            Edit
            </Button>
          <Button className="action-btn delete"
            disabled={loading} onClick={() => showConfirmDelete(record._id)}>
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

  const deleteCategory = async (id) => {
    setLoading(true)
    try {
      await axios.delete(`${api}/category/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
      })

      setLoading(false)
      getMyCategories()
      openNotificationWithIcon('success', 'Category', 'Category deleted successfully.')

    } catch (error) {
      setLoading(false)
      if (error.response !== undefined) {
        openNotificationWithIcon('error', 'Category', error.response.data.error || error.response.data.message)
      } else {
        openNotificationWithIcon('error', 'Category', 'Something went wrong.')
      }
    }
  }

  const runFilter = (value) => {
    if (value === "name") {
      let sorted = [...currentlyViewing].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
      setCurrentlyViewing(sorted)
    } else {
      setCurrentlyViewing(categories)
    }
  }

  const showConfirmDelete = (id) => {
    confirm({
      title: 'Are you sure delete this category?',
      icon: <ExclamationCircleOutlined />,
      content: 'Click on No or Yes to proceed.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteCategory(id)
      }
    })
  }

  return (
    <div className="category">
      <Nav
        linkTo="/category"
      />
      <div className="category-main">
        <div className="top-holder">
          <h1 className="title">
            Manage Categories
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
            <Button className="add-btn" onClick={() => showAddModal()}>
              Add New Category
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
            {showAdd && 'Create New Category'}
            {showEdit && 'Edit Category'}
          </h1>

          <div className="addproduct-modal-main">
            {
              showAdd &&
              <AddCategory
                handleCancelAddModal={closeModal}
                categoryLoading={setLoading}
                getMyCategories={getMyCategories}
              />
            }

            {
              currentEdit && showEdit && <EditCategory
                handleCancelEditModal={closeModal}
                categoryLoading={setLoading}
                getMyCategories={getMyCategories}
                currentEdit={currentEdit}
              />
            }
          </div>

        </Modal>


      </div>
    </div>
  )
}

export default Category
