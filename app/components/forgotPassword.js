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

class PasswordReset extends Component {
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
    const { actions, history } = this.props;
    return new Promise((resolve, revoke) => {
      actions.resetPassword(data.email, (r, err) => {
        if (err) {
          throw new SubmissionError({email:err.message});
          revoke();
        } else {
          resolve(r);
          history.push('/passwordreset');
        }
      });
    })
  }

  render () {
    const { handleSubmit, pristine, submitting, valid, hbc, actions } = this.props;
    return (
      <div style={{position:'absolute', top:'0px', right:'0px', bottom:'0px', left:'0px',
                   display:'flex', justifyContent:'center', alignItems:'center'}}>
        <form onSubmit={handleSubmit(this._submit)}>
          <div style={{display:'flex', justifyContent:'center', width:'100%'}}>
            <div style={{height:'30px', width:'100%', maxWidth:'600px', display:'flex', flexDirection:'column',
              marginBottom:'10px'}}>
              <Logo text='Lost?' large={true} />
            </div>
          </div>
          <div className='content'>
            <Field component={FormInput} name='email' label='Email Address' autoFocus={true}
                   validate={[required, email]} />
          </div>
          <div style={{display:'flex', justifyContent:'center', margin:'30px 10px 0px 10px'}}>
            <div onClick={handleSubmit(this._submit)} className='dashboardButton'
                 style={{padding:'16px 25px', border:'none', borderRadius:'30px', color:'white', cursor:'pointer'}}>
              Reset My Password
            </div>
            <button style={{height:'0px', width:'0px', position:'absolute', outline:'none', border:'none', background:'none'}}
                    type='submit' disabled={pristine || submitting || !valid} />
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
  form: 'PasswordResetForm'
})(connect(
  mapStateToProps,
  mapDispatchToProps
)(PasswordReset))