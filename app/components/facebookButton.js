import React, { Component } from 'react';

export default class FacebookButton extends Component {
  click() {
    const { actions, input } = this.props;
    actions.loginWithFacebook(input && input.value, (user, err) => {});
  }

  render() {
    return (
      <img src='/images/facebook.png' onClick={::this.click}  style={{width:'240px', cursor:'pointer'}} />
    );
  }
}