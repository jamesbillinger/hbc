/**
 * Created by jamesbillinger on 4/18/17.
 */
import React, { Component } from 'react';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';

export default class FormDate extends Component {
  componentWillMount() {
    this._onChange = ::this.onChange;
  }
  
  focus() {
    this._field && this._field.focus();
  }

  onChange(e, date) {
    const { input } = this.props;
    const { onChange, value } = input;
    let newDate = moment(date);
    if (date && !value) {
      let m = moment();
      newDate.hours(m.hours());
      newDate.minutes(m.minutes());
      newDate.seconds(m.seconds());
    } else if (value && newDate.seconds() === 0 && newDate.minutes() === 0 && newDate.hours() === 0) {
      let m = moment(value);
      newDate.hours(m.hours());
      newDate.minutes(m.minutes());
      newDate.seconds(m.seconds());
    }
    onChange && onChange(newDate.valueOf());
  }

  render() {
    const { style, type, input, meta, label, defaultDate, id='datePicker', time, ...props } = this.props;
    const { value, onChange, onBlur, onFocus } = input || props;
    const { error, touched } = meta || props;
    let newStyle = Object.assign({
      margin:'0px 10px',
      fontWeight:'normal'
    }, style);
    let newTextFieldStyle = {};
    if (time) {
      newTextFieldStyle.width = '100%';
    }
    if (props.disabled) {
      newStyle.color = 'rgba(0,0,0,0.3)';
      newTextFieldStyle.width = '100px';
    }
    if (props.multiLine) {
      newStyle.width = '80%';
    }
    let myValue;
    if (value) {
      myValue = moment(value)
    } else if (defaultDate) {
      myValue = moment(defaultDate);
    }
    Object.assign(newStyle, style);
    Object.assign(newTextFieldStyle, style);
    return (
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
        <DatePicker ref={(c) => this._field = c} style={newStyle} value={myValue && myValue._d} autoOk={true} id={id}
                    floatingLabelStyle={{pointerEvents: 'none', whiteSpace:'nowrap', left:'0px', color:'rgba(33, 33, 33, 0.5)'}}
                    onChange={this._onChange} floatingLabelText={label} errorText={(touched && error) ? error : null}
                    formatDate={(dt) => (moment(dt).format('MMM D, YYYY'))} firstDayOfWeek={0} mode='landscape'
                    onBlur={onBlur} onFocus={onFocus} {...props} />
        {time &&
          <TimePicker id='timePicker' textFieldStyle={newTextFieldStyle} style={{flex:'1 1 auto'}}
                      autoOk={true} onChange={this._onChange} value={myValue && myValue._d}
                      errorText={(meta.touched && meta.error) ? meta.error : null} />
        }
      </div>
    );
  }
}