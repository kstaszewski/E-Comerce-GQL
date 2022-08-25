import React, { Component } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { Client } from './GraphQl/Client';
import { GET_BEGINING_DATA } from './GraphQl/Queries';
import withRouter from './components/withRouter/withRouter';

import TopBar from './components/TopBar/TopBar';
import Category from './pages/Category/Category';
import Product from './pages/Product/Product';
class App extends React.Component {
  state = {
    categoriesArray: [],
    thingsToDisplay: [],
    chosenCurrency: {},
  }

  componentDidMount() {
    Client.query({
      query: GET_BEGINING_DATA,
    }).then(result => {
      console.log(result);
      let fechedCategoriesArray = [];
      let fechedThingsToDisplay = [];
      result.data.categories.forEach(element => {
        fechedCategoriesArray.push(element.name.toUpperCase());
        fechedThingsToDisplay.push({ category: element.name, products: element.products })
      });
      this.setState({
        categoriesArray: fechedCategoriesArray,
        thingsToDisplay: fechedThingsToDisplay,
      });
    })
  }

  render() {
    return (
      <Routes>
        <Route element={<TopBar categories={this.state.categoriesArray} currencyChange={(e) => this.setState({ chosenCurrency: e })} />}>
          <Route index element={<Navigate to={`/all`} />} />
          <Route path='/:category' element={<Category thingsToDisplay={this.state.thingsToDisplay} currencyToCategory={this.state.chosenCurrency} />} />
          <Route path='/product/:id' element={<Product />} />
        </Route>
      </Routes>
    );
  }
}

export default withRouter(App);
