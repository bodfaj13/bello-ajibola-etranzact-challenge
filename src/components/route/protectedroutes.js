import React from 'react'
import { connect } from 'react-redux'
import {
  Redirect,
  Route
} from "react-router-dom";
import { notification } from 'antd'

const openNotificationWithIcon = (type, msg, desc) => {
  notification[type]({
    message: msg,
    description: desc
  })
}

export const Protectedroutes = ({ user, component: Component, ...rest }) => {
  return (
    <Route {...rest}
      render={props => {
        if (user.token) {
          return <Component {...rest} {...props} />
        } else {
          openNotificationWithIcon('warning', 'Access Denied', 'Login to continue.')
          return <Redirect to={{
            pathname: '/',
            state: {
              from: props.location
            }
          }} />
        }
      }}
    />
  )
}

const mapStateToProps = (state) => ({
  user: state.userReducer
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Protectedroutes)
