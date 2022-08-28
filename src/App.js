import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import withRouter from './components/withRouter/withRouter';

import TopBar from './components/TopBar/TopBar';
import Category from './pages/Category/Category';
import Product from './pages/Product/Product';
class App extends React.Component {
  state = {
    chosenCurrency: {},
  }

  render() {
    return (
      <Routes>
        <Route element={<TopBar
          currencyChange={(e) => this.setState({ chosenCurrency: e })} />}>

          <Route index element={<Navigate to={`/all`} />} />

          <Route path='/:category' element={<Category
            currencyToCategory={this.state.chosenCurrency}
          />}
          />

          <Route path='/product/:id' element={<Product />}
          />

        </Route>
      </Routes>
    );
  }
}

export default withRouter(App);
