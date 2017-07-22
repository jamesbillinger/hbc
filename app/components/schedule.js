/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';

export default class Contact extends Component {
  render() {
    const { history, location } = this.props;
    return (
      <div style={{flex:'1 1 auto', width:'100%', display:'flex'}}>
        Schedule
      </div>
    );
  }
}