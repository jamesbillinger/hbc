/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
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

class Contact extends Component {
  componentDidMount() {
    const { actions, contacts } = this.props;
    if (!contacts) {
      actions.fetchContacts();
    }
  }

  render() {
    const { contacts, user } = this.props;
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
            {Object.keys(contacts || {}).map((k) => {
              let c = contacts[k];
              return (
                <a key={c.email} href={'mailto:' + c.email} style={{marginTop: '5px'}}>
                  <Paper key={c.email} style={{margin: '10px', padding: '25px'}} className='hoverPaper'>
                    <h3 style={{margin: '0px', color: '#689F38'}}>
                      {c.teams.map((t) => (t.name + ' (' + t.ageGroup + ')')).join(', ')}
                    </h3>
                    <div style={{fontSize:'16px', color:'#555', marginTop:'8px'}}>
                      {c.name}
                    </div>
                    {user && c.phone &&
                      <div style={{color:'#999', marginTop:'5px'}}>{c.phone}</div>
                    }
                    <div style={{marginTop: '7px', color:'#999'}}>{c.email}</div>
                  </Paper>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    contacts: state.hbc.contacts,
    user: state.hbc.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({...Actions}, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Contact);