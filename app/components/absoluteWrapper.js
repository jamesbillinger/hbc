/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import moment from 'moment';

export default class AbsoluteWrapper extends Component {
  render() {
    const { style, children } = this.props;
    return (
      <div style={
        Object.assign({position:'absolute', top:'0px', right:'0px', left:'0px',
                       display:'flex', flexDirection:'column', alignItems:'center',
                       minHeight:'calc(100vh - 95px)'}, style)
      }>
        {children}
        <div style={{flex:'0 0 40px', color:'#ddd', fontSize:'12px',
          display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div>Copyright Ⓒ Hays Baseball Club {moment().format('YYYY')}</div>
        </div>
      </div>
    );
  }
}