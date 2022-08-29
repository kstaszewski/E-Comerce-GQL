import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import './App.css';
import withRouter from './components/withRouter/withRouter';

import TopBar from './components/TopBar/TopBar';
import Category from './pages/Category/Category';
import Product from './pages/Product/Product';
import Cart from './pages/Cart/Cart';
class App extends React.Component {
  state = {
    chosenCurrency: {},
    cart: localStorage.getItem("cart") || [],
  };


  componentDidUpdate (prevProps, prevState) {
    if (JSON.stringify(this.state.cart) !== localStorage.getItem("cart")) {
      this.setState({cart: JSON.parse(localStorage.getItem('cart'))});
    }

  }

  render () {


    return (
      <Routes>
        <Route element={<TopBar
          currencyChange={(e) => this.setState({chosenCurrency: e})}
          cart={this.state.cart} />}>

          <Route index element={<Navigate to={`/all`} />} />

          <Route path='/:category' element={<Category
            currencyToCategory={this.state.chosenCurrency}
            forceUpdate={() => this.forceUpdate()}
          />}
          />

          <Route path='/product/:id' element={<Product
            currencyToProduct={this.state.chosenCurrency}
            forceUpdate={() => this.forceUpdate()}
          />}
          />

          <Route path='/cart' element={<Cart
            cart={this.state.cart}
          />}
          />
        </Route>
      </Routes>
    );
  }
}

export default withRouter(App);
