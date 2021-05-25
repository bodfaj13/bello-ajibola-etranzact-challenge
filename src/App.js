import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import ProtectedRoute from './components/route/protectedroutes'
import Category from './pages/category/category';
import Homepage from './pages/homepage/homepage.js';
import Product from './pages/product/product.js';

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Homepage} />
        <ProtectedRoute exact path="/product" component={Product} />
        <ProtectedRoute exact path="/category" component={Category} />
        <Redirect path="*" to="/" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
