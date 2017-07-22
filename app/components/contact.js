/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';

export default class Contact extends Component {
  render() {
    const { history, location } = this.props;
    return (
      <div style={{position:'absolute', top:'0px', right:'0px', bottom:'0px', left:'0px',
                   display:'flex', justifyContent:'center'}}>
        <div style={{width:'600px', maxWidth:'100%', margin:'4vw'}}>
          <p>
            Contact Us
          </p>
          <p>
            <ul>
              <li>Jeremy Schmeidler - jbschmeidler@gmail.com</li>
              <li>Wade Ditter - wadeditter@gmail.com</li>
              <li>Luke Dreiling - lukedreiling6@hotmail.com</li>
            </ul>
          </p>
        </div>
      </div>
    );
  }
}