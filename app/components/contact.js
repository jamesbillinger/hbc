/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';

const coaches = [
  {
    name: 'Jeremy Schmeidler',
    ageGroup: '8U',
    phone: '',
    email: 'jbschmeidler@gmail.com'
  }, {
    name: 'Wade Ditter',
    ageGroup: '9U',
    phone: '',
    email: 'wadeditter@gmail.com'
  }, {
    name: 'Luke Dreiling',
    ageGroup: '10U',
    phone: '',
    email: 'lukedreiling6@hotmail.com'
  }
];

export default class Contact extends Component {
  render() {
    const { history, location } = this.props;
    return (
      <div style={{position:'absolute', top:'0px', right:'0px', bottom:'0px', left:'0px',
                   display:'flex', justifyContent:'center'}}>
        <div style={{width:'600px', maxWidth:'100%', margin:'4vw'}}>
          <p>
            Our coaches are available to answer questions or assist with registration.<br />Email is preferred.  Thanks!
          </p>
          <div style={{display:'flex', flexWrap:'wrap'}}>
            {coaches.map((c) =>
              <Paper key={c.email} style={{margin:'10px', padding:'25px'}}>
                <div>{c.name} - {c.ageGroup}</div>
                <div>{c.email}</div>
              </Paper>
            )}
          </div>
        </div>
      </div>
    );
  }
}