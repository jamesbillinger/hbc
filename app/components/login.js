/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
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
import AbsoluteWrapper from 'components/absoluteWrapper';
import FacebookButton from 'components/facebookButton';

class GoogleButton extends Component {
  click() {
    const { actions, input } = this.props;
    actions.loginWithGoogle(input && input.value, (user, err) => {});
  }

  render() {
    return (
      <div className='registerButton' onClick={::this.click}
           style={{padding:'16px 30px', borderRadius:'30px', color:'#000', width:'200px', alignItems:'center',
             fontSize:'16px', cursor:'pointer', display:'flex', justifyContent:'center', marginBottom:'20px'}}>
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
      <AbsoluteWrapper>
        <form onSubmit={handleSubmit(this._submit)} style={{flex:'1 0 auto'}}>
          <div style={{paddingBottom:'20px', height:'60px', display:'flex', flexDirection:'column', width:'100%', paddingTop:'40px'}}>
            <Logo text='Login' large={true} />
          </div>
          <div>
            <Field component={FormInput} name='email' label='Email Address'
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
          <div style={{display:'flex', flexDirection:'column', alignItems:'center', margin:'30px 10px 0px 10px'}}>
            <Field component={GoogleButton} name='email' actions={actions} />
            {/*<Field component={FacebookButton} name='email' actions={actions} />*/}
          </div>
        </form>
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

export default reduxForm({
  // a unique name for the form
  form: 'LoginForm'
})(connect(
  mapStateToProps,
  mapDispatchToProps
)(Login))