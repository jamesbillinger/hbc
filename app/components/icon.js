import React, { Component } from 'react';
import IconButton from "material-ui/IconButton";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MaterialTheme from '../materialTheme';
import { Link } from 'react-router-dom';


export default class Icon extends Component {
  focus() { }

  render() {
    const {tooltip, style, children, onClick, onTouchTap, primary, secondary, to, href, target, iconStyle, className, ...props} = this.props;

    let newIconStyle = Object.assign({}, iconStyle);
    if (style && style.fontSize) {
      newIconStyle.fontSize = style.fontSize;
      delete style.fontSize;
    }
    if (primary) {
      newIconStyle.color = getMuiTheme(MaterialTheme).baseTheme.palette.primary1Color;
    } else if (secondary) {
      newIconStyle.color = getMuiTheme(MaterialTheme).baseTheme.palette.accent1Color;
    } else if (!className) {
      newIconStyle.color = '#795548';
    } else {
      newIconStyle.color = undefined;
    }

    let iconClassName = 'material-icons';
    if (className) {
      iconClassName += ' ' + className;
    }

    let newStyle = {
      padding:'0px',
      width: 'unset',
      height: 'unset'
    };
    if (props.onClick || props.onTouchTap) {
      newStyle.cursor = 'pointer';
    }
    Object.assign(newStyle, style);

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