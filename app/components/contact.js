/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Logo from 'components/logo';

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
        <div style={{width:'600px', maxWidth:'100%'}}>
          <div style={{paddingBottom:'20px', height:'60px', display:'flex', flexDirection:'column', width:'100%'}}>
            <Logo text='Contact' />
          </div>
          <p style={{fontSize:'16px', paddingLeft:'10px', lineHeight:'1.5em', color:'rgba(0,0,0,0.8)', animationDelay:'0.5s'}}
             className='content'>
            Our coaches are available to answer questions or assist with registration.<br />Email is preferred.  Thanks!
          </p>
          <div style={{display:'flex', flexWrap:'wrap', animationDelay:'0.7s', justifyContent:'space-between'}}
               className='content'>
            {coaches.map((c) =>
              <Paper key={c.email} style={{margin:'10px', padding:'25px'}}>
                <h3 style={{margin:'0px', color:'#689F38'}}>{c.name} ({c.ageGroup})</h3>
                <a href={'mailto:' + c.email} style={{marginTop:'5px'}}>{c.email}</a>
              </Paper>
            )}
          </div>
        </div>
      </div>
    );
  }
}