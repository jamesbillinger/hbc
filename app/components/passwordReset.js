/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { Link } from 'react-router-dom';
import AbsoluteWrapper from 'components/absoluteWrapper';

class PasswordReset extends Component {
  render () {
    return (
      <AbsoluteWrapper>
        <div style={{fontSize:'16px', color:'#bbb'}} className='content'>
          Your password has been reset.  Please Check your email for a link to create your new password.
        </div>
        <div style={{marginTop:'30px'}}>
          <Link to='/' className='dashboardButton'
                style={{padding:'16px 32px', border:'none', borderRadius:'30px', color:'white', cursor:'pointer',zIndex:'2'}}>
            Return Home
          </Link>
        </div>
      </AbsoluteWrapper>
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