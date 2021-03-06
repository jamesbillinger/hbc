import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import FormInput from './formInput';
import UserForm from './userForm';
import qs from 'query-string';
import AbsoluteWrapper from 'components/absoluteWrapper';

class LabelledText extends Component {
  render() {
    const { label, value } = this.props;
    return (
      <div style={{marginTop:'10px'}}>
        <div style={{fontSize:'0.9em', color:'#bbb'}}>{label}</div>
        <div>{value}</div>
      </div>
    )
  }
}

class Profile extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    const { hbc, actions } = this.props;
    if (!hbc.players) {
      actions.fetchPlayers();
    }
  }

  resend() {
    const { actions, hbc } = this.props;
    actions.resendEmailVerification(hbc.user, (err) => {
      this.setState({sent: true});
    });
  }

  render() {
    const { hbc, history, location } = this.props;
    const { sent } = this.state;
    let oobCode = false;
    let query = qs.parse(location.search);
    if (hbc.user && query && query.oobCode) {
      oobCode = true;
    }
    return (
      <AbsoluteWrapper>
        <div style={{width:'100%', flex:'1 0 auto'}}>
          {!oobCode && (hbc.user.emailVerified
            ? <UserForm initialValues={hbc.user} title='My Profile' form={'UserForm_' + hbc.user.uid} history={history}/>
            : <div style={{display:'flex', justifyContent:'center'}}>
                <div style={{maxWidth:'400px'}}>
                  {!sent &&
                    <div style={{color:'rgba(0,0,0,0.7)'}}>
                      You should have received an email from Hays Baseball Club.
                      Please verify your account by clicking on the link provided in the email.
                    </div>
                  }
                  {!sent &&
                    <div style={{display:'flex', justifyContent:'center', marginTop:'30px'}}>
                      <div onClick={::this.resend} className='dashboardButton'
                           style={{padding:'16px 25px', border:'none', borderRadius:'30px', color:'white', cursor:'pointer'}}>
                        Resend Verification Email
                      </div>
                    </div>
                  }
                  {sent &&
                    <div style={{color:'rgba(0,0,0,0.7)'}}>
                      The email has been resent.  Please click on the link in the email to verify your account.
                    </div>
                  }
                </div>
              </div>
          )}
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
)(Profile);