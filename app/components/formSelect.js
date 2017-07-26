/**
 * Created by jamesbillinger on 4/18/17.
 */
import React, { Component } from 'react';
import SelectField from "material-ui/SelectField";
import MenuItem from 'material-ui/MenuItem';

export default class FormSelect extends Component {
  focus() {
    this._field && this._field.focus();
  }

  onChange(event, index, values) {
    const { input, multiple } = this.props;
    if (multiple) {
      let newValue = {};
      (values || []).map((v) => {
        newValue[v] = true;
      });
      input && input.onChange && input.onChange(newValue);
    } else {
      input && input.onChange && input.onChange(values);
    }
  }

  render() {
    const {style, type, input, meta, label, options, multiple, ...props} = this.props;
    const { value, onChange, onBlur, onFocus } = input || props;
    const { error, touched } = meta || props;
    let newStyle = Object.assign({
      margin:'0px 10px'
    }, style);
    if (props.disabled) {
      newStyle.color = 'rgba(0,0,0,0.3)';
    }
    if (multiple) {
      newStyle.width = '80%';
    }
    let myValue = value;
    if (multiple) {
      myValue = Object.keys(value || {}).map((k) => (k))
    }
    return (
      <SelectField ref={(c) => this._field = c} id='unique' style={newStyle} value={myValue}
                   multiple={multiple}
                   floatingLabelStyle={{pointerEvents: 'none', whiteSpace:'nowrap', left:'0px', color:'rgba(33, 33, 33, 0.5)'}}
                   onChange={::this.onChange} floatingLabelText={label} errorText={(touched && error) ? error : null}
                   onBlur={onBlur} onFocus={onFocus} {...props}>
        {(options || []).map((o, oi) => {
          let isObject = o && o.hasOwnProperty('value');
          let v = isObject ? o.value : o;
          let text = isObject ? o.label : o;
          return (
            <MenuItem key={oi} insetChildren={true} checked={multiple ? (myValue || []).indexOf(v) > -1 : value === v}
                      value={v} primaryText={text} />
          );
        })}
      </SelectField>
    );
  }
}