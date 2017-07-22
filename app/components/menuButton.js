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

  componentDidMount() {
    this._mouseEnter = ::this.mouseEnter;
    this._mouseLeave = ::this.mouseLeave;
  }

  mouseEnter() {
    this.setState({hover:true});
  }

  mouseLeave() {
    this.setState({hover:undefined});
  }

  render() {
    const { style, location, ...props } = this.props;
    let active = location.pathname === props.to;
    const { hover } = this.state;
    let newStyle = Object.assign({
      //padding:'16px 15px'
    }, style);
    return (
      <Link className={active ? 'active' : ''} style={newStyle} {...props}
            onMouseEnter={this._mouseEnter} onMouseLeave={this._mouseLeave} />
    );
  }
}