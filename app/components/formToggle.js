/**
 * Created by jamesbillinger on 4/18/17.
 */
import React, { Component } from 'react';
import Toggle from "material-ui/Toggle";

export default class FormToggle extends Component {
  render() {
    const {style, type, input, meta, label, ...props} = this.props;
    const { value, onChange, onBlur, onFocus } = input || props;
    const { error, touched } = meta || props;
    let newStyle = Object.assign({
      margin:'10px 10px 0px 10px',
      verticalAlign:'top',
      fontWeight:'normal',
      display:'block',
      width:'256px'
    }, style);
    if (props.disabled) {
      newStyle.color = 'rgba(0,0,0,0.3)';
    }
    return (
      <Toggle ref={(c) => this._field = c} style={newStyle} toggled={!!value}
              labelStyle={{pointerEvents: 'none', color:'rgba(33, 33, 33, 0.5)', fontSize:'13px'}}
              onToggle={onChange} label={label} {...props} />
    );
  }
}