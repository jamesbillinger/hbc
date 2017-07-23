/**
 * Created by jamesbillinger on 4/18/17.
 */
import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';

export default class Button extends Component {
  render() {
    const { onClick, ...props } = this.props;
    return <FlatButton onTouchTap={onClick} {...props} />;
  }
}