/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react'
import firebase from 'firebase';
import { Field, reduxForm } from 'redux-form';
import FormInput from 'components/formInput';
import Button from 'components/button';
import { required, email } from '../validators';
const providers = {
  google: new firebase.auth.GoogleAuthProvider()
};
providers.google.addScope('https://www.googleapis.com/auth/plus.login');

class Login extends Component {
  constructor() {
    super();
    this._submit = ::this.submit;
  }

  submit(data) {
    const { onLoggedIn } = this.props;
    const providerName = 'email';
    actions.login(data.email, data.password);
  }

  render () {
    const { handleSubmit, pristine, submitting, valid } = this.props;
    return (
      <div style={{position:'absolute', top:'0px', right:'0px', bottom:'0px', left:'0px',
                   display:'flex', justifyContent:'center', alignItems:'center'}}>
        <form onSubmit={handleSubmit(this._submit)}>
          <div>
            <Field component={FormInput} name='email' label='Email Address'
                   validate={[required, email]} />
            <Field component={FormInput} name='password' label='Password' type='password'
                   validate={[required]} />
          </div>
          <div style={{display:'flex', justifyContent:'center', marginTop:'30px'}}>
            <Button onClick={handleSubmit(this._submit)} disabled={pristine || submitting || !valid}
                    primary={true} type='submit'>
              Login
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

export default reduxForm({
  // a unique name for the form
  form: 'LoginForm'
})(Login)