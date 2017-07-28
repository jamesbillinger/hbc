/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { Field, reduxForm } from 'redux-form';
import FormInput from 'components/formInput';
import MaskedInput from 'components/maskedInput';
import Button from 'components/button';
//import { auth } from 'src/auth';
import { required, email, phoneNumber, fullName, minLength } from '../validators';
import Logo from 'components/logo';

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
          revoke(err);
        } else {
          resolve(r);
        }
      });
    })
  }

  render () {
    const { handleSubmit, pristine, submitting, valid, actions } = this.props;
    return (
      <div style={{position:'absolute', top:'0px', right:'0px', bottom:'0px', left:'0px',
                   display:'flex', justifyContent:'center', paddingTop:'4vh'}}>
        <div>
          <div style={{display:'flex', justifyContent:'center', width:'100%'}}>
            <div style={{height:'30px', width:'100%', maxWidth:'600px', display:'flex', flexDirection:'column', marginBottom:'10px'}}>
              <Logo text='Register' />
            </div>
          </div>
          <div style={{display:'flex'}}>
            <div style={{borderRight:'1px solid #ddd', marginRight:'20px', paddingRight:'15px'}} className='content'>
              <h3 style={{textAlign:'center'}}>Register new account</h3>
              <form onSubmit={handleSubmit(this._submit)}>
                <div>
                  <Field component={FormInput} name='name' label='Name' autoFocus={true}
                         validate={[required, fullName]} />
                  <Field component={MaskedInput} name='phone' label='Phone' mask='(111) 111-1111'
                         validate={[phoneNumber]} />
                  <Field component={FormInput} name='email' label='Email Address'
                         validate={[required, email]} />
                  <Field component={FormInput} name='password' label='Password' type='password'
                         validate={[required, minLength(8)]} />
                </div>
                <div style={{display:'flex', justifyContent:'center', marginTop:'30px'}}>
                  <Button onClick={handleSubmit(this._submit)} disabled={pristine || submitting || !valid} primary={true} type='submit'>
                    Register
                  </Button>
                </div>
              </form>
            </div>
            <div style={{flex:'1 1 auto', minWidth:'250px'}} className='content'>
              <h3 style={{textAlign:'center'}}>Or...</h3>
              <div style={{marginTop:'40px', textAlign:'center'}}>
                <Field component={GoogleButton} name='email' actions={actions} />
              </div>
            </div>
          </div>
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

export default reduxForm({
  // a unique name for the form
  form: 'RegisterForm'
})(connect(
  mapStateToProps,
  mapDispatchToProps
)(Register))