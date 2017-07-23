import React, { Component } from 'react';
import IconButton from "material-ui/IconButton";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MaterialTheme from '../materialTheme';
import { Link } from 'react-router-dom';


export default class Icon extends Component {
  focus() { }

  render() {
    const {tooltip, style, children, onClick, onTouchTap, primary, secondary, to, href, target, iconStyle, ...props} = this.props;
    let newStyle = {
      color:'#795548',
      padding:'0px',
      width: 'unset',
      height: 'unset'
    };
    if (props.onClick || props.onTouchTap) {
      newStyle.cursor = 'pointer';
    }
    if (primary) {
      newStyle.color = getMuiTheme(MaterialTheme).baseTheme.palette.primary1Color;
    }
    if (secondary) {
      newStyle.color = getMuiTheme(MaterialTheme).baseTheme.palette.accent1Color;
    }
    Object.assign(newStyle, style);
    let newIconStyle = Object.assign({}, newStyle, iconStyle);
    delete newStyle.fontSize;
    let iconClassName = 'material-icons';
    if (props.className) {
      iconClassName += ' ' + props.className;
    }
    let button = (
      <IconButton {...props} iconClassName={iconClassName} onTouchTap={onClick || onTouchTap} style={newStyle}
                  iconStyle={newIconStyle} tooltip={tooltip}>
        {props.icon || props.glyph || children}
      </IconButton>
    );
    if (to) {
      return (
        <Link to={to}>
          {button}
        </Link>
      );
    } else if (href) {
      return (
        <a href={href} target={target || '_blank'}>
          {button}
        </a>
      );
    } else {
      return button;
    }
  }
}