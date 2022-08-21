import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Client } from './GraphQl/Client';
import { GET_ALL_DATA } from './GraphQl/Queries';

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
      let array = [];
      result.data.categories.forEach(element => {
        array.push(element.name.toUpperCase());
      });
      this.setState({
        categoriesArray: array,
      });
    })
  }

  changeActiveCategory = (category) => {

  }

  render() {
    return (
      <Routes>
        <Route element={<TopBar categories={this.state.categoriesArray} changeActiveCategory={e => this.changeActiveCategory(e)} />}>
          <Route index element={<Category thingsToDisplay={this.state.thingsToDisplay} />} />

        </Route>
      </Routes>
    );
  }
}

export default App;
