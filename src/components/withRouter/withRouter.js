import React, {Component} from "react";
import {useParams} from 'react-router-dom';

export default function withRouter(Component) {
    function ComponentWithRouter(props) {
      let params = useParams()
      return <Component {...props} params={params} />
    }
    return ComponentWithRouter
  }