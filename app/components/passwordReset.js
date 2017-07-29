/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { Link } from 'react-router-dom';

class PasswordReset extends Component {
  render () {
    return (
      <div style={{position:'absolute', top:'0px', right:'0px', bottom:'0px', left:'0px',
                   display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
        <div style={{fontSize:'16px', color:'#bbb'}} className='content'>
          Your password has been reset.  Please Check your email for a link to create your new password.
        </div>
        <div style={{marginTop:'30px'}}>
          <Link to='/' className='dashboardButton'
                style={{padding:'16px 32px', border:'none', borderRadius:'30px', color:'white', cursor:'pointer',zIndex:'2'}}>
            Return Home
          </Link>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    hbc: state.hbc
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
)(PasswordReset)