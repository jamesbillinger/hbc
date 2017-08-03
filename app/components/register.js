/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import FormInput from 'components/formInput';
import MaskedInput from 'components/maskedInput';
import Button from 'components/button';
//import { auth } from 'src/auth';
import { required, email, phoneNumber, fullName, minLength } from '../validators';
import Logo from 'components/logo';
const minLength8 = minLength(8);
import AbsoluteWrapper from 'components/absoluteWrapper';

class GoogleButton extends Component {
  click() {
    const { actions, input } = this.props;
    actions.loginWithGoogle(input && input.value, (user, err) => {});
  }

  render() {
    return (
      <div className='registerButton' onClick={::this.click}
           style={{padding:'16px 30px', borderRadius:'30px', color:'#000', alignItems:'center',
             fontSize:'16px', cursor:'pointer', display:'flex', justifyContent:'center'}}>
        <img src='images/google.svg' height='20px' width='20px' />
        <div style={{paddingLeft:'10px'}}>Sign in with Google</div>
      </div>
    );
  }
}

class Register extends Component {
  constructor() {
    super();
  }

  componentWillMount() {
    this._submit = ::this.submit;
  }

  componentDidUpdate(prevProps, prevState) {
    const { hbc, history } = this.props;
    if (hbc.authErr && hbc.authErr !== prevProps.hbc.authErr) {
      if (hbc.authErr.code === 'auth/email-already-in-use') {
        //redirect to login and pass email address
        history.push('/login');
      }
    }
  }

  submit(data) {
    const { actions, history } = this.props;
    return new Promise((resolve, revoke) => {
      actions.register(data, (r, err) => {
        if (err) {
          throw new SubmissionError({password:err.message});
          revoke();
        } else {
          resolve(r);
        }
      });
    })
  }

  render () {
    const { handleSubmit, pristine, submitting, valid, actions } = this.props;
    return (
      <AbsoluteWrapper>
        <div style={{width:'600px', maxWidth:'100%', flex:'1 0 auto'}}>
          <div style={{paddingBottom:'20px', height:'60px', display:'flex', flexDirection:'column', width:'100%'}}>
            <Logo text='Register' />
          </div>
          <div style={{display:'flex', flexWrap:'wrap'}}>
            <div style={{borderRight:'1px solid #ddd', marginRight:'20px', paddingRight:'25px', flex:'1 1 auto'}}
                 className='content'>
              <h3 style={{textAlign:'center'}}>Sign in with social</h3>
              <div style={{marginTop:'40px', textAlign:'center'}}>
                <Field component={GoogleButton} name='email' actions={actions} />
              </div>
            </div>
            <div style={{flex:'1 0 auto'}} className='content'>
              <h3 style={{textAlign:'center'}}>...or register with email</h3>
              <form onSubmit={handleSubmit(this._submit)}>
                <div>
                  <Field component={FormInput} name='name' label='Name'
                         validate={[required, fullName]} />
                  <Field component={MaskedInput} name='phone' label='Phone' mask='(111) 111-1111'
                         validate={[phoneNumber]} />
                  <Field component={FormInput} name='email' label='Email Address'
                         validate={[required, email]} />
                  <Field component={FormInput} name='password' label='Password' type='password'
                         validate={[required, minLength8]} />
                </div>
                <div style={{display:'flex', justifyContent:'center', marginTop:'30px'}}>
                  <Button onClick={handleSubmit(this._submit)} disabled={pristine || submitting || !valid} primary={true} type='submit'>
                    Register
                  </Button>
                </div>
              </form>
            </div>
          </div>
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

export default reduxForm({
  // a unique name for the form
  form: 'RegisterForm'
})(connect(
  mapStateToProps,
  mapDispatchToProps
)(Register))