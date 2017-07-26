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
    const { handleSubmit, pristine, submitting, valid } = this.props;
    return (
      <div style={{position:'absolute', top:'0px', right:'0px', bottom:'0px', left:'0px',
                   display:'flex', justifyContent:'center', alignItems:'center'}}>
        <form onSubmit={handleSubmit(this._submit)}>
          <div style={{paddingBottom:'50px'}}>
            <Logo text='Register' large={true} />
          </div>
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