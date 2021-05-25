import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Modal, Dropdown, Menu } from 'antd'
import Register from './register'
import Login from './login'
import { loginUser, logoutUser } from '../../core/actions/userActions'
import { useHistory } from "react-router-dom";
import SlidingPane from "react-sliding-pane";
import "react-sliding-pane/dist/react-sliding-pane.css";

export const Nav = ({ user, loginUser, logoutUser, linkTo }) => {
  const history = useHistory()

  const [mobileToggleIcon, setMobileToggleIcon] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showLogin, setshowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  // eslint-disable-next-line
  const [navLinks, setNavLinks] = useState([
    {
      name: 'PRODUCT',
      route: '/product'
    },
    {
      name: 'CATEGORY',
      route: '/category'
    }
  ])

  useEffect(() => {
    setMobileToggleIcon(false)
  }, [user])

  const toggleMobileIcon = () => {
    setMobileToggleIcon(!mobileToggleIcon)
  }

  const showLoginModal = () => {
    setshowLogin(true);
  };

  const handleCancelLoginModal = () => {
    if (!loading) {
      setshowLogin(false);
    }
  };

  const showRegisterModal = () => {
    setShowRegister(true);
  };

  const handleCancelRegisterModal = () => {
    if (!loading) {
      setShowRegister(false);
    }
  };

  const logOut = () => {
    logoutUser()
    history.push('/')
  }

  const dashMenu = (
    <Menu>
      <Menu.Item>
        <span onClick={() => logOut()}>
          Logout
        </span>
      </Menu.Item>
    </Menu>
  )

  return (
    <div className="nav">
      <div className="logo-holder">
        <a href="/">
          <img src="/images/Etranzact_Logo.svg" alt="logo" />
        </a>
      </div>
      <div className="nav-actions">
        <div className="actions-and-links">
          {
            user.token === null ?
              <>
                <Button
                  className="nav-btn"
                  onClick={() => showLoginModal()}
                >
                  LOGIN
                </Button>
                <Button
                  className="nav-btn"
                  onClick={() => showRegisterModal()}>
                  REGISTER
                </Button>
              </>
              :
              <>
                {
                  navLinks.map((navLink) => (
                    <a href={navLink.route} className={`nav-link ${navLink.route === linkTo ? 'active' : ''}`} key={navLink.name}>
                      {navLink.name}
                    </a>
                  ))
                }
                <div className="user-avatar">
                  <Dropdown
                    overlay={dashMenu} className="others-item" placement="bottomCenter"
                    trigger={['click']}
                  >
                    <img src="/images/avatar.svg" alt="" />
                  </Dropdown>
                </div>
              </>
          }
        </div>
        <div
          className={`nav-mobile ${mobileToggleIcon ? 'change' : ''}`}
          onClick={toggleMobileIcon}
        >
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
        </div>
      </div>
      <SlidingPane
        className="some-custom-class"
        overlayClassName="some-custom-overlay-class"
        isOpen={mobileToggleIcon}
        onRequestClose={() => {
          toggleMobileIcon()
        }}
      >
        <div className="actions-and-links">
          {
            user.token === null ?
              <>
                <Button
                  className="nav-btn"
                  onClick={() => showLoginModal()}
                >
                  LOGIN
                </Button>
                <Button
                  className="nav-btn"
                  onClick={() => showRegisterModal()}>
                  REGISTER
                </Button>
              </>
              :
              <>
                {
                  navLinks.map((navLink) => (
                    <a href={navLink.route} className={`nav-link ${navLink.route === linkTo ? 'active' : ''}`} key={navLink.name}>
                      {navLink.name}
                    </a>
                  ))
                }
                <div className="user-avatar">
                  <Dropdown
                    overlay={dashMenu} className="others-item" placement="bottomCenter"
                    trigger={['click']}
                  >
                    <img src="/images/avatar.svg" alt="" />
                  </Dropdown>
                </div>
              </>
          }
        </div>
      </SlidingPane>
      <Modal
        title={null}
        visible={showRegister}
        onOk={handleCancelRegisterModal}
        onCancel={handleCancelRegisterModal}
        footer={null}
        className="custom-modal"
      >
        <h1 className="title with-foot-note">
          eTranzact eCommerce
        </h1>
        <p className="footnote">
          Create an account to list your own products
          </p>

        <div className="register-modal-main">
          <Register
            showLoginModal={showLoginModal}
            handleCancelRegisterModal={handleCancelRegisterModal}
            navLoading={setLoading}
          />
        </div>
      </Modal>
      <Modal
        title={null}
        visible={showLogin}
        onOk={handleCancelLoginModal}
        onCancel={handleCancelLoginModal}
        footer={null}
        className="custom-modal"
      >
        <h1 className="title with-foot-note">
          eTranzact eCommerce
        </h1>
        <p className="footnote">
          Create an account to list your own products
          </p>

        <div className="register-modal-main">
          <Login
            showRegisterModal={showRegisterModal}
            handleCancelLoginModal={handleCancelLoginModal}
            navLoading={setLoading}
            loginUser={loginUser}
          />
        </div>
      </Modal>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.userReducer
})

const mapDispatchToProps = {
  loginUser, logoutUser
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav)
