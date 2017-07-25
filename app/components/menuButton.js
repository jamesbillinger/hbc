/**
 * Created by jamesbillinger on 4/18/17.
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class MenuButton extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { style, location, hoverBackgroundColor, className, ...props } = this.props;
    let active = location.pathname === props.to;
    let newStyle = Object.assign({
      //padding:'16px 15px'
    }, style);

    return (
      <Link className={className || (active ? 'active' : '')} style={newStyle} {...props} />
    );
  }
}