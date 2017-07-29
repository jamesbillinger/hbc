/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import FormInput from 'components/formInput';
import Button from 'components/button';
import { required, email } from '../validators';
import Logo from 'components/logo';
import { Link } from 'react-router-dom';
import qs from 'query-string';

class GoogleButton extends Component {
  click() {
    const { actions, input } = this.props;
    actions.loginWithGoogle(input && input.value, (user, err) => {});
  }

  render() {
    return (
      <div className='registerButton' onClick={::this.click}
           style={{padding:'16px 30px', borderRadius:'30px', color:'#000', width:'100%', alignItems:'center',
             fontSize:'16px', cursor:'pointer', display:'flex', justifyContent:'center'}}>
        <img src='images/google.svg' height='20px' width='20px' />
        <div style={{paddingLeft:'10px'}}>Sign in with Google</div>
      </div>
    );
  }
}

class Login extends Component {
  constructor() {
    super();
  }

  componentWillMount() {
    this._submit = ::this.submit;
  }

  componentDidMount() {
    const { hbc, change } = this.props;
    if (hbc.authEmail) {
      change('email',hbc.authEmail);
    }
  }

  submit(data) {
    const { actions, location } = this.props;
    return new Promise((resolve, revoke) => {
      actions.login(data.email, data.password, (user, err) => {
        if (err) {
          throw new SubmissionError({password:err.message});
          revoke(err);
        } else {
          let query = qs.parse(location.search);
          if (query && query.oobCode) {
            actions.applyActionCode(user.uid, location.search.mode, location.search.oobCode, () => {
              resolve(user);
            })
          } else {
            resolve(user);
          }
        }
      });
    });
  }

  render () {
    const { handleSubmit, pristine, submitting, valid, hbc, actions, history } = this.props;
    return (
      <div style={{position:'absolute', top:'0px', right:'0px', bottom:'0px', left:'0px',
                   display:'flex', justifyContent:'center', alignItems:'center'}}>
        <form onSubmit={handleSubmit(this._submit)}>
          <div style={{display:'flex', justifyContent:'center', width:'100%'}}>
            <div style={{height:'30px', width:'100%', maxWidth:'600px', display:'flex', flexDirection:'column',
                         marginBottom:'10px'}}>
              <Logo text='Login' large={true} />
            </div>
          </div>
          <div>
            <Field component={FormInput} name='email' label='Email Address' autoFocus={true}
                   validate={[required, email]} style={{width:'300px'}} />
            <Field component={FormInput} name='password' label='Password' type='password'
                   validate={[required]} style={{width:'300px'}} />
            {hbc.authErr &&
              <div style={{color:'red', margin:'10px', maxWidth:'256px', fontSize:'14px'}}>
                {hbc.authErr.message || hbc.authErr.err || hbc.authErr}
              </div>
            }
          </div>
          <div style={{display:'flex', justifyContent:'space-between', margin:'22px 10px 0px 10px', alignItems:'center'}}>
            <Link to='/forgotpassword' className='linkButton'>
              Forgot your password?
            </Link>
            <div onClick={handleSubmit(this._submit)} className='dashboardButton'
                 style={{padding:'16px 32px', border:'none', borderRadius:'30px', color:'white', cursor:'pointer', zIndex:'2'}}>
              Login
            </div>
            <button style={{height:'0px', width:'0px', position:'absolute', outline:'none', border:'none', right:'10px', background:'none'}}
                    type='submit' disabled={pristine || submitting || !valid} />
          </div>
          <div style={{display:'flex', justifyContent:'space-between', margin:'30px 10px 0px 10px', alignItems:'center'}}>
            <Field component={GoogleButton} name='email' actions={actions} />
          </div>
        </form>
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

export default reduxForm({
  // a unique name for the form
  form: 'LoginForm'
})(connect(
  mapStateToProps,
  mapDispatchToProps
)(Login))