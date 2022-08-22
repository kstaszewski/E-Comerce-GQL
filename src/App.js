import React, { Component } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Client } from './GraphQl/Client';
import { GET_ALL_DATA } from './GraphQl/Queries';
import withRouter from './components/withRouter/withRouter';

import TopBar from './components/TopBar/TopBar';
import Category from './pages/Category/Category';
class App extends React.Component {
  state = {
    categoriesArray: [],
    thingsToDisplay: [],
  }

  componentDidMount() {
    Client.query({
      query: GET_ALL_DATA,
    }).then(result => {
      console.log(result);
      let fechedCategoriesArray = [];
      let fechedThingsToDisplay = [];
      result.data.categories.forEach(element => {
        fechedCategoriesArray.push(element.name.toUpperCase());
        fechedThingsToDisplay.push({category:element.name, products: element.products})
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
        <Route element={<TopBar categories={this.state.categoriesArray} />}>
          <Route index element={<Category thingsToDisplay={this.state.thingsToDisplay} />} />
          <Route path='/:category' element={<Category thingsToDisplay={this.state.thingsToDisplay} />} />
        </Route>
      </Routes>
    );
  }
}

export default withRouter(App);
