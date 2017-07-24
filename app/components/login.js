/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { Field, reduxForm } from 'redux-form';
import FormInput from 'components/formInput';
import Button from 'components/button';
import { required, email } from '../validators';

class Login extends Component {
  constructor() {
    super();
  }

  componentWillMount() {
    this._submit = ::this.submit;
  }

  submit(data) {
    const { actions } = this.props;
    return new Promise((resolve, revoke) => {
      actions.login(data.email, data.password, (r, err) => {
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